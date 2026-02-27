import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const POST = async (req: NextRequest) => {
  try {
    const { name } = await req.json();

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Ты — эксперт по маркетплейсам. Отвечай только чистым JSON без Markdown разметки."
        },
        {
          role: "user",
          content: `Сгенерируй SEO данные для товара: "${name}". 
          Формат: { "description": "...", "seoTitle": "...", "seoDescription": "...", "seoKeywords": ["...", "..."], "category": 2477 }`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(data);

  } catch (err: any) {
    console.error("Groq Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};