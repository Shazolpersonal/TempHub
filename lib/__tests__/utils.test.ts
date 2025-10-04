import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('utils.ts', () => {
  describe('cn (className utility)', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'excluded');
      expect(result).toBe('base conditional');
    });

    it('should handle undefined and null', () => {
      const result = cn('base', undefined, null, 'valid');
      expect(result).toBe('base valid');
    });

    it('should merge Tailwind classes correctly', () => {
      // twMerge should handle conflicting Tailwind classes
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle objects with boolean values', () => {
      const result = cn({
        'class1': true,
        'class2': false,
        'class3': true,
      });
      expect(result).toBe('class1 class3');
    });

    it('should handle empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle complex Tailwind merge scenarios', () => {
      const result = cn('text-red-500 bg-blue-500', 'text-green-500');
      expect(result).toBe('bg-blue-500 text-green-500');
    });

    it('should preserve non-conflicting classes', () => {
      const result = cn('hover:bg-blue-500 focus:ring-2', 'active:bg-blue-700');
      expect(result).toContain('hover:bg-blue-500');
      expect(result).toContain('focus:ring-2');
      expect(result).toContain('active:bg-blue-700');
    });
  });
});
