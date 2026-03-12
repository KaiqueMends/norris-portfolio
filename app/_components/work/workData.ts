export type WorkItem = {
  slug: string;
  title: string;
  role: string;
  year: string;
  tags: string[];
  previewSrc: string;
  link?: string;
};

export const WORK: WorkItem[] = [
  {
    slug: "vivere_landpage",
    title: "Vivere Landpage",
    role: "Front-end",
    year: "2026",
    tags: ["React.js", "UI/UX", "Performance", "Alta Conversão"],
    previewSrc: "/work/vivere.png",
    link: "https://vivere-delta.vercel.app/",
  },
  {
    slug: "ArqSiria",
    title: "ArqSiria",
    role: "Front-end",
    year: "2025",
    tags: ["React.js", "UI/UX", "Performance", "Alta Conversão"],
    previewSrc: "/work/arqsiria.png",
    link: "https://site-siria-arq.vercel.app/",
  }
];

