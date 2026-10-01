import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Section>
      <Container className="space-y-4">
        <h1 className="text-3xl font-semibold">Página no encontrada</h1>
        <p className="text-muted-foreground">
          La ruta solicitada no existe en este portafolio.
        </p>
        <Link href="/es" className="text-sm hover:underline">
          ← Volver a Home
        </Link>
      </Container>
    </Section>
  );
}
