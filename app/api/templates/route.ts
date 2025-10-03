import { NextRequest, NextResponse } from 'next/server';
import { getAllTemplates, createTemplate } from '@/lib/templates';
import { validateTemplateForm } from '@/lib/validation';
import { ErrorCode, TemplateFormData } from '@/types';

/**
 * GET /api/templates
 * Fetch all templates with optional category filter
 * Requirements: 5.2, 5.4
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const templates = await getAllTemplates(category);

    return NextResponse.json({
      success: true,
      data: {
        templates,
        total: templates.length,
      },
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.API_ERROR,
          message: 'Failed to fetch templates',
          retryable: true,
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/templates
 * Create a new template
 * Requirements: 5.2, 5.3
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, prompt, previewImage } = body as TemplateFormData;

    // Validate template data
    const validation = validateTemplateForm({ name, category, prompt, previewImage });
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    // Create template
    const newTemplate = await createTemplate({
      name: name.trim(),
      category: category.trim(),
      prompt: prompt.trim(),
      previewImage: previewImage.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          template: newTemplate,
          message: 'Template created successfully',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.API_ERROR,
          message: 'Failed to create template',
          retryable: true,
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
