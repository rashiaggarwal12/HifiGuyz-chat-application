import { SparklesIcon, VideoIcon } from "lucide-react";
import Logo from "./Logo";

const avatar = (seed) => `https://api.dicebear.com/9.x/avataaars/png?seed=${seed}`;

const AuthHero = () => (
  <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary/25 via-base-300/40 to-secondary/20 lg:flex lg:flex-col lg:justify-center lg:p-12">
    <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-secondary/30 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-24 -left-10 size-72 rounded-full bg-primary/30 blur-3xl" />

    {/* Mock conversation */}
    <div className="relative mx-auto w-full max-w-sm space-y-4">
      <div className="flex items-end gap-3">
        <img src={avatar(7)} alt="" className="size-9 rounded-full bg-base-300" />
        <div className="glass-panel rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">
          Hola! ¿Cómo estás? 👋
        </div>
      </div>
      <div className="flex items-end justify-end gap-3">
        <div className="rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-sm text-white shadow-glow">
          Bien! Practicing my Spanish today 😄
        </div>
        <img src={avatar(23)} alt="" className="size-9 rounded-full bg-base-300" />
      </div>
      <div className="glass-panel flex items-center gap-3 rounded-2xl p-3">
        <div className="flex -space-x-3">
          {[7, 23, 51].map((s) => (
            <img
              key={s}
              src={avatar(s)}
              alt=""
              className="size-8 rounded-full bg-base-300 ring-2 ring-base-200"
            />
          ))}
        </div>
        <span className="text-sm text-base-content/80">Group call in progress</span>
        <span className="ml-auto grid size-8 place-items-center rounded-full bg-success/20">
          <VideoIcon className="size-4 text-success" />
        </span>
      </div>
    </div>

    <div className="relative mt-12 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-base-content/70 ring-1 ring-white/10">
        <SparklesIcon className="size-3.5 text-secondary" /> Language exchange, reimagined
      </span>
      <h2 className="mt-4 font-display text-3xl font-bold">
        Talk. Learn. <span className="text-gradient">Vibe.</span>
      </h2>
      <p className="mt-2 text-base-content/60">
        Chat and video call with language partners from around the world.
      </p>
    </div>
  </div>
);

const AuthShell = ({ title, subtitle, error, children }) => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-6">
    <div className="pointer-events-none absolute -left-40 -top-40 size-[32rem] rounded-full bg-primary/20 blur-[120px]" />
    <div className="pointer-events-none absolute -bottom-40 -right-40 size-[32rem] rounded-full bg-secondary/15 blur-[120px]" />

    <div className="glass-panel relative grid w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl lg:grid-cols-2">
      <div className="flex flex-col p-6 sm:p-10">
        <Logo />
        <div className="mb-8 mt-10">
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-base-content/60">{subtitle}</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            {error?.response?.data?.message || "Something went wrong. Please try again."}
          </div>
        )}

        {children}
      </div>

      <AuthHero />
    </div>
  </div>
);
export default AuthShell;
