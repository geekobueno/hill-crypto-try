import { Matrix, Vector, CalculationStep, CipherResult } from './types';
import { matrixInverseMod26, multiplyMatrixVector } from './matrixMath';

/**
 * Converts text to numerical vectors for Hill cipher encryption.
 * Converts each letter to a number (A=0, B=1, ..., Z=25) and groups into vectors.
 * Pads with 'X' if text length is not a multiple of block size.
 * 
 * @param text - Uppercase text containing only letters A-Z
 * @param blockSize - Size of each vector (2 or 3, matching key matrix dimension)
 * @returns Array of vectors, each of length blockSize
 * 
 * Preconditions:
 * - text is a non-empty string containing only uppercase letters A-Z
 * - blockSize is 2 or 3 (matching key matrix dimension)
 * - text.length > 0
 * 
 * Postconditions:
 * - Returns array of vectors, each of length blockSize
 * - Each vector element is in range [0, 25] (A=0, B=1, ..., Z=25)
 * - If text.length % blockSize ≠ 0, text is padded with 'X'
 * - Total vectors: Math.ceil(text.length / blockSize)
 */
export function textToVectors(text: string, blockSize: number): Vector[] {
  // Pad text with 'X' if needed to make length a multiple of blockSize
  let paddedText = text;
  while (paddedText.length % blockSize !== 0) {
    paddedText += 'X';
  }
  
  const vectors: Vector[] = [];
  
  // Convert text to vectors
  for (let i = 0; i < paddedText.length; i += blockSize) {
    const vector: Vector = [];
    for (let j = 0; j < blockSize; j++) {
      const char = paddedText[i + j];
      // Convert A=0, B=1, ..., Z=25
      const value = char.charCodeAt(0) - 'A'.charCodeAt(0);
      vector.push(value);
    }
    vectors.push(vector);
  }
  
  return vectors;
}

/**
 * Converts numerical vectors back to text.
 * Converts each number to a letter (0=A, 1=B, ..., 25=Z).
 * 
 * @param flatVector - Flat array of numbers in range [0, 25]
 * @returns Text string containing only uppercase letters A-Z
 * 
 * Preconditions:
 * - flatVector contains integers in range [0, 25]
 * - flatVector.length > 0
 * 
 * Postconditions:
 * - Returns string containing only uppercase letters A-Z
 * - Length equals flatVector.length
 * - Each number n maps to letter at position n in alphabet
 */
export function vectorsToText(flatVector: Vector): string {
  let text = '';
  for (const value of flatVector) {
    // Convert 0=A, 1=B, ..., 25=Z
    const char = String.fromCharCode(value + 'A'.charCodeAt(0));
    text += char;
  }
  return text;
}

/**
 * Encrypts a single vector using the key matrix.
 * Performs matrix-vector multiplication and applies modulo 26.
 * 
 * @param keyMatrix - Square matrix (n×n) used for encryption
 * @param vector - Vector of length n to encrypt
 * @returns Encrypted vector with modulo 26 applied
 * 
 * Preconditions:
 * - keyMatrix is n×n matrix where n = vector.length
 * - vector.length equals keyMatrix.length
 * - All vector elements are in range [0, 25]
 * - All matrix elements are in range [0, 25]
 * 
 * Postconditions:
 * - Returns encrypted vector of same length as input
 * - Each element computed as: result[i] = (Σ keyMatrix[i][j] * vector[j]) mod 26
 * - All result elements are in range [0, 25]
 */
export function encryptVector(keyMatrix: Matrix, vector: Vector): Vector {
  return multiplyMatrixVector(keyMatrix, vector);
}

