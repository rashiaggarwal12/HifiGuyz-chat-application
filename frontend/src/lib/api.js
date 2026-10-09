import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

export async function updateProfile(profileData) {
  const response = await axiosInstance.patch("/users/me", profileData);
  return response.data;
}

export async function rejectFriendRequest(requestId) {
  const response = await axiosInstance.delete(`/users/friend-request/${requestId}/reject`);
  return response.data;
}

export async function cancelFriendRequest(requestId) {
  const response = await axiosInstance.delete(`/users/friend-request/${requestId}`);
  return response.data;
}

export async function recordActivity(activity) {
  const response = await axiosInstance.post("/users/activity", activity);
  return response.data;
}

// fire-and-forget version that survives the page closing (tab closed, reload)
export function recordActivityOnExit(activity) {
  try {
    fetch(`${axiosInstance.defaults.baseURL}/users/activity`, {
      method: "POST",
      keepalive: true,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    }).catch(() => {});
  } catch {
    // nothing we can do while the page is unloading
  }
}
