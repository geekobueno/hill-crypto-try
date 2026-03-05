import { describe, it, expect } from 'vitest';
import {
  gcdExtended,
  modInverse,
  matrixDeterminant,
  matrixInverseMod26,
  multiplyMatrixVector,
  multiplyMatrices,
  validateMatrix
} from './matrixMath';
import { Matrix, Vector } from './types';

describe('gcdExtended', () => {
  it('should compute gcd and coefficients correctly', () => {
    const result = gcdExtended(26, 3);
    expect(result.gcd).toBe(1);
    // Verify: 26*x + 3*y = 1
    expect(26 * result.x + 3 * result.y).toBe(1);
  });

  it('should handle base case when b is 0', () => {
    const result = gcdExtended(5, 0);
    expect(result.gcd).toBe(5);
    expect(result.x).toBe(1);
    expect(result.y).toBe(0);
  });

  it('should compute gcd for non-coprime numbers', () => {
    const result = gcdExtended(12, 8);
    expect(result.gcd).toBe(4);
  });
});

describe('modInverse', () => {
  it('should compute modular inverse for coprime numbers', () => {
    const inverse = modInverse(3, 26);
    expect(inverse).not.toBeNull();
    if (inverse !== null) {
      expect((3 * inverse) % 26).toBe(1);
    }
  });

  it('should return null for non-coprime numbers', () => {
    const inverse = modInverse(2, 26);
    expect(inverse).toBeNull();
  });

  it('should handle negative numbers', () => {
    const inverse = modInverse(-3, 26);
    expect(inverse).not.toBeNull();
    if (inverse !== null) {
      expect((((-3) * inverse) % 26 + 26) % 26).toBe(1);
    }
  });

  it('should return result in range [0, m)', () => {
    const inverse = modInverse(7, 26);
    expect(inverse).not.toBeNull();
    if (inverse !== null) {
      expect(inverse).toBeGreaterThanOrEqual(0);
      expect(inverse).toBeLessThan(26);
    }
  });
});

describe('matrixDeterminant', () => {
  it('should calculate 2×2 determinant correctly', () => {
    const matrix: Matrix = [
      [3, 3],
      [2, 5]
    ];
    const det = matrixDeterminant(matrix);
    expect(det).toBe(3 * 5 - 3 * 2); // 15 - 6 = 9
  });

  it('should calculate 3×3 determinant correctly', () => {
    const matrix: Matrix = [
      [6, 24, 1],
      [13, 16, 10],
      [20, 17, 15]
    ];
    const det = matrixDeterminant(matrix);
    // Manual calculation: 6(16*15 - 10*17) - 24(13*15 - 10*20) + 1(13*17 - 16*20)
    // = 6(240 - 170) - 24(195 - 200) + 1(221 - 320)
    // = 6(70) - 24(-5) + 1(-99)
    // = 420 + 120 - 99 = 441
    expect(det).toBe(441);
  });

  it('should handle zero determinant', () => {
    const matrix: Matrix = [
      [2, 4],
      [1, 2]
    ];
    const det = matrixDeterminant(matrix);
    expect(det).toBe(0);
  });
});

describe('matrixInverseMod26', () => {
  it('should compute 2×2 inverse correctly', () => {
    const matrix: Matrix = [
      [3, 3],
      [2, 5]
    ];
    const inverse = matrixInverseMod26(matrix);
    expect(inverse).not.toBeNull();
    
    if (inverse) {
      // Verify: M * M^(-1) = I (mod 26)
      const product = multiplyMatrices(matrix, inverse);
      expect(product[0][0]).toBe(1);
      expect(product[0][1]).toBe(0);
      expect(product[1][0]).toBe(0);
      expect(product[1][1]).toBe(1);
    }
  });

  it('should compute 3×3 inverse correctly', () => {
    const matrix: Matrix = [
      [6, 24, 1],
      [13, 16, 10],
      [20, 17, 15]
    ];
    const inverse = matrixInverseMod26(matrix);
    expect(inverse).not.toBeNull();
    
    if (inverse) {
      // Verify: M * M^(-1) = I (mod 26)
      const product = multiplyMatrices(matrix, inverse);
      expect(product[0][0]).toBe(1);
      expect(product[0][1]).toBe(0);
      expect(product[0][2]).toBe(0);
      expect(product[1][0]).toBe(0);
      expect(product[1][1]).toBe(1);
      expect(product[1][2]).toBe(0);
      expect(product[2][0]).toBe(0);
      expect(product[2][1]).toBe(0);
      expect(product[2][2]).toBe(1);
    }
  });

  it('should return null for non-invertible matrix', () => {
    const matrix: Matrix = [
      [2, 4],
      [1, 2]
    ];
    const inverse = matrixInverseMod26(matrix);
    expect(inverse).toBeNull();
  });

  it('should return elements in range [0, 25]', () => {
    const matrix: Matrix = [
      [3, 3],
      [2, 5]
    ];
    const inverse = matrixInverseMod26(matrix);
    expect(inverse).not.toBeNull();
    
    if (inverse) {
      for (let i = 0; i < inverse.length; i++) {
        for (let j = 0; j < inverse[i].length; j++) {
          expect(inverse[i][j]).toBeGreaterThanOrEqual(0);
          expect(inverse[i][j]).toBeLessThan(26);
        }
      }
    }
  });
});

