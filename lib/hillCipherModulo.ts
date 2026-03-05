import { Matrix, Vector, CalculationStep, CipherResult, ModuloType } from './types';
import { matrixInverseModulo, multiplyMatrixVectorModulo } from './matrixMathModulo';
import { charToNumber, numberToChar, cleanText, getPaddingChar } from './charMapping';

/**
 * Converts text to numerical vectors for Hill cipher encryption.
 */
export function textToVectors(text: string, blockSize: number, modulo: ModuloType): Vector[] {
  const paddingChar = getPaddingChar(modulo);
  let paddedText = text;
  
  while (paddedText.length % blockSize !== 0) {
    paddedText += paddingChar;
  }
  
  const vectors: Vector[] = [];
  
  for (let i = 0; i < paddedText.length; i += blockSize) {
    const vector: Vector = [];
    for (let j = 0; j < blockSize; j++) {
      const char = paddedText[i + j];
      const value = charToNumber(char, modulo);
      vector.push(value);
    }
    vectors.push(vector);
  }
  
  return vectors;
}

/**
 * Converts numerical vectors back to text.
 */
export function vectorsToText(flatVector: Vector, modulo: ModuloType): string {
  let text = '';
  for (const value of flatVector) {
    const char = numberToChar(value, modulo);
    text += char;
  }
  return text;
}

/**
 * Encrypts a single vector using the key matrix.
 */
export function encryptVector(keyMatrix: Matrix, vector: Vector, modulo: ModuloType): Vector {
  return multiplyMatrixVectorModulo(keyMatrix, vector, modulo);
}

/**
 * Encrypts plaintext using the Hill cipher algorithm with step recording.
 */
export function encrypt(plaintext: string, keyMatrix: Matrix, modulo: ModuloType): CipherResult {
  const cleanedText = cleanText(plaintext, modulo);
  const blockSize = keyMatrix.length;
  const steps: CalculationStep[] = [];
  
  const vectors = textToVectors(cleanedText, blockSize, modulo);
  steps.push({
    type: 'vector_conversion',
    description: `Convertir "${cleanedText}" en vecteurs de taille ${blockSize}`,
    input: { text: cleanedText },
    output: { vector: vectors.flat() }
  });
  
  const encryptedVectors: Vector[] = [];
  for (let i = 0; i < vectors.length; i++) {
    const vector = vectors[i];
    const encrypted = encryptVector(keyMatrix, vector, modulo);
    
    const intermediateSteps: string[] = [];
    for (let row = 0; row < blockSize; row++) {
      let sum = 0;
      let calculation = '';
      for (let col = 0; col < blockSize; col++) {
        sum += keyMatrix[row][col] * vector[col];
        calculation += `${keyMatrix[row][col]}*${vector[col]}`;
        if (col < blockSize - 1) calculation += ' + ';
      }
      const result = ((sum % modulo) + modulo) % modulo;
      intermediateSteps.push(`Ligne ${row}: ${calculation} = ${sum} ≡ ${result} (mod ${modulo})`);
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
  
  const ciphertext = vectorsToText(encryptedVectors.flat(), modulo);
  
  return {
    result: ciphertext,
    steps,
    keyMatrix
  };
}

/**
 * Decrypts ciphertext using the Hill cipher algorithm.
 */
export function decrypt(ciphertext: string, keyMatrix: Matrix, modulo: ModuloType): CipherResult {
  const inverseMatrix = matrixInverseModulo(keyMatrix, modulo);
  if (!inverseMatrix) {
    throw new Error(`Key matrix is not invertible mod ${modulo}`);
  }
  
  const steps: CalculationStep[] = [];
  steps.push({
    type: 'inverse_calculation',
    description: `Calculer la matrice inverse modulo ${modulo}`,
    input: { matrix: keyMatrix },
    output: { matrix: inverseMatrix }
  });
  
  const result = encrypt(ciphertext, inverseMatrix, modulo);
  
  return {
    result: result.result,
    steps: [...steps, ...result.steps],
    keyMatrix,
    inverseMatrix
  };
}
