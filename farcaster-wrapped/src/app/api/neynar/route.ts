import { NextRequest, NextResponse } from 'next/server'

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2'

export async function POST(req: NextRequest) {
  try {
    const { endpoint, method = 'GET', body } = await req.json()

    const response = await fetch(`${NEYNAR_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'api_key': NEYNAR_API_KEY || '',
      },
      ...(body && { body: JSON.stringify(body) }),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from Neynar API' }, { status: 500 })
  }
}