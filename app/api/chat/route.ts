import { NextRequest, NextResponse } from "next/server";

type ChatMessage = { role: "user" | "assistant"; content: string };

const BASE_PROMPT = `Kamu adalah RuangRasa AI, teman curhat virtual yang empatik dan tidak menghakimi. Tugasmu membantu user navigasi konflik pertemanan, drama grup, dan situasi sosial yang sulit.

Karakteristik:
- Gunakan Bahasa Indonesia santai (aku/kamu)
- Empati dulu, baru saran
- Beri perspektif netral, bukan berpihak
- Jawaban singkat dan personal (maksimal 3-4 kalimat)
- Hindari sok tahu, jangan menggurui
- Kalau situasinya serius (self-harm, depresi berat), arahkan ke psikolog profesional
- Fokus bantu user berpikir jernih, bukan kasih jawaban hitam-putih`;

const FOLLOWUP_INSTRUCTION = `

PENTING - Struktur setiap balasan:
1. Beri jawaban/tanggapan empatik atas cerita user
2. SELALU akhiri dengan SATU pertanyaan lanjutan yang relevan, untuk menggali lebih dalam atau bantu user berpikir. Pertanyaan harus terasa natural, bukan dipaksakan.

Contoh format: "[tanggapan empatik + perspektif]. [pertanyaan lanjutan]?"`;

const CLOSING_INSTRUCTION = `

PENTING - Ini balasan terakhir di sesi ini:
- Beri jawaban/tanggapan empatik yang hangat atas cerita user
- JANGAN akhiri dengan pertanyaan lanjutan apapun
- DI AKHIR jawaban, tambahkan ajakan singkat untuk gabung waitlist RuangRasa biar bisa lanjut cerita kapan-kapan dan dapat akses duluan pas launching
- Tutup dengan kalimat yang ramah, menenangkan, dan positif
- Tetap singkat (maksimal 4-5 kalimat) dan tone tetap hangat seperti teman dekat`;

export async function POST(req: NextRequest) {
  try {
    const { messages, finalTurn } = (await req.json()) as {
      messages: ChatMessage[];
      finalTurn?: boolean;
    };

    const systemContent =
      BASE_PROMPT + (finalTurn ? CLOSING_INSTRUCTION : FOLLOWUP_INSTRUCTION);

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemContent },
            ...messages.slice(-10),
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", response.status, errText);
      return NextResponse.json(
        { error: "Gagal terhubung ke RuangRasa AI" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ message });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}
