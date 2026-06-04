import { NextRequest, NextResponse } from "next/server";

type WaitlistPayload = {
  name?: string;
  phone?: string;
  source?: string;
  summary?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { name, phone, source, summary } =
      (await req.json()) as WaitlistPayload;

    // Validasi input
    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Nama dan nomor WhatsApp wajib diisi" },
        { status: 400 }
      );
    }

    if (!process.env.SHEETS_WEBHOOK_URL || !process.env.WEBHOOK_SECRET) {
      console.error("Waitlist webhook env not configured");
      return NextResponse.json(
        { error: "Konfigurasi server belum lengkap" },
        { status: 500 }
      );
    }

    // Payload sesuai struktur Apps Script (sheet "teman")
    const sourceLabel = source?.trim() || "unknown";
    const payload = {
      secret: process.env.WEBHOOK_SECRET,
      sheetName: "teman",
      fullName: name.trim(),
      whatsapp: phone.trim(),
      summary: summary?.trim() || "",
      source: `teman.ruangrasa (${sourceLabel})`,
      userAgent: req.headers.get("user-agent") || "",
    };

    const res = await fetch(process.env.SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Apps Script bisa lambat — beri waktu cukup
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Sheets webhook HTTP error:", res.status, errText);
      return NextResponse.json(
        { error: "Gagal menyimpan data, coba lagi" },
        { status: 502 }
      );
    }

    // Apps Script selalu balas 200 — cek field `ok` di body
    const data = await res
      .json()
      .catch(() => ({ ok: false, error: "invalid response" }));
    if (!data.ok) {
      console.error("Sheets webhook logic error:", data.error);
      return NextResponse.json(
        {
          error: "Gagal menyimpan data, coba lagi",
          detail: data.error || "unknown",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Waitlist route error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan, coba lagi nanti" },
      { status: 500 }
    );
  }
}
