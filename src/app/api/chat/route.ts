import { NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/openai";
import { chatSchema } from "@/lib/validation";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`chat:${ip}`, 10, 60_000);

  if (!limit.success) {
    return NextResponse.json({ ok: false, error: "Demasiadas solicitudes." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Mensaje inválido." },
        { status: 400 },
      );
    }

    const reply = await generateChatResponse(parsed.data.messages, parsed.data.locale);
    return NextResponse.json({ ok: true, reply });
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }
}
