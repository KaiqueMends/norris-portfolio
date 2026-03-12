import { notFound } from "next/navigation";
import Link from "next/link";

import { WORK } from "../../_components/work/workData";

export default function WorkDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const item = WORK.find((w) => w.slug === params.slug);
  if (!item) notFound();

  return (
    <main className="px-6 pb-24 pt-28">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/#work"
          data-cursor="link"
          className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-neutral-200/80 ring-1 ring-white/10 transition hover:bg-white/10"
          style={{
            clipPath:
              "polygon(0% 0%, 94% 0%, 100% 50%, 94% 100%, 0% 100%, 2.5% 50%)",
          }}
        >
          ← VOLTAR
        </Link>

        <p className="mt-10 font-display text-xs tracking-[0.28em] text-neutral-400/90">
          {item.year} · {item.role}
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[0.9] tracking-tight md:text-7xl">
          {item.title}
        </h1>

        <div className="mt-6 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-neutral-200/70 ring-1 ring-white/10"
            >
              {t}
            </span>
          ))}
        </div>

        <div
          className="mt-10 overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ring-white/10"
          style={{
            clipPath:
              "polygon(0% 0%, 100% 0%, 100% 88%, 94% 100%, 0% 100%, 0% 18%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.previewSrc}
            alt={item.title}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>

        <p className="mt-10 max-w-2xl text-neutral-200/70">
          Página base do projeto. Próximo upgrade: transição estilo “modal route”
          com intercepting routes e navegação entre projetos.
        </p>
      </div>
    </main>
  );
}

