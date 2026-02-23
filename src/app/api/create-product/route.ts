import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  const response = await fetch(
    "https://app.tablecrm.com/api/v1/nomenclature?token=af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77",
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