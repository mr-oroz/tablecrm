import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const token = process.env.TABLECRM_TOKEN

  const response = await fetch(
    `https://app.tablecrm.com/api/v1/nomenclature?token=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([body]),
    }
  )

  const data = await response.json()

  return NextResponse.json(data, { status: response.status })
}