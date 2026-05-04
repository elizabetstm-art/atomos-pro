import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Bienvenue sur Atomos Learn API', version: '0.8' });
}
