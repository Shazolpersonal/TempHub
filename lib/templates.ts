import fs from 'fs/promises';
import path from 'path';
import { Template } from '@/types';

const DATA_PATH = path.join(process.cwd(), 'data', 'templates.json');

interface TemplateData {
  templates: Template[];
  categories: any[];
}

/**
 * Generate a unique ID for a new template
 */
function generateId(): string {
  return `template-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Read templates from JSON file
 */
async function readTemplatesFile(): Promise<TemplateData> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading templates file:', error);
    throw new Error('Failed to read templates data');
  }
}

/**
 * Save templates to JSON file
 */
async function saveTemplates(templates: Template[]): Promise<void> {
  try {
    const data = await readTemplatesFile();
    data.templates = templates;
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving templates:', error);
    throw new Error('Failed to save templates data');
  }
}

/**
 * Get all templates, optionally filtered by category
 */
export async function getAllTemplates(category?: string): Promise<Template[]> {
  const data = await readTemplatesFile();
  const { templates } = data;

  if (category && category !== 'all') {
    return templates.filter((t: Template) => t.category === category);
  }

  return templates;
}

/**
 * Get a single template by ID
 */
export async function getTemplateById(id: string): Promise<Template | null> {
  const templates = await getAllTemplates();
  return templates.find(t => t.id === id) || null;
}

/**
 * Create a new template
 */
export async function createTemplate(
  data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Template> {
  const templates = await getAllTemplates();

  const newTemplate: Template = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  templates.push(newTemplate);
  await saveTemplates(templates);

  return newTemplate;
}

/**
 * Update an existing template
 */
export async function updateTemplate(
  id: string,
  data: Partial<Omit<Template, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Template> {
  const templates = await getAllTemplates();
  const index = templates.findIndex(t => t.id === id);

  if (index === -1) {
    throw new Error('Template not found');
  }

  templates[index] = {
    ...templates[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await saveTemplates(templates);
  return templates[index];
}

/**
 * Delete a template by ID
 */
export async function deleteTemplate(id: string): Promise<void> {
  const templates = await getAllTemplates();
  const filtered = templates.filter(t => t.id !== id);

  if (filtered.length === templates.length) {
    throw new Error('Template not found');
  }

  await saveTemplates(filtered);
}
