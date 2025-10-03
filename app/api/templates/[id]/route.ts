import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ template: null });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ message: 'Template updated' });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ message: 'Template deleted' });
}
