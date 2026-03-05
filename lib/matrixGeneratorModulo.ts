import { Matrix, ModuloType } from './types';
import { validateMatrixModulo } from './matrixMathModulo';

/**
 * Generates a random valid matrix for Hill cipher with the specified modulo.
 */
export function generateRandomValidMatrix(size: 2 | 3 | 4, modulo: ModuloType): Matrix {
  const maxAttempts = 1000;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const matrix: Matrix = [];
    
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        row.push(Math.floor(Math.random() * modulo));
      }
      matrix.push(row);
    }
    
    const validation = validateMatrixModulo(matrix, modulo);
    if (validation.isValid) {
      return matrix;
    }
    
    attempts++;
  }
  
  // Fallback to known valid matrices
  if (size === 2) {
    if (modulo === 26) {
      return [[3, 3], [2, 5]];
    } else {
      return [[5, 8], [3, 7]];
    }
  } else if (size === 3) {
    if (modulo === 26) {
      return [[6, 24, 1], [13, 16, 10], [20, 17, 15]];
    } else {
      return [[6, 24, 1], [13, 16, 10], [20, 17, 15]];
    }
  } else {
    // size === 4
    if (modulo === 26) {
      return [[6, 24, 1, 13], [13, 16, 10, 20], [20, 17, 15, 6], [1, 2, 3, 5]];
    } else {
      return [[6, 24, 1, 13], [13, 16, 10, 20], [20, 17, 15, 6], [1, 2, 3, 5]];
    }
  }
}
