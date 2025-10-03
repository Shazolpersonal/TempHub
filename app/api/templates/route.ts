import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ templates: [], total: 0 });
}

export async function POST() {
  return NextResponse.json({ message: 'Template created' });
}