/**
 * Encrypts plaintext using the Hill cipher algorithm with step recording.
 * Converts text to vectors, encrypts each vector, and records all calculation steps.
 * 
 * @param plaintext - Text to encrypt (will be cleaned to uppercase A-Z only)
 * @param keyMatrix - Valid key matrix (2×2 or 3×3)
 * @returns CipherResult with encrypted text and calculation steps
 * 
 * Preconditions:
 * - plaintext is a non-empty string
 * - keyMatrix is a valid, invertible matrix mod 26
 * - keyMatrix is 2×2 or 3×3
 * 
 * Postconditions:
 * - Returns CipherResult with encrypted text and calculation steps
 * - result contains only uppercase letters A-Z
 * - steps array contains complete calculation trace
 * - Encryption is reversible with correct inverse key matrix
 */
export function encrypt(plaintext: string, keyMatrix: Matrix): CipherResult {
  // Step 1: Validate and prepare input
  const cleanText = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
  const blockSize = keyMatrix.length;
  const steps: CalculationStep[] = [];
  
  // Step 2: Convert text to numerical vectors
  const vectors = textToVectors(cleanText, blockSize);
  steps.push({
    type: 'vector_conversion',
    description: `Convertir "${cleanText}" en vecteurs de taille ${blockSize}`,
    input: { text: cleanText },
    output: { vector: vectors.flat() }
  });
  
  // Step 3: Encrypt each vector
  const encryptedVectors: Vector[] = [];
  for (let i = 0; i < vectors.length; i++) {
    const vector = vectors[i];
    const encrypted = encryptVector(keyMatrix, vector);
    
    // Record detailed multiplication steps
    const intermediateSteps: string[] = [];
    for (let row = 0; row < blockSize; row++) {
      let sum = 0;
      let calculation = '';
      for (let col = 0; col < blockSize; col++) {
        sum += keyMatrix[row][col] * vector[col];
        calculation += `${keyMatrix[row][col]}*${vector[col]}`;
        if (col < blockSize - 1) calculation += ' + ';
      }
      const result = ((sum % 26) + 26) % 26;
      intermediateSteps.push(`Ligne ${row}: ${calculation} = ${sum} ≡ ${result} (mod 26)`);
    }
    
    steps.push({
      type: 'matrix_multiplication',
      description: `Chiffrer le vecteur ${i + 1}: [${vector.join(', ')}]`,
      input: { matrix: keyMatrix, vector },
      output: { vector: encrypted },
      intermediateSteps
    });
    
    encryptedVectors.push(encrypted);
  }
  
  // Step 4: Convert encrypted vectors back to text
  const ciphertext = vectorsToText(encryptedVectors.flat());
  
  return {
    result: ciphertext,
    steps,
    keyMatrix
  };
}

/**
 * Decrypts ciphertext using the Hill cipher algorithm.
 * Calculates the inverse key matrix and uses it to decrypt.
 * 
 * @param ciphertext - Text to decrypt (should contain only uppercase A-Z)
 * @param keyMatrix - Valid key matrix (2×2 or 3×3)
 * @returns CipherResult with decrypted text and calculation steps
 * 
 * Preconditions:
 * - ciphertext contains only uppercase letters A-Z
 * - keyMatrix is invertible mod 26
 * - gcd(det(keyMatrix), 26) = 1
 * 
 * Postconditions:
 * - Returns original plaintext
 * - inverseMatrix satisfies: (keyMatrix * inverseMatrix) mod 26 = I
 * - Steps include inverse calculation and decryption process
 */
export function decrypt(ciphertext: string, keyMatrix: Matrix): CipherResult {
  // Step 1: Calculate inverse key matrix
  const inverseMatrix = matrixInverseMod26(keyMatrix);
  if (!inverseMatrix) {
    throw new Error('Key matrix is not invertible mod 26');
  }
  
  const steps: CalculationStep[] = [];
  steps.push({
    type: 'inverse_calculation',
    description: 'Calculer la matrice inverse modulo 26',
    input: { matrix: keyMatrix },
    output: { matrix: inverseMatrix }
  });
  
  // Step 2: Use encryption algorithm with inverse matrix
  const result = encrypt(ciphertext, inverseMatrix);
  
  return {
    result: result.result,
    steps: [...steps, ...result.steps],
    keyMatrix,
    inverseMatrix
  };
}
