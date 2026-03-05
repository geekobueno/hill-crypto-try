import { Matrix, Vector, MatrixValidation } from './types';

/**
 * Extended Euclidean Algorithm result
 */
interface ExtendedGCDResult {
  gcd: number;
  x: number;
  y: number;
}

/**
 * Computes the extended Euclidean algorithm for two integers.
 * Returns gcd(a, b) and coefficients x, y such that a*x + b*y = gcd(a, b).
 * 
 * @param a - First integer
 * @param b - Second integer
 * @returns Object containing gcd, x, and y coefficients
 * 
 * Preconditions:
 * - a and b are integers
 * 
 * Postconditions:
 * - Returns gcd(a, b)
 * - Returns coefficients x, y where a*x + b*y = gcd(a, b)
 */
export function gcdExtended(a: number, b: number): ExtendedGCDResult {
  // Ensure both numbers are non-negative integers
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  
  // Handle edge cases
  if (isNaN(a) || isNaN(b) || !isFinite(a) || !isFinite(b)) {
    return { gcd: 0, x: 0, y: 0 };
  }
  
  // Base case: if b is 0, gcd is a
  if (b === 0) {
    return { gcd: a, x: 1, y: 0 };
  }
  
  // Base case: if a is 0, gcd is b
  if (a === 0) {
    return { gcd: b, x: 0, y: 1 };
  }
  
  // Use iterative approach to avoid stack overflow
  let x0 = 1, x1 = 0;
  let y0 = 0, y1 = 1;
  let a0 = a, b0 = b;
  
  while (b0 !== 0) {
    const q = Math.floor(a0 / b0);
    const temp_b = b0;
    b0 = a0 % b0;
    a0 = temp_b;
    
    const temp_x = x1;
    x1 = x0 - q * x1;
    x0 = temp_x;
    
    const temp_y = y1;
    y1 = y0 - q * y1;
    y0 = temp_y;
  }
  
  return { gcd: a0, x: x0, y: y0 };
}

/**
 * Computes the modular multiplicative inverse of a modulo m.
 * Returns x such that (a * x) mod m = 1, or null if no inverse exists.
 * 
 * @param a - The number to find the inverse of
 * @param m - The modulus (26 for Hill cipher)
 * @returns The modular inverse, or null if it doesn't exist
 * 
 * Preconditions:
 * - a is an integer
 * - m is a positive integer
 * 
 * Postconditions:
 * - Returns integer x where (a * x) mod m = 1 if gcd(a, m) = 1
 * - Returns null if gcd(a, m) ≠ 1
 * - If result exists: 0 ≤ result < m
 */
export function modInverse(a: number, m: number): number | null {
  // Normalize a to be positive
  a = ((a % m) + m) % m;
  
  const result = gcdExtended(a, m);
  
  // Inverse exists only if gcd(a, m) = 1
  if (result.gcd !== 1) {
    return null;
  }
  
  // Ensure the result is positive and in range [0, m)
  return ((result.x % m) + m) % m;
}

/**
 * Calculates the determinant of a square matrix (2×2, 3×3, or 4×4).
 * For 2×2: det = a*d - b*c
 * For 3×3: uses cofactor expansion along the first row
 * For 4×4: uses cofactor expansion along the first row
 * 
 * @param matrix - Square matrix (2×2, 3×3, or 4×4)
 * @returns The determinant value
 * 
 * Preconditions:
 * - matrix is a square matrix (n × n)
 * - matrix.length > 0
 * - All rows have equal length: matrix[i].length === matrix.length for all i
 * 
 * Postconditions:
 * - Returns determinant value as integer
 * - For 2×2 matrix: det = (a*d - b*c)
 * - For 3×3 and 4×4 matrix: uses cofactor expansion
 */
