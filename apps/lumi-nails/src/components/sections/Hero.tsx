"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

const collage = [
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80",
    alt: "Soft nude almond nail extensions",
    className: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=80",
    alt: "Blush French tip manicure",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=700&q=80",
    alt: "Champagne chrome coffin nails",
    className: "",
  },
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(244,201,208,0.55),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(201,166,107,0.22),_transparent_50%)]" />
      <Container className="relative grid min-h-[100svh] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-20">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <p className="font-display text-5xl leading-[0.95] text-mauve sm:text-6xl lg:text-7xl">
            Lumi Nails
          </p>
          <h1 className="max-w-xl font-display text-3xl leading-tight text-ink sm:text-4xl">
            Soft luxury for every set.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-ink/70 sm:text-lg">
            Nail extensions and art with Aesop calm and Glossier ease—premium
            finishes, precise hygiene, lasting glow.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button href="/booking" size="lg">
              Book Now
            </Button>
            <Button href="/gallery" variant="secondary" size="lg">
              View Gallery
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="grid h-[52vh] min-h-[360px] grid-cols-2 grid-rows-2 gap-3 sm:h-[58vh] lg:h-[70vh]"
        >
          {collage.map((item, index) => (
            <motion.div
              key={item.src}
              className={`relative overflow-hidden rounded-2xl ${item.className}`}
              animate={
                reduce
                  ? undefined
                  : { y: index === 0 ? [0, -8, 0] : [0, 6, 0] }
              }
              transition={{
                duration: 7 + index,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 90vw, 45vw"
                className="object-cover"
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
