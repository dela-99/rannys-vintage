// eslint-disable-next-line prettier/prettier
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-primary-soft flex items-center justify-center px-4 py-20">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md animate-[fade-up_0.7s_ease-out_both]">
        <div className="glass border border-white/20 rounded-3xl p-8 md:p-10 shadow-hover">
          <div className="text-center mb-8">
            <span className="font-accent text-[10px] uppercase tracking-[0.2em] text-primary">
              Join the Hub
            </span>
            <h1 className="font-display text-4xl mt-2 text-foreground">
              Create <em className="text-gradient not-italic">Account</em>
            </h1>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="font-accent text-[10px] text-muted-foreground ml-4">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  className="w-full rounded-full bg-white/50 border border-border px-12 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-accent text-[10px] text-muted-foreground ml-4">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  className="w-full rounded-full bg-white/50 border border-border px-12 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-accent text-[10px] text-muted-foreground ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  className="w-full rounded-full bg-white/50 border border-border px-12 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="group w-full font-accent inline-flex items-center justify-center gap-2 rounded-full gradient-primary py-4 text-xs font-semibold text-primary-foreground shadow-card transition hover:shadow-hover mt-4"
            >
              Start My Journey
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-muted-foreground uppercase tracking-widest">
          Chic · Stylishly Confident · Ranny's
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/signup")({
  component: () => <SignupPage />,
});
