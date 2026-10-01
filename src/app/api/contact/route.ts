import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getResendClient } from "@/lib/resend";
import { contactSchema } from "@/lib/validation";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`contact:${ip}`, 5, 60_000);

  if (!limit.success) {
    return NextResponse.json({ ok: false, error: "Demasiadas solicitudes." }, { status: 429 });
  }

  const resend = getResendClient();
  if (!resend) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "El servicio de correo no está configurado. Configura RESEND_API_KEY o escribe directamente al correo del portafolio.",
      },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." },
        { status: 400 },
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const { name, email, message } = parsed.data;

    await resend.emails.send({
      from: "Portafolio <onboarding@resend.dev>",
      to: siteConfig.email,
      replyTo: email,
      subject: `Nuevo mensaje de ${name}`,
      text: message,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }
}
