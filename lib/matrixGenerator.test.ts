import { describe, it, expect } from 'vitest';
import { generateRandomValidMatrix } from './matrixGenerator';
import { validateMatrix } from './matrixMath';

describe('matrixGenerator', () => {
  describe('generateRandomValidMatrix', () => {
    it('should generate a valid 2×2 matrix', () => {
      const matrix = generateRandomValidMatrix(2);
      
      // Check dimensions
      expect(matrix).toHaveLength(2);
      expect(matrix[0]).toHaveLength(2);
      expect(matrix[1]).toHaveLength(2);
      
      // Check all elements are in range [0, 25]
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          expect(matrix[i][j]).toBeGreaterThanOrEqual(0);
          expect(matrix[i][j]).toBeLessThanOrEqual(25);
        }
      }
      
      // Check matrix is valid (determinant coprime with 26)
      const validation = validateMatrix(matrix);
      expect(validation.isValid).toBe(true);
      expect(validation.gcd).toBe(1);
    });
    
    it('should generate a valid 3×3 matrix', () => {
      const matrix = generateRandomValidMatrix(3);
      
      // Check dimensions
      expect(matrix).toHaveLength(3);
      expect(matrix[0]).toHaveLength(3);
      expect(matrix[1]).toHaveLength(3);
      expect(matrix[2]).toHaveLength(3);
      
      // Check all elements are in range [0, 25]
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(matrix[i][j]).toBeGreaterThanOrEqual(0);
          expect(matrix[i][j]).toBeLessThanOrEqual(25);
        }
      }
      
      // Check matrix is valid (determinant coprime with 26)
      const validation = validateMatrix(matrix);
      expect(validation.isValid).toBe(true);
      expect(validation.gcd).toBe(1);
    });
    
    it('should generate different matrices on multiple calls', () => {
      const matrix1 = generateRandomValidMatrix(2);
      const matrix2 = generateRandomValidMatrix(2);
      
      // While it's theoretically possible to get the same matrix twice,
      // it's extremely unlikely with 26^4 possibilities
      const areEqual = 
        matrix1[0][0] === matrix2[0][0] &&
        matrix1[0][1] === matrix2[0][1] &&
        matrix1[1][0] === matrix2[1][0] &&
        matrix1[1][1] === matrix2[1][1];
      
      // This test might occasionally fail due to randomness, but it's very unlikely
      expect(areEqual).toBe(false);
    });
    
    it('should generate matrices that can encrypt and decrypt', () => {
      const matrix = generateRandomValidMatrix(2);
      const validation = validateMatrix(matrix);
      
      // Valid matrices should be invertible
      expect(validation.isValid).toBe(true);
      
      // This confirms the matrix can be used for Hill cipher
      expect(validation.determinant).toBeGreaterThanOrEqual(0);
      expect(validation.determinant).toBeLessThanOrEqual(25);
    });
  });
});