describe('multiplyMatrixVector', () => {
  it('should multiply 2×2 matrix by vector correctly', () => {
    const matrix: Matrix = [
      [3, 3],
      [2, 5]
    ];
    const vector: Vector = [7, 4]; // H=7, E=4
    const result = multiplyMatrixVector(matrix, vector);
    
    // Row 0: 3*7 + 3*4 = 21 + 12 = 33 ≡ 7 (mod 26)
    // Row 1: 2*7 + 5*4 = 14 + 20 = 34 ≡ 8 (mod 26)
    expect(result[0]).toBe(7);
    expect(result[1]).toBe(8);
  });

  it('should multiply 3×3 matrix by vector correctly', () => {
    const matrix: Matrix = [
      [6, 24, 1],
      [13, 16, 10],
      [20, 17, 15]
    ];
    const vector: Vector = [0, 19, 19]; // A=0, T=19, T=19
    const result = multiplyMatrixVector(matrix, vector);
    
    // Verify result is in valid range
    expect(result.length).toBe(3);
    result.forEach(val => {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(26);
    });
  });

  it('should return values in range [0, 25]', () => {
    const matrix: Matrix = [
      [25, 25],
      [25, 25]
    ];
    const vector: Vector = [25, 25];
    const result = multiplyMatrixVector(matrix, vector);
    
    result.forEach(val => {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(26);
    });
  });
});

describe('multiplyMatrices', () => {
  it('should multiply two 2×2 matrices correctly', () => {
    const a: Matrix = [
      [1, 2],
      [3, 4]
    ];
    const b: Matrix = [
      [5, 6],
      [7, 8]
    ];
    const result = multiplyMatrices(a, b);
    
    // [1*5+2*7, 1*6+2*8] = [19, 22]
    // [3*5+4*7, 3*6+4*8] = [43, 50] ≡ [17, 24] (mod 26)
    expect(result[0][0]).toBe(19);
    expect(result[0][1]).toBe(22);
    expect(result[1][0]).toBe(17);
    expect(result[1][1]).toBe(24);
  });

  it('should verify identity property with inverse', () => {
    const matrix: Matrix = [
      [3, 3],
      [2, 5]
    ];
    const inverse = matrixInverseMod26(matrix);
    expect(inverse).not.toBeNull();
    
    if (inverse) {
      const product = multiplyMatrices(matrix, inverse);
      expect(product[0][0]).toBe(1);
      expect(product[0][1]).toBe(0);
      expect(product[1][0]).toBe(0);
      expect(product[1][1]).toBe(1);
    }
  });
});

describe('validateMatrix', () => {
  it('should validate a valid 2×2 matrix', () => {
    const matrix: Matrix = [
      [3, 3],
      [2, 5]
    ];
    const validation = validateMatrix(matrix);
    
    expect(validation.isValid).toBe(true);
    expect(validation.gcd).toBe(1);
    expect(validation.error).toBeUndefined();
  });

  it('should validate a valid 3×3 matrix', () => {
    const matrix: Matrix = [
      [6, 24, 1],
      [13, 16, 10],
      [20, 17, 15]
    ];
    const validation = validateMatrix(matrix);
    
    expect(validation.isValid).toBe(true);
    expect(validation.gcd).toBe(1);
    expect(validation.error).toBeUndefined();
  });

  it('should reject matrix with non-coprime determinant', () => {
    const matrix: Matrix = [
      [2, 4],
      [1, 2]
    ];
    const validation = validateMatrix(matrix);
    
    expect(validation.isValid).toBe(false);
    expect(validation.gcd).not.toBe(1);
    expect(validation.error).toBeDefined();
    expect(validation.error).toContain('premier avec');
  });

  it('should reject non-square matrix', () => {
    const matrix: Matrix = [
      [1, 2, 3],
      [4, 5, 6]
    ];
    const validation = validateMatrix(matrix);
    
    expect(validation.isValid).toBe(false);
    expect(validation.error).toBe('La matrice doit être carrée');
  });

  it('should reject matrix with wrong dimensions', () => {
    const matrix: Matrix = [
      [1, 2, 3, 4, 5],
      [5, 6, 7, 8, 9],
      [9, 10, 11, 12, 13],
      [13, 14, 15, 16, 17],
      [17, 18, 19, 20, 21]
    ];
    const validation = validateMatrix(matrix);
    
    expect(validation.isValid).toBe(false);
    expect(validation.error).toBe('La matrice doit être 2×2, 3×3 ou 4×4');
  });

  it('should calculate determinant modulo 26', () => {
    const matrix: Matrix = [
      [3, 3],
      [2, 5]
    ];
    const validation = validateMatrix(matrix);
    
    // det = 3*5 - 3*2 = 9
    expect(validation.determinant).toBe(9);
  });
});