export function matrixDeterminant(matrix: Matrix): number {
  const n = matrix.length;
  
  if (n === 2) {
    // 2×2 determinant: ad - bc
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  } else if (n === 3) {
    // 3×3 determinant using cofactor expansion along first row
    // det = a(ei - fh) - b(di - fg) + c(dh - eg)
    const a = matrix[0][0], b = matrix[0][1], c = matrix[0][2];
    const d = matrix[1][0], e = matrix[1][1], f = matrix[1][2];
    const g = matrix[2][0], h = matrix[2][1], i = matrix[2][2];
    
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  } else if (n === 4) {
    // 4×4 determinant using cofactor expansion along first row
    let det = 0;
    for (let j = 0; j < 4; j++) {
      // Create 3×3 minor by removing row 0 and column j
      const minor: Matrix = [];
      for (let i = 1; i < 4; i++) {
        const row: number[] = [];
        for (let k = 0; k < 4; k++) {
          if (k !== j) {
            row.push(matrix[i][k]);
          }
        }
        minor.push(row);
      }
      // Calculate cofactor: (-1)^(0+j) * matrix[0][j] * det(minor)
      const sign = j % 2 === 0 ? 1 : -1;
      det += sign * matrix[0][j] * matrixDeterminant(minor);
    }
    return det;
  }
  
  throw new Error(`Unsupported matrix size: ${n}×${n}. Only 2×2, 3×3, and 4×4 matrices are supported.`);
}

/**
 * Calculates the inverse of a matrix modulo 26.
 * Returns null if the matrix is not invertible mod 26.
 * 
 * @param matrix - Square matrix (2×2 or 3×3)
 * @returns The inverse matrix mod 26, or null if not invertible
 * 
 * Preconditions:
 * - matrix is a square matrix (2×2 or 3×3)
 * - All elements are integers in range [0, 25]
 * 
 * Postconditions:
 * - Returns inverse matrix M^(-1) where (M * M^(-1)) mod 26 = I (identity matrix)
 * - Returns null if matrix is not invertible mod 26
 * - All elements in result are in range [0, 25]
 */
export function matrixInverseMod26(matrix: Matrix): Matrix | null {
  const n = matrix.length;
  const det = matrixDeterminant(matrix);
  const detMod26 = ((det % 26) + 26) % 26;
  
  // Check if determinant is coprime with 26
  const detInverse = modInverse(detMod26, 26);
  if (detInverse === null) {
    return null;
  }
  
  if (n === 2) {
    // 2×2 inverse formula: (1/det) * [[d, -b], [-c, a]]
    const a = matrix[0][0], b = matrix[0][1];
    const c = matrix[1][0], d = matrix[1][1];
    
    return [
      [
        ((detInverse * d) % 26 + 26) % 26,
        ((detInverse * (-b)) % 26 + 26) % 26
      ],
      [
        ((detInverse * (-c)) % 26 + 26) % 26,
        ((detInverse * a) % 26 + 26) % 26
      ]
    ];
  } else if (n === 3) {
    // 3×3 inverse using adjugate matrix (transpose of cofactor matrix)
    const a = matrix[0][0], b = matrix[0][1], c = matrix[0][2];
    const d = matrix[1][0], e = matrix[1][1], f = matrix[1][2];
    const g = matrix[2][0], h = matrix[2][1], i = matrix[2][2];
    
    // Calculate cofactor matrix
    const cofactor: Matrix = [
      [
        e * i - f * h,  // C00
        -(d * i - f * g), // C01
        d * h - e * g   // C02
      ],
      [
        -(b * i - c * h), // C10
        a * i - c * g,  // C11
        -(a * h - b * g)  // C12
      ],
      [
        b * f - c * e,  // C20
        -(a * f - c * d), // C21
        a * e - b * d   // C22
      ]
    ];
    
    // Transpose cofactor matrix to get adjugate, multiply by determinant inverse, and apply mod 26
    const inverse: Matrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Transpose: adjugate[i][j] = cofactor[j][i]
        // Then multiply by detInverse and mod 26
        inverse[i][j] = ((detInverse * cofactor[j][i]) % 26 + 26) % 26;
      }
    }
    
    return inverse;
  }
  
  throw new Error(`Unsupported matrix size: ${n}×${n}. Only 2×2 and 3×3 matrices are supported.`);
}

