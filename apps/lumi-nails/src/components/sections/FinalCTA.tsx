import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/ui/FadeIn";

export function FinalCTA() {
  return (
    <section className="pb-8 pt-10">
      <Container>
        <FadeIn>
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-mauve via-[#7a4559] to-[#4f2a3a] px-6 py-14 text-center shadow-[0_20px_50px_rgba(107,58,79,0.25)] sm:px-10">
            <p className="font-display text-4xl text-cream sm:text-5xl">
              Ready for your next set?
            </p>
            <p className="mx-auto mt-4 max-w-lg text-sm text-cream/80 sm:text-base">
              Reserve a chair for extensions, gel, acrylic, or a custom art
              appointment.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/booking" variant="gold" size="lg">
                Book Now
              </Button>
              <Button
                href="/contact"
                variant="secondary"
                size="lg"
                className="border-white/30 bg-white/10 text-cream hover:bg-white/20"
              >
                Ask a question
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
