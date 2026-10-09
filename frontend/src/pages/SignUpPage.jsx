import { useState } from "react";
import { Link } from "react-router";
import { ArrowRightIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import useSignUp from "../hooks/useSignUp";
import AuthShell from "../components/AuthShell";
import Field from "../components/Field";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <AuthShell
      title="Join HifiGuyz"
      subtitle="Create your account and start talking with language partners today."
      error={error}
    >
      <form onSubmit={handleSignup} className="space-y-5">
        <Field
          label="Full name"
          icon={UserIcon}
          type="text"
          placeholder="John Doe"
          value={signupData.fullName}
          onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
          required
        />
        <Field
          label="Email"
          icon={MailIcon}
          type="email"
          placeholder="john@gmail.com"
          value={signupData.email}
          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
          required
        />
        <Field
          label="Password"
          icon={LockIcon}
          type="password"
          placeholder="••••••••"
          hint="At least 6 characters"
          value={signupData.password}
          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
          required
        />

        <label className="flex cursor-pointer items-start gap-3 text-sm text-base-content/70">
          <input type="checkbox" className="checkbox-primary checkbox checkbox-sm mt-0.5" required />
          <span>
            I agree to the <span className="text-primary">terms of service</span> and{" "}
            <span className="text-primary">privacy policy</span>
          </span>
        </label>

        <button type="submit" className="btn-brand w-full gap-2" disabled={isPending}>
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-xs" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRightIcon className="size-4" />
            </>
          )}
        </button>

        <p className="pt-2 text-center text-sm text-base-content/60">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default SignUpPage;
