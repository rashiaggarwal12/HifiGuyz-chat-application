import { useState } from "react";
import { Link } from "react-router";
import { ArrowRightIcon, LockIcon, MailIcon } from "lucide-react";
import useLogin from "../hooks/useLogin";
import AuthShell from "../components/AuthShell";
import Field from "../components/Field";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up your conversations where you left off."
      error={error}
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <Field
          label="Email"
          icon={MailIcon}
          type="email"
          placeholder="hello@example.com"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          required
        />
        <Field
          label="Password"
          icon={LockIcon}
          type="password"
          placeholder="••••••••"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          required
        />

        <button type="submit" className="btn-brand w-full gap-2" disabled={isPending}>
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-xs" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRightIcon className="size-4" />
            </>
          )}
        </button>

        <p className="pt-2 text-center text-sm text-base-content/60">
          New to HifiGuyz?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};
export default LoginPage;
