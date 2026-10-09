import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import Logo from "../components/Logo";
import ProfileForm from "../components/ProfileForm";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-6">
      <div className="pointer-events-none absolute -left-40 -top-40 size-[32rem] rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-[32rem] rounded-full bg-secondary/15 blur-[120px]" />

      <div className="glass-panel relative w-full max-w-2xl rounded-3xl p-6 shadow-2xl sm:p-10">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-8 text-center font-display text-3xl font-bold">Set up your profile</h1>
        <p className="mb-8 mt-2 text-center text-base-content/60">
          Tell others a bit about you so they can find the right language partner.
        </p>

        <ProfileForm
          initialUser={authUser}
          onSubmit={onboardingMutation}
          isPending={isPending}
          submitLabel="Let's go"
          pendingLabel="Saving..."
        />
      </div>
    </div>
  );
};
export default OnboardingPage;
