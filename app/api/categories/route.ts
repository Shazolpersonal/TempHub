import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');
    const data = await fs.readFile(categoriesPath, 'utf-8');
    const categoriesData = JSON.parse(data);

    return NextResponse.json({
      categories: categoriesData.categories,
      total: categoriesData.categories.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        error: {
          code: 'API_ERROR',
          message: 'Failed to fetch categories',
          retryable: true,
        },
      },
      { status: 500 }
    );
  }
}
