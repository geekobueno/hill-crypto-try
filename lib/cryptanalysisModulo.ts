import { Matrix, ModuloType } from './types';
import { textToVectors } from './hillCipherModulo';
import { matrixInverseModulo, multiplyMatricesModulo } from './matrixMathModulo';
import { cleanText } from './charMapping';

export interface KnownPair {
  plaintext: string;
  ciphertext: string;
}

/**
 * Performs a known-plaintext attack on Hill cipher to recover the key matrix.
 */
export function knownPlaintextAttack(
  pairs: KnownPair[],
  matrixSize: 2 | 3 | 4,
  modulo: ModuloType
): Matrix | null {
  if (pairs.length < matrixSize) {
    return null;
  }
  
  const plaintextMatrix: Matrix = Array(matrixSize)
    .fill(null)
    .map(() => Array(matrixSize).fill(0));
  const ciphertextMatrix: Matrix = Array(matrixSize)
    .fill(null)
    .map(() => Array(matrixSize).fill(0));
  
  for (let i = 0; i < matrixSize; i++) {
    const pair = pairs[i];
    
    const cleanPlaintext = cleanText(pair.plaintext, modulo);
    const cleanCiphertext = cleanText(pair.ciphertext, modulo);
    
    const plaintextVectors = textToVectors(cleanPlaintext, matrixSize, modulo);
    const ciphertextVectors = textToVectors(cleanCiphertext, matrixSize, modulo);
    
    if (plaintextVectors.length === 0 || ciphertextVectors.length === 0) {
      return null;
    }
    
    const pVector = plaintextVectors[0];
    const cVector = ciphertextVectors[0];
    
    for (let row = 0; row < matrixSize; row++) {
      plaintextMatrix[row][i] = pVector[row];
      ciphertextMatrix[row][i] = cVector[row];
    }
  }
  
  const plaintextInverse = matrixInverseModulo(plaintextMatrix, modulo);
  
  if (!plaintextInverse) {
    return null;
  }
  
  const recoveredKey = multiplyMatricesModulo(ciphertextMatrix, plaintextInverse, modulo);
  
  return recoveredKey;
}
