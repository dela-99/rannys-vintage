import { useState } from "react";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl gradient-primary px-6 py-16 text-center text-primary-foreground shadow-hover md:px-16 md:py-24">
        <Mail className="mx-auto h-10 w-10 opacity-80" />
        <h2 className="font-display mt-4 text-4xl md:text-6xl">Be First For Every Drop</h2>
        <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
          Get notified the moment new pieces land. No spam, just the freshest fits.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setDone(true);
          }}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 rounded-full bg-white/15 px-6 py-4 text-sm text-white placeholder:text-white/60 backdrop-blur-md outline-none ring-1 ring-white/20 focus:ring-white/60"
          />
          <button
            type="submit"
            className="font-accent rounded-full bg-white px-8 py-4 text-xs font-semibold text-primary transition hover:bg-foreground hover:text-background"
          >
            {done ? "✓ You're In" : "Notify Me"}
          </button>
        </form>
      </div>
    </section>
  );
}
