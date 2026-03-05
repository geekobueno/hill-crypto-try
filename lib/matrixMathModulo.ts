import { Matrix, Vector, MatrixValidation, ModuloType } from './types';
import { gcdExtended, matrixDeterminant } from './matrixMath';

/**
 * Computes the modular multiplicative inverse of a modulo m.
 */
export function modInverseGeneric(a: number, m: number): number | null {
  a = ((a % m) + m) % m;
  const result = gcdExtended(a, m);
  
  if (result.gcd !== 1) {
    return null;
  }
  
  return ((result.x % m) + m) % m;
}

/**
 * Calculates the inverse of a matrix modulo m.
 */
export function matrixInverseModulo(matrix: Matrix, modulo: ModuloType): Matrix | null {
  const n = matrix.length;
  const det = matrixDeterminant(matrix);
  const detMod = ((det % modulo) + modulo) % modulo;
  
  const detInverse = modInverseGeneric(detMod, modulo);
  if (detInverse === null) {
    return null;
  }
  
  if (n === 2) {
    const a = matrix[0][0], b = matrix[0][1];
    const c = matrix[1][0], d = matrix[1][1];
    
    return [
      [
        ((detInverse * d) % modulo + modulo) % modulo,
        ((detInverse * (-b)) % modulo + modulo) % modulo
      ],
      [
        ((detInverse * (-c)) % modulo + modulo) % modulo,
        ((detInverse * a) % modulo + modulo) % modulo
      ]
    ];
  } else if (n === 3) {
    const a = matrix[0][0], b = matrix[0][1], c = matrix[0][2];
    const d = matrix[1][0], e = matrix[1][1], f = matrix[1][2];
    const g = matrix[2][0], h = matrix[2][1], i = matrix[2][2];
    
    const cofactor: Matrix = [
      [
        e * i - f * h,
        -(d * i - f * g),
        d * h - e * g
      ],
      [
        -(b * i - c * h),
        a * i - c * g,
        -(a * h - b * g)
      ],
      [
        b * f - c * e,
        -(a * f - c * d),
        a * e - b * d
      ]
    ];
    
    const inverse: Matrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        inverse[i][j] = ((detInverse * cofactor[j][i]) % modulo + modulo) % modulo;
      }
    }
    
    return inverse;
  }
  
  throw new Error(`Unsupported matrix size: ${n}×${n}`);
}

/**
 * Multiplies a matrix by a vector with modulo.
 */
export function multiplyMatrixVectorModulo(matrix: Matrix, vector: Vector, modulo: ModuloType): Vector {
  const n = matrix.length;
  const result: Vector = [];
  
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += matrix[i][j] * vector[j];
    }
    result[i] = ((sum % modulo) + modulo) % modulo;
  }
  
  return result;
}

/**
 * Multiplies two matrices with modulo.
 */
export function multiplyMatricesModulo(a: Matrix, b: Matrix, modulo: ModuloType): Matrix {
  const n = a.length;
  const result: Matrix = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = ((sum % modulo) + modulo) % modulo;
    }
  }
  
  return result;
}

/**
 * Validates a matrix for use with the specified modulo.
 */
export function validateMatrixModulo(matrix: Matrix, modulo: ModuloType): MatrixValidation {
  const n = matrix.length;
  if (n !== 2 && n !== 3) {
    return { 
      isValid: false, 
      determinant: 0, 
      gcd: 0, 
      error: 'La matrice doit être 2×2 ou 3×3' 
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
  
  const det = matrixDeterminant(matrix);
  const detMod = ((det % modulo) + modulo) % modulo;
  
  const gcdResult = gcdExtended(detMod, modulo);
  const gcd = gcdResult.gcd;
  
  if (gcd !== 1) {
    return {
      isValid: false,
      determinant: detMod,
      gcd,
      error: `Le déterminant ${detMod} n'est pas premier avec ${modulo} (pgcd = ${gcd})`
    };
  }
  
  return {
    isValid: true,
    determinant: detMod,
    gcd: 1
  };
}
