import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const PROFILE_FIELDS = ["fullName", "bio", "nativeLanguage", "learningLanguage", "location", "profilePic"];

export async function updateProfile(req, res) {
  try {
    // only allow profile fields, so a request can't overwrite friends, email, etc.
    const updates = {};
    for (const field of PROFILE_FIELDS) {
      if (typeof req.body[field] === "string") updates[field] = req.body[field].trim();
    }

    if ("fullName" in updates && !updates.fullName) {
      return res.status(400).json({ message: "Name can't be empty" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
    } catch (streamError) {
      console.log("Error updating Stream user after profile update:", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in updateProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// recipient declines an incoming request
export async function rejectFriendRequest(req, res) {
  try {
    const friendRequest = await FriendRequest.findById(req.params.id);

    if (!friendRequest || friendRequest.status !== "pending") {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to reject this request" });
    }

    await friendRequest.deleteOne();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.log("Error in rejectFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// sender takes back a request they sent
export async function cancelFriendRequest(req, res) {
  try {
    const friendRequest = await FriendRequest.findById(req.params.id);

    if (!friendRequest || friendRequest.status !== "pending") {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to cancel this request" });
    }

    await friendRequest.deleteOne();

    res.status(200).json({ message: "Friend request cancelled" });
  } catch (error) {
    console.log("Error in cancelFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;
const isoDay = (date) => date.toISOString().slice(0, 10);

// Records practice (a message, correction or call) and updates the daily streak.
// The client sends its local date so streaks follow the user's own calendar day.
export async function recordActivity(req, res) {
  try {
    const { type, minutes, date } = req.body;

    if (!["message", "correction", "call"].includes(type)) {
      return res.status(400).json({ message: "Invalid activity type" });
    }

    // local date must be a real day within a day of the server's (time zones)
    const parsed = new Date(`${date}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date || "") ||
      Number.isNaN(parsed.getTime()) ||
      Math.abs(parsed.getTime() - Date.now()) > 2 * DAY_MS
    ) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const increments = {};
    if (type === "message") increments["stats.messagesSent"] = 1;
    if (type === "correction") increments["stats.correctionsGiven"] = 1;
    if (type === "call") {
      const callMinutes = Math.round(Number(minutes));
      if (!Number.isFinite(callMinutes) || callMinutes < 0 || callMinutes > 600) {
        return res.status(400).json({ message: "Invalid call length" });
      }
      increments["stats.callMinutes"] = callMinutes;
    }

    const user = await User.findById(req.user.id).select("stats");
    const stats = user.stats || {};
    const update = { $inc: increments };

    if (stats.lastPracticeDate !== date) {
      const yesterday = isoDay(new Date(parsed.getTime() - DAY_MS));
      const currentStreak = stats.lastPracticeDate === yesterday ? (stats.currentStreak || 0) + 1 : 1;
      update.$set = {
        "stats.lastPracticeDate": date,
        "stats.currentStreak": currentStreak,
        "stats.longestStreak": Math.max(currentStreak, stats.longestStreak || 0),
      };
    }

    const updated = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select("stats");
    res.status(200).json({ stats: updated.stats });
  } catch (error) {
    console.error("Error in recordActivity controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