/**
 * Multiplies a matrix by a vector and applies modulo 26 to the result.
 * Used for encrypting/decrypting a single block in Hill cipher.
 * 
 * @param matrix - Square matrix (n×n)
 * @param vector - Vector of length n
 * @returns Resulting vector with modulo 26 applied
 * 
 * Preconditions:
 * - matrix is n×n matrix where n = vector.length
 * - vector.length equals matrix.length
 * - All vector elements are in range [0, 25]
 * - All matrix elements are in range [0, 25]
 * 
 * Postconditions:
 * - Returns encrypted vector of same length as input
 * - Each element computed as: result[i] = (Σ matrix[i][j] * vector[j]) mod 26
 * - All result elements are in range [0, 25]
 */
export function multiplyMatrixVector(matrix: Matrix, vector: Vector): Vector {
  const n = matrix.length;
  const result: Vector = [];
  
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += matrix[i][j] * vector[j];
    }
    result[i] = ((sum % 26) + 26) % 26;
  }
  
  return result;
}

/**
 * Multiplies two matrices and applies modulo 26 to the result.
 * Used for verifying matrix inverse property.
 * 
 * @param a - First matrix (n×n)
 * @param b - Second matrix (n×n)
 * @returns Resulting matrix with modulo 26 applied
 * 
 * Preconditions:
 * - Both matrices are square and of the same size
 * - a.length === b.length
 * 
 * Postconditions:
 * - Returns product matrix of same size
 * - Each element computed as: result[i][j] = (Σ a[i][k] * b[k][j]) mod 26
 * - All result elements are in range [0, 25]
 */
export function multiplyMatrices(a: Matrix, b: Matrix): Matrix {
  const n = a.length;
  const result: Matrix = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = ((sum % 26) + 26) % 26;
    }
  }
  
  return result;
}

/**
 * Validates a matrix for use in Hill cipher encryption.
 * Checks dimensions and whether the determinant is coprime with 26.
 * 
 * @param matrix - Matrix to validate
 * @returns Validation result with determinant, gcd, and error message if invalid
 * 
 * Preconditions:
 * - matrix is a 2D array of numbers
 * - matrix.length > 0
 * 
 * Postconditions:
 * - Returns validation result with determinant and gcd
 * - isValid = true if and only if matrix is invertible mod 26
 * - Error message provided when validation fails
 */
export function validateMatrix(matrix: Matrix): MatrixValidation {
  // Step 1: Check dimensions
  const n = matrix.length;
  if (n !== 2 && n !== 3 && n !== 4) {
    return { 
      isValid: false, 
      determinant: 0, 
      gcd: 0, 
      error: 'La matrice doit être 2×2, 3×3 ou 4×4' 
    };
  }
  
  for (let i = 0; i < n; i++) {
    if (matrix[i].length !== n) {
      return { 
        isValid: false, 
        determinant: 0, 
        gcd: 0, 
        error: 'La matrice doit être carrée' 
      };
    }
  }
  
  // Step 2: Calculate determinant
  const det = matrixDeterminant(matrix);
  const detMod26 = ((det % 26) + 26) % 26;
  
  // Step 3: Check if determinant is coprime with 26
  const gcdResult = gcdExtended(detMod26, 26);
  const gcd = gcdResult.gcd;
  
  if (gcd !== 1) {
    return {
      isValid: false,
      determinant: detMod26,
      gcd,
      error: `Le déterminant ${detMod26} n'est pas premier avec 26 (pgcd = ${gcd})`
    };
  }
  
  return {
    isValid: true,
    determinant: detMod26,
    gcd: 1
  };
}
