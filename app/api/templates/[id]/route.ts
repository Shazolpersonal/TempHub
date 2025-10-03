import { NextRequest, NextResponse } from 'next/server';
import { getTemplateById, updateTemplate, deleteTemplate } from '@/lib/templates';
import { validateTemplateForm } from '@/lib/validation';
import { ErrorCode, TemplateFormData } from '@/types';

/**
 * GET /api/templates/[id]
 * Fetch a single template by ID
 * Requirements: 5.4
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const template = await getTemplateById(id);

    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.TEMPLATE_NOT_FOUND,
            message: 'Template not found',
            retryable: false,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        template,
      },
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.API_ERROR,
          message: 'Failed to fetch template',
          retryable: true,
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/templates/[id]
 * Update an existing template
 * Requirements: 5.5
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, category, prompt, previewImage } = body as Partial<TemplateFormData>;

    // Build update data object with only provided fields
    const updateData: Partial<TemplateFormData> = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (prompt !== undefined) updateData.prompt = prompt;
    if (previewImage !== undefined) updateData.previewImage = previewImage;

    // Validate if any fields are provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: 'No fields provided for update',
            retryable: false,
          },
        },
        { status: 400 }
      );
    }

    // Validate template data
    const validation = validateTemplateForm(updateData);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    // Trim string values
    const trimmedData: Partial<TemplateFormData> = {};
    if (updateData.name) trimmedData.name = updateData.name.trim();
    if (updateData.category) trimmedData.category = updateData.category.trim();
    if (updateData.prompt) trimmedData.prompt = updateData.prompt.trim();
    if (updateData.previewImage) trimmedData.previewImage = updateData.previewImage.trim();

    // Update template
    const updatedTemplate = await updateTemplate(id, trimmedData);

    return NextResponse.json({
      success: true,
      data: {
        template: updatedTemplate,
        message: 'Template updated successfully',
      },
    });
  } catch (error) {
    console.error('Error updating template:', error);

    // Check if template not found
    if (error instanceof Error && error.message === 'Template not found') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.TEMPLATE_NOT_FOUND,
            message: 'Template not found',
            retryable: false,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.API_ERROR,
          message: 'Failed to update template',
          retryable: true,
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/templates/[id]
 * Delete a template by ID
 * Requirements: 5.6
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await deleteTemplate(id);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Template deleted successfully',
      },
    });
  } catch (error) {
    console.error('Error deleting template:', error);

    // Check if template not found
    if (error instanceof Error && error.message === 'Template not found') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.TEMPLATE_NOT_FOUND,
            message: 'Template not found',
            retryable: false,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.API_ERROR,
          message: 'Failed to delete template',
          retryable: true,
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
