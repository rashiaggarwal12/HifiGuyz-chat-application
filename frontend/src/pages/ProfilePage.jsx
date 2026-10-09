import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { updateProfile } from "../lib/api";
import ProfileForm from "../components/ProfileForm";
import StatsPanel from "../components/StatsPanel";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not update profile");
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Your profile</h1>
          <p className="mt-1 text-base-content/60">
            This is how other learners see you. Signed in as {authUser?.email}.
          </p>
        </div>

        <StatsPanel stats={authUser?.stats} />

        <h2 className="pt-2 font-display text-xl font-bold">Edit profile</h2>
        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          {/* key resets the form if the user data reloads */}
          <ProfileForm
            key={authUser?._id}
            initialUser={authUser}
            onSubmit={updateProfileMutation}
            isPending={isPending}
            submitLabel="Save changes"
            pendingLabel="Saving..."
          />
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
