import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../templates';
import { Template } from '@/types';
import fs from 'fs/promises';

// Mock fs/promises
vi.mock('fs/promises');

const mockTemplatesData = {
  templates: [
    {
      id: 'template-1',
      name: 'Test Template 1',
      category: 'product',
      prompt: 'Test prompt 1',
      previewImage: '/test1.jpg',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: 'template-2',
      name: 'Test Template 2',
      category: 'magazine',
      prompt: 'Test prompt 2',
      previewImage: '/test2.jpg',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: 'template-3',
      name: 'Test Template 3',
      category: 'product',
      prompt: 'Test prompt 3',
      previewImage: '/test3.jpg',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
  ],
  categories: [],
};

describe('templates.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock readFile to return our test data
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockTemplatesData));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAllTemplates', () => {
    it('should return all templates when no category specified', async () => {
      const templates = await getAllTemplates();
      
      expect(templates).toHaveLength(3);
      expect(templates[0].id).toBe('template-1');
      expect(templates[1].id).toBe('template-2');
      expect(templates[2].id).toBe('template-3');
    });

    it('should return all templates when category is "all"', async () => {
      const templates = await getAllTemplates('all');
      
      expect(templates).toHaveLength(3);
    });

    it('should filter templates by category', async () => {
      const templates = await getAllTemplates('product');
      
      expect(templates).toHaveLength(2);
      expect(templates[0].category).toBe('product');
      expect(templates[1].category).toBe('product');
    });

    it('should return empty array for non-existent category', async () => {
      const templates = await getAllTemplates('nonexistent');
      
      expect(templates).toHaveLength(0);
    });

    it('should throw error when file read fails', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('File not found'));
      
      await expect(getAllTemplates()).rejects.toThrow('Failed to read templates data');
    });
  });

  describe('getTemplateById', () => {
    it('should return template when found', async () => {
      const template = await getTemplateById('template-1');
      
      expect(template).not.toBeNull();
      expect(template?.id).toBe('template-1');
      expect(template?.name).toBe('Test Template 1');
    });

    it('should return null when template not found', async () => {
      const template = await getTemplateById('nonexistent');
      
      expect(template).toBeNull();
    });

    it('should return correct template from multiple matches', async () => {
      const template = await getTemplateById('template-2');
      
      expect(template?.id).toBe('template-2');
      expect(template?.name).toBe('Test Template 2');
    });
  });

  describe('createTemplate', () => {
    it('should create a new template with generated ID and timestamps', async () => {
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      
      const newTemplateData = {
        name: 'New Template',
        category: 'character',
        prompt: 'New prompt',
        previewImage: '/new.jpg',
      };
      
      const created = await createTemplate(newTemplateData);
      
      expect(created.id).toBeDefined();
      expect(created.id).toContain('template-');
      expect(created.name).toBe('New Template');
      expect(created.category).toBe('character');
      expect(created.createdAt).toBeDefined();
      expect(created.updatedAt).toBeDefined();
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should add template to existing templates', async () => {
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      
      const newTemplateData = {
        name: 'Another Template',
        category: 'product',
        prompt: 'Another prompt',
        previewImage: '/another.jpg',
      };
      
      await createTemplate(newTemplateData);
      
      // Verify writeFile was called with updated data
      expect(fs.writeFile).toHaveBeenCalled();
      const writeCall = vi.mocked(fs.writeFile).mock.calls[0];
      const writtenData = JSON.parse(writeCall[1] as string);
      expect(writtenData.templates).toHaveLength(4);
    });

    it('should throw error when save fails', async () => {
      vi.mocked(fs.writeFile).mockRejectedValue(new Error('Write failed'));
      
      const newTemplateData = {
        name: 'New Template',
        category: 'product',
        prompt: 'New prompt',
        previewImage: '/new.jpg',
      };
      
      await expect(createTemplate(newTemplateData)).rejects.toThrow('Failed to save templates data');
    });
  });

  describe('updateTemplate', () => {
    it('should update existing template', async () => {
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      
      const updates = {
        name: 'Updated Name',
        prompt: 'Updated prompt',
      };
      
      const updated = await updateTemplate('template-1', updates);
      
      expect(updated.id).toBe('template-1');
      expect(updated.name).toBe('Updated Name');
      expect(updated.prompt).toBe('Updated prompt');
      expect(updated.category).toBe('product'); // Unchanged
      expect(updated.updatedAt).toBeDefined();
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should throw error when template not found', async () => {
      await expect(updateTemplate('nonexistent', { name: 'Test' })).rejects.toThrow('Template not found');
    });

    it('should update only specified fields', async () => {
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      
      const updated = await updateTemplate('template-2', { name: 'New Name Only' });
      
      expect(updated.name).toBe('New Name Only');
      expect(updated.category).toBe('magazine'); // Unchanged
      expect(updated.prompt).toBe('Test prompt 2'); // Unchanged
    });

    it('should update timestamp on update', async () => {
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      
      const originalTime = '2025-01-01T00:00:00.000Z';
      const updated = await updateTemplate('template-1', { name: 'Updated' });
      
      expect(updated.updatedAt).not.toBe(originalTime);
    });
  });

  describe('deleteTemplate', () => {
    it('should delete existing template', async () => {
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      
      await deleteTemplate('template-1');
      
      expect(fs.writeFile).toHaveBeenCalled();
      const writeCall = vi.mocked(fs.writeFile).mock.calls[0];
      const writtenData = JSON.parse(writeCall[1] as string);
      expect(writtenData.templates).toHaveLength(2);
      expect(writtenData.templates.find((t: Template) => t.id === 'template-1')).toBeUndefined();
    });

    it('should throw error when template not found', async () => {
      await expect(deleteTemplate('nonexistent')).rejects.toThrow('Template not found');
    });

    it('should not modify other templates when deleting', async () => {
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      
      await deleteTemplate('template-2');
      
      const writeCall = vi.mocked(fs.writeFile).mock.calls[0];
      const writtenData = JSON.parse(writeCall[1] as string);
      expect(writtenData.templates).toHaveLength(2);
      expect(writtenData.templates.find((t: Template) => t.id === 'template-1')).toBeDefined();
      expect(writtenData.templates.find((t: Template) => t.id === 'template-3')).toBeDefined();
    });
  });
});
