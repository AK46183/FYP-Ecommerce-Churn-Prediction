import { Mail } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function NewsletterBanner() {
  return (
    <section className="bg-blush-soft py-14">
      <div className="container-nexora">
        <Reveal className="flex flex-col items-center gap-6 rounded-3xl bg-blush px-6 py-10 text-center md:flex-row md:justify-between md:px-12 md:text-left">
          <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-ink">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-[20px] font-extrabold text-ink">Join the Nexora Circle</h2>
              <p className="mt-1 text-[13px] text-ink/70">
                Be the first to know about new arrivals, drops, and exclusive offers.
              </p>
            </div>
          </div>

          <form
            className="flex w-full max-w-sm items-center gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="hero-newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="hero-newsletter-email"
              type="email"
              required
              placeholder="Enter your email"
              className="h-12 w-full min-w-0 rounded-full border border-ink/15 bg-paper px-4 text-[14px] text-ink placeholder:text-slate focus-visible:outline-signal"
            />
            <Button type="submit" variant="primary" className="shrink-0">
              Subscribe
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
