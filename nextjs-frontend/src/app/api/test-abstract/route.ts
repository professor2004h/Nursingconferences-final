import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Abstract API test successful',
    timestamp: new Date().toISOString()
  })
}
