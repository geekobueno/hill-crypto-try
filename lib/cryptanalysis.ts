import { Matrix } from './types';
import { textToVectors } from './hillCipher';
import { matrixInverseMod26, multiplyMatrices } from './matrixMath';

/**
 * Represents a known plaintext-ciphertext pair for cryptanalysis.
 */
export interface KnownPair {
  plaintext: string;
  ciphertext: string;
}

/**
 * Performs a known-plaintext attack on Hill cipher to recover the key matrix.
 * Requires n plaintext-ciphertext pairs for an n×n matrix.
 * 
 * The attack works by solving the matrix equation: C = K * P (mod 26)
 * Where C is ciphertext matrix, K is key matrix, P is plaintext matrix.
 * We can recover K by computing: K = C * P^(-1) (mod 26)
 * 
 * @param pairs - Array of known plaintext-ciphertext pairs
 * @param matrixSize - Size of the key matrix (2 or 3)
 * @returns The recovered key matrix, or null if attack fails
 * 
 * Preconditions:
 * - pairs.length >= matrixSize (need at least n pairs for n×n matrix)
 * - Each pair has plaintext and ciphertext of length >= matrixSize
 * - matrixSize is 2 or 3
 * 
 * Postconditions:
 * - Returns recovered key matrix if successful
 * - Returns null if plaintext matrix is not invertible or attack fails
 * - Recovered matrix should produce same ciphertext when encrypting plaintext
 */
export function knownPlaintextAttack(
  pairs: KnownPair[],
  matrixSize: 2 | 3
): Matrix | null {
  // Validate we have enough pairs
  if (pairs.length < matrixSize) {
    return null;
  }
  
  // Build plaintext and ciphertext matrices from the pairs
  // In Hill cipher: C = K * P (where columns of P are plaintext vectors)
  // To recover K: K = C * P^(-1)
  
  // Initialize matrices with proper dimensions
  const plaintextMatrix: Matrix = Array(matrixSize)
    .fill(null)
    .map(() => Array(matrixSize).fill(0));
  const ciphertextMatrix: Matrix = Array(matrixSize)
    .fill(null)
    .map(() => Array(matrixSize).fill(0));
  
  // Collect matrixSize vectors, each becomes a COLUMN in the matrix
  for (let i = 0; i < matrixSize; i++) {
    const pair = pairs[i];
    
    // Clean and convert to vectors
    const cleanPlaintext = pair.plaintext.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanCiphertext = pair.ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    
    // Get the first block (vector) from each text
    const plaintextVectors = textToVectors(cleanPlaintext, matrixSize);
    const ciphertextVectors = textToVectors(cleanCiphertext, matrixSize);
    
    if (plaintextVectors.length === 0 || ciphertextVectors.length === 0) {
      return null;
    }
    
    // Use the first vector from each pair
    const pVector = plaintextVectors[0];
    const cVector = ciphertextVectors[0];
    
    // Place each vector as a COLUMN in the matrix
    for (let row = 0; row < matrixSize; row++) {
      plaintextMatrix[row][i] = pVector[row];
      ciphertextMatrix[row][i] = cVector[row];
    }
  }
  
  // Calculate the inverse of the plaintext matrix mod 26
  const plaintextInverse = matrixInverseMod26(plaintextMatrix);
  
  if (!plaintextInverse) {
    // Plaintext matrix is not invertible, attack fails
    return null;
  }
  
  // Recover the key matrix: K = C * P^(-1) (mod 26)
  const recoveredKey = multiplyMatrices(ciphertextMatrix, plaintextInverse);
  
  return recoveredKey;
}

/**
 * Transposes a matrix (swaps rows and columns).
 * 
 * @param matrix - Matrix to transpose
 * @returns Transposed matrix
 * 
 * Preconditions:
 * - matrix is a valid 2D array
 * - All rows have the same length
 * 
 * Postconditions:
 * - Returns transposed matrix where result[i][j] = matrix[j][i]
 * - Dimensions are swapped: if input is m×n, output is n×m
 */
function transposeMatrix(matrix: Matrix): Matrix {
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  const transposed: Matrix = Array(cols)
    .fill(null)
    .map(() => Array(rows).fill(0));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      transposed[j][i] = matrix[i][j];
    }
  }
  
  return transposed;
}
