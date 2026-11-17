import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";

const pillars = [
  {
    title: "Hygiene first",
    body: "Single-use tools where it matters, sterilized metal, and a spotless station for every guest.",
  },
  {
    title: "Premium products",
    body: "Salon-grade gels, acrylics, and top coats chosen for clarity, wear, and gentle removal.",
  },
  {
    title: "Long-lasting wear",
    body: "Structure, adhesion, and finish calibrated so your set stays beautiful between appointments.",
  },
];

export function WhyUs() {
  return (
    <section className="py-20">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Why Lumi"
            title="Quiet luxury, careful craft"
            description="Three promises we keep on every visit."
            align="center"
          />
        </FadeIn>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {pillars.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.08} className="text-center">
              <div className="mx-auto mb-5 h-px w-12 bg-gold" />
              <h3 className="font-display text-2xl text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">
                {item.body}
              </p>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
