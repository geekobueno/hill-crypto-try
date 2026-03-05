import { describe, it, expect } from 'vitest';
import {
  modInverseGeneric,
  matrixInverseModulo,
  multiplyMatrixVectorModulo,
  multiplyMatricesModulo,
  validateMatrixModulo
} from './matrixMathModulo';
import { Matrix, Vector } from './types';

describe('matrixMathModulo', () => {
  describe('modInverseGeneric', () => {
    it('calculates modular inverse for modulo 26', () => {
      expect(modInverseGeneric(9, 26)).toBe(3); // 9 * 3 = 27 ≡ 1 (mod 26)
      expect(modInverseGeneric(3, 26)).toBe(9); // 3 * 9 = 27 ≡ 1 (mod 26)
    });

    it('calculates modular inverse for modulo 37', () => {
      expect(modInverseGeneric(5, 37)).toBe(15); // 5 * 15 = 75 ≡ 1 (mod 37)
    });

    it('returns null when inverse does not exist', () => {
      expect(modInverseGeneric(13, 26)).toBeNull(); // gcd(13, 26) = 13
      expect(modInverseGeneric(0, 26)).toBeNull();
    });

    it('handles negative numbers', () => {
      expect(modInverseGeneric(-9, 26)).toBe(23); // -9 ≡ 17 (mod 26), inverse of 17 is 23
    });
  });

  describe('matrixInverseModulo', () => {
    describe('2x2 matrices', () => {
      it('calculates inverse for valid matrix with modulo 26', () => {
        const matrix: Matrix = [[3, 3], [2, 5]];
        const inverse = matrixInverseModulo(matrix, 26);
        
        expect(inverse).not.toBeNull();
        expect(inverse).toHaveLength(2);
        
        // Verify: M * M^(-1) ≡ I (mod 26)
        if (inverse) {
          const product = multiplyMatricesModulo(matrix, inverse, 26);
          expect(product[0][0]).toBe(1);
          expect(product[0][1]).toBe(0);
          expect(product[1][0]).toBe(0);
          expect(product[1][1]).toBe(1);
        }
      });

      it('calculates inverse for valid matrix with modulo 37', () => {
        const matrix: Matrix = [[5, 8], [3, 7]];
        const inverse = matrixInverseModulo(matrix, 37);
        
        expect(inverse).not.toBeNull();
        
        if (inverse) {
          const product = multiplyMatricesModulo(matrix, inverse, 37);
          expect(product[0][0]).toBe(1);
          expect(product[1][1]).toBe(1);
        }
      });

      it('returns null for singular matrix', () => {
        const matrix: Matrix = [[2, 4], [1, 2]]; // det = 0
        expect(matrixInverseModulo(matrix, 26)).toBeNull();
      });

      it('returns null when determinant is not coprime with modulo', () => {
        const matrix: Matrix = [[13, 1], [0, 1]]; // det = 13, gcd(13, 26) = 13
        expect(matrixInverseModulo(matrix, 26)).toBeNull();
      });
    });

    describe('3x3 matrices', () => {
      it('calculates inverse for valid 3x3 matrix with modulo 26', () => {
        const matrix: Matrix = [
          [6, 24, 1],
          [13, 16, 10],
          [20, 17, 15]
        ];
        const inverse = matrixInverseModulo(matrix, 26);
        
        expect(inverse).not.toBeNull();
        expect(inverse).toHaveLength(3);
        
        if (inverse) {
          const product = multiplyMatricesModulo(matrix, inverse, 26);
          // Check diagonal is 1
          expect(product[0][0]).toBe(1);
          expect(product[1][1]).toBe(1);
          expect(product[2][2]).toBe(1);
        }
      });
    });
  });

  describe('multiplyMatrixVectorModulo', () => {
    it('multiplies 2x2 matrix by vector with modulo 26', () => {
      const matrix: Matrix = [[3, 3], [2, 5]];
      const vector: Vector = [7, 4]; // H, E
      
      const result = multiplyMatrixVectorModulo(matrix, vector, 26);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toBe((3*7 + 3*4) % 26); // 33 % 26 = 7
      expect(result[1]).toBe((2*7 + 5*4) % 26); // 34 % 26 = 8
    });

    it('multiplies 3x3 matrix by vector with modulo 37', () => {
      const matrix: Matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];
      const vector: Vector = [1, 1, 1];
      
      const result = multiplyMatrixVectorModulo(matrix, vector, 37);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toBe(6); // 1+2+3 = 6
      expect(result[1]).toBe(15); // 4+5+6 = 15
      expect(result[2]).toBe(24); // 7+8+9 = 24
    });

    it('applies modulo correctly', () => {
      const matrix: Matrix = [[10, 10], [10, 10]];
      const vector: Vector = [5, 5];
      
      const result = multiplyMatrixVectorModulo(matrix, vector, 26);
      
      expect(result[0]).toBe((100) % 26); // 22
      expect(result[1]).toBe((100) % 26); // 22
    });
  });

  describe('multiplyMatricesModulo', () => {
    it('multiplies two 2x2 matrices with modulo 26', () => {
      const a: Matrix = [[3, 3], [2, 5]];
      const b: Matrix = [[15, 17], [20, 9]];
      
      const result = multiplyMatricesModulo(a, b, 26);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(2);
    });

    it('produces identity when multiplying matrix by its inverse', () => {
      const matrix: Matrix = [[3, 3], [2, 5]];
      const inverse = matrixInverseModulo(matrix, 26);
      
      expect(inverse).not.toBeNull();
      
      if (inverse) {
        const product = multiplyMatricesModulo(matrix, inverse, 26);
        
        expect(product[0][0]).toBe(1);
        expect(product[0][1]).toBe(0);
        expect(product[1][0]).toBe(0);
        expect(product[1][1]).toBe(1);
      }
    });
  });

  describe('validateMatrixModulo', () => {
    it('validates correct 2x2 matrix for modulo 26', () => {
      const matrix: Matrix = [[3, 3], [2, 5]];
      const validation = validateMatrixModulo(matrix, 26);
      
      expect(validation.isValid).toBe(true);
      expect(validation.determinant).toBe(9);
      expect(validation.gcd).toBe(1);
      expect(validation.error).toBeUndefined();
    });

    it('validates correct 3x3 matrix for modulo 37', () => {
      const matrix: Matrix = [
        [6, 24, 1],
        [13, 16, 10],
        [20, 17, 15]
      ];
      const validation = validateMatrixModulo(matrix, 37);
      
      expect(validation.isValid).toBe(true);
      expect(validation.gcd).toBe(1);
    });

    it('rejects matrix with determinant 0', () => {
      const matrix: Matrix = [[2, 4], [1, 2]];
      const validation = validateMatrixModulo(matrix, 26);
      
      expect(validation.isValid).toBe(false);
      expect(validation.determinant).toBe(0);
    });

    it('rejects matrix when determinant is not coprime with modulo', () => {
      const matrix: Matrix = [[13, 1], [0, 1]];
      const validation = validateMatrixModulo(matrix, 26);
      
      expect(validation.isValid).toBe(false);
      expect(validation.gcd).not.toBe(1);
      expect(validation.error).toContain('26');
    });

    it('rejects non-square matrix', () => {
      const matrix: Matrix = [[1, 2, 3], [4, 5, 6]];
      const validation = validateMatrixModulo(matrix, 26);
      
      expect(validation.isValid).toBe(false);
      expect(validation.error).toContain('carrée');
    });

    it('rejects matrix that is not 2x2, 3x3, or 4x4', () => {
      const matrix: Matrix = [[1]];
      const validation = validateMatrixModulo(matrix, 26);
      
      expect(validation.isValid).toBe(false);
      expect(validation.error).toContain('2×2, 3×3 ou 4×4');
    });
  });
});
