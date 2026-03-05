import { Matrix } from './types';
import { validateMatrix } from './matrixMath';

/**
 * Generates a random valid matrix for Hill cipher encryption.
 * The generated matrix will have a determinant coprime with 26.
 * 
 * @param size - The dimension of the matrix (2 for 2×2, 3 for 3×3)
 * @returns A valid random matrix with determinant coprime with 26
 * 
 * Preconditions:
 * - size is 2 or 3
 * 
 * Postconditions:
 * - Returns a size×size matrix
 * - All elements are in range [0, 25]
 * - Matrix has determinant coprime with 26 (gcd(det, 26) = 1)
 * - Matrix is valid for Hill cipher encryption
 */
export function generateRandomValidMatrix(size: 2 | 3): Matrix {
  const maxAttempts = 1000;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    // Generate random matrix with elements in [0, 25]
    const matrix: Matrix = Array(size)
      .fill(null)
      .map(() => 
        Array(size)
          .fill(null)
          .map(() => Math.floor(Math.random() * 26))
      );
    
    // Validate the matrix
    const validation = validateMatrix(matrix);
    
    // If valid, return it
    if (validation.isValid) {
      return matrix;
    }
    
    attempts++;
  }
  
  // Fallback: return a known valid matrix if random generation fails
  // This should be extremely rare
  if (size === 2) {
    // Known valid 2×2 matrix: [[3, 3], [2, 5]]
    // det = 3*5 - 3*2 = 15 - 6 = 9, gcd(9, 26) = 1
    return [[3, 3], [2, 5]];
  } else {
    // Known valid 3×3 matrix: [[6, 24, 1], [13, 16, 10], [20, 17, 15]]
    // det coprime with 26
    return [
      [6, 24, 1],
      [13, 16, 10],
      [20, 17, 15]
    ];
  }
}
