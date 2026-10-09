import { useState } from "react";
import toast from "react-hot-toast";
import { LoaderIcon, MapPinIcon, ShuffleIcon, UserIcon } from "lucide-react";
import { LANGUAGES } from "../constants";
import Avatar from "./Avatar";
import Field from "./Field";

const labelClass = "mb-1.5 block text-sm font-medium text-base-content/80";

// Shared by onboarding and the profile page
const ProfileForm = ({ initialUser, onSubmit, isPending, submitLabel, pendingLabel }) => {
  const [formState, setFormState] = useState({
    fullName: initialUser?.fullName || "",
    bio: initialUser?.bio || "",
    nativeLanguage: initialUser?.nativeLanguage || "",
    learningLanguage: initialUser?.learningLanguage || "",
    location: initialUser?.location || "",
    profilePic: initialUser?.profilePic || "",
  });

  const update = (field) => (e) => setFormState({ ...formState, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://api.dicebear.com/9.x/avataaars/png?seed=${idx}`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* PROFILE PIC */}
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full shadow-glow-lg">
          <Avatar src={formState.profilePic} name={formState.fullName} size="size-28" ring />
        </div>
        <button
          type="button"
          onClick={handleRandomAvatar}
          className="btn btn-sm gap-2 border-white/10 bg-white/5 hover:bg-white/10"
        >
          <ShuffleIcon className="size-4" />
          Shuffle avatar
        </button>
      </div>

      <Field
        label="Full name"
        icon={UserIcon}
        name="fullName"
        value={formState.fullName}
        onChange={update("fullName")}
        placeholder="Your full name"
      />

      <label className="block">
        <span className={labelClass}>Bio</span>
        <textarea
          name="bio"
          value={formState.bio}
          onChange={update("bio")}
          className="field-textarea h-24"
          placeholder="Tell others about yourself and your language learning goals"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Native language</span>
          <select
            name="nativeLanguage"
            value={formState.nativeLanguage}
            onChange={update("nativeLanguage")}
            className="field-select"
          >
            <option value="">Select your native language</option>
            {LANGUAGES.map((lang) => (
              <option key={`native-${lang}`} value={lang.toLowerCase()}>
                {lang}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>Learning language</span>
          <select
            name="learningLanguage"
            value={formState.learningLanguage}
            onChange={update("learningLanguage")}
            className="field-select"
          >
            <option value="">Select language you're learning</option>
            {LANGUAGES.map((lang) => (
              <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                {lang}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Field
        label="Location"
        icon={MapPinIcon}
        name="location"
        value={formState.location}
        onChange={update("location")}
        placeholder="City, Country"
      />

      <button className="btn-brand w-full gap-2" disabled={isPending} type="submit">
        {isPending ? (
          <>
            <LoaderIcon className="size-4 animate-spin" />
            {pendingLabel}
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
};
export default ProfileForm;
