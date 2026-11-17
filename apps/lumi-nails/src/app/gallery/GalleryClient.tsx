"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCategories, getDesignById, getDesigns } from "@/lib/api";
import type { Design, DesignShape } from "@/lib/types";
import { SHAPES } from "@/lib/constants";
import { formatDuration, formatPrice } from "@/lib/utils";
import { useToast } from "@/components/providers/ToastProvider";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DesignCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeIn } from "@/components/ui/FadeIn";

const PAGE_SIZE = 6;

export function GalleryClient() {
  const searchParams = useSearchParams();
  const { error } = useToast();

  const [designs, setDesigns] = useState<Design[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [allColors, setAllColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [category, setCategory] = useState("");
  const [shape, setShape] = useState<DesignShape | "">("");
  const [color, setColor] = useState("");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<Design | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [allDesigns, categoryData] = await Promise.all([
          getDesigns(),
          getCategories(),
        ]);
        if (!alive) return;
        const colorSet = new Set<string>();
        allDesigns.forEach((d) => d.colors.forEach((c) => colorSet.add(c)));
        setAllColors(Array.from(colorSet).sort());
        setCategories(categoryData);
      } catch {
        // filtered load still surfaces toast
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const designData = await getDesigns({
        category: category || undefined,
        shape: shape || undefined,
        color: color || undefined,
        search: search || undefined,
      });
      setDesigns(designData);
      setVisible(PAGE_SIZE);
    } catch {
      error("Could not load gallery designs.");
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  }, [category, shape, color, search, error]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    const designId = searchParams.get("design");
    if (!designId) return;
    let alive = true;
    (async () => {
      try {
        const design = await getDesignById(designId);
        if (alive && design) {
          setSelected(design);
          setModalOpen(true);
        }
      } catch {
        error("Could not open that design.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [searchParams, error]);

  const visibleDesigns = designs.slice(0, visible);

  return (
    <div className="py-14 sm:py-16">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Gallery"
            title="Find your next set"
            description="Filter by category, shape, and color—or search by vibe."
          />
        </FadeIn>

        <div className="mt-8 space-y-5">
          <Input
            label="Search designs"
            placeholder="e.g. bridal, chrome, floral"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/50">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge active={!category} onClick={() => setCategory("")}>
                All
              </Badge>
              {categories.map((item) => (
                <Badge
                  key={item}
                  active={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/50">
              Shape
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge active={!shape} onClick={() => setShape("")}>
                All
              </Badge>
              {SHAPES.map((item) => (
                <Badge
                  key={item}
                  active={shape === item}
                  onClick={() => setShape(item)}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/50">
              Color
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge active={!color} onClick={() => setColor("")}>
                All
              </Badge>
              {allColors.map((item) => (
                <Badge
                  key={item}
                  active={color === item}
                  onClick={() => setColor(item)}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="mb-4 break-inside-avoid">
                  <DesignCardSkeleton />
                </div>
              ))
            : null}

          {!loading && visibleDesigns.length === 0 ? (
            <div className="break-inside-avoid">
              <EmptyState
                title="No designs match"
                description="Try clearing filters or searching a different keyword."
                actionLabel="Reset filters"
                onAction={() => {
                  setCategory("");
                  setShape("");
                  setColor("");
                  setSearch("");
                }}
              />
            </div>
          ) : null}

          {!loading
            ? visibleDesigns.map((design) => (
                <button
                  key={design._id}
                  type="button"
                  className="mb-4 w-full break-inside-avoid text-left"
                  onClick={() => {
                    setSelected(design);
                    setModalOpen(true);
                  }}
                >
                  <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/40 shadow-[0_10px_30px_rgba(31,26,28,0.06)] backdrop-blur-md transition hover:-translate-y-0.5">
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={design.imageUrl}
                        alt={design.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1 p-4">
                      <p className="font-medium text-ink">{design.title}</p>
                      <p className="text-sm text-ink/60">
                        {design.category} · {design.shape}
                      </p>
                      <p className="text-sm text-mauve">
                        {formatPrice(design.price)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            : null}
        </div>

        {!loading && visible < designs.length ? (
          <div className="mt-8 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Load more
            </Button>
          </div>
        ) : null}
      </Container>

      <Modal
        open={modalOpen && !!selected}
        onClose={() => setModalOpen(false)}
        title={selected?.title}
        className="max-w-xl"
      >
        {selected ? (
          <div className="space-y-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={selected.imageUrl}
                alt={selected.title}
                fill
                sizes="512px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{selected.category}</Badge>
              <Badge>{selected.shape}</Badge>
              {selected.colors.map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </div>
            <p className="text-sm text-ink/70">
              {formatPrice(selected.price)} ·{" "}
              {formatDuration(selected.durationMin)}
            </p>
            <Button
              href={`/booking?designId=${selected._id}`}
              className="w-full"
            >
              Book this design
            </Button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
