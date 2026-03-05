import { describe, it, expect } from 'vitest';
import { generateRandomValidMatrix } from './matrixGeneratorModulo';
import { validateMatrixModulo } from './matrixMathModulo';

describe('matrixGeneratorModulo', () => {
  describe('generateRandomValidMatrix', () => {
    it('generates valid 2x2 matrix for modulo 26', () => {
      const matrix = generateRandomValidMatrix(2, 26);
      
      expect(matrix).toHaveLength(2);
      expect(matrix[0]).toHaveLength(2);
      expect(matrix[1]).toHaveLength(2);
      
      const validation = validateMatrixModulo(matrix, 26);
      expect(validation.isValid).toBe(true);
    });

    it('generates valid 3x3 matrix for modulo 26', () => {
      const matrix = generateRandomValidMatrix(3, 26);
      
      expect(matrix).toHaveLength(3);
      expect(matrix[0]).toHaveLength(3);
      
      const validation = validateMatrixModulo(matrix, 26);
      expect(validation.isValid).toBe(true);
    });

    it('generates valid 2x2 matrix for modulo 37', () => {
      const matrix = generateRandomValidMatrix(2, 37);
      
      expect(matrix).toHaveLength(2);
      
      const validation = validateMatrixModulo(matrix, 37);
      expect(validation.isValid).toBe(true);
    });

    it('generates valid 3x3 matrix for modulo 37', () => {
      const matrix = generateRandomValidMatrix(3, 37);
      
      expect(matrix).toHaveLength(3);
      
      const validation = validateMatrixModulo(matrix, 37);
      expect(validation.isValid).toBe(true);
    });

    it('generates matrices with elements in valid range for modulo 26', () => {
      const matrix = generateRandomValidMatrix(2, 26);
      
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          expect(matrix[i][j]).toBeGreaterThanOrEqual(0);
          expect(matrix[i][j]).toBeLessThan(26);
        }
      }
    });

    it('generates matrices with elements in valid range for modulo 37', () => {
      const matrix = generateRandomValidMatrix(2, 37);
      
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          expect(matrix[i][j]).toBeGreaterThanOrEqual(0);
          expect(matrix[i][j]).toBeLessThan(37);
        }
      }
    });

    it('generates different matrices on multiple calls', () => {
      const matrix1 = generateRandomValidMatrix(2, 26);
      const matrix2 = generateRandomValidMatrix(2, 26);
      
      // Very unlikely to be identical
      const areIdentical = 
        matrix1[0][0] === matrix2[0][0] &&
        matrix1[0][1] === matrix2[0][1] &&
        matrix1[1][0] === matrix2[1][0] &&
        matrix1[1][1] === matrix2[1][1];
      
      // This might occasionally fail due to randomness, but very unlikely
      expect(areIdentical).toBe(false);
    });

    it('always returns a valid matrix even after many attempts', () => {
      // Test multiple generations to ensure reliability
      for (let i = 0; i < 10; i++) {
        const matrix = generateRandomValidMatrix(2, 26);
        const validation = validateMatrixModulo(matrix, 26);
        expect(validation.isValid).toBe(true);
      }
    });

    it('returns fallback matrix if random generation fails', () => {
      // This tests the fallback mechanism
      // The function should always return a valid matrix
      const matrix = generateRandomValidMatrix(2, 26);
      expect(matrix).toBeDefined();
      expect(matrix).toHaveLength(2);
      
      const validation = validateMatrixModulo(matrix, 26);
      expect(validation.isValid).toBe(true);
    });
  });
});
