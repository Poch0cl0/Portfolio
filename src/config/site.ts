export const siteConfig = {
  name: "Jefferson Peña Serrano",
  shortName: "Jefferson Peña",
  role: "Desarrollador Full-Stack",
  description:
    "Portafolio profesional de Jefferson Peña Serrano. Proyectos full-stack con Next.js, React, TypeScript y arquitecturas escalables.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "es-PE",
  location: "Trujillo, Perú",
  university: "Universidad Nacional de Trujillo",
  email: "jefferson152530@gmail.com",
  github: "https://github.com/Poch0cl0",
  linkedin: "https://www.linkedin.com/in/jefferson-pe%C3%B1a-4ab9462a6/",
  cvPath: "/cv/cv-jefferson-pena-serrano.pdf",
  avatarPath: "/images/avatar/jefferson.jpg",
  defaultOgImage: "/images/og/default-og.webp",
  availableForProjects: true,
} as const;
