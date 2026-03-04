// Core type definitions for Hill Cipher Educational App

/**
 * Represents a square matrix (2×2 or 3×3) used in Hill cipher operations.
 * Each element should be an integer in the range [0, 25].
 */
export type Matrix = number[][];

/**
 * Represents a numerical vector used in encryption/decryption.
 * Each element should be an integer in the range [0, 25] representing letters A-Z.
 */
export type Vector = number[];

/**
 * Represents a single step in the encryption/decryption calculation process.
 * Used for educational visualization of the algorithm.
 */
export interface CalculationStep {
  /**
   * The type of calculation being performed in this step.
   */
  type: 'vector_conversion' | 'matrix_multiplication' | 'modulo_operation' | 'inverse_calculation';
  
  /**
   * Human-readable description of what this step does.
   */
  description: string;
  
  /**
   * Input values for this calculation step.
   */
  input: {
    text?: string;
    matrix?: Matrix;
    vector?: Vector;
    value?: number;
  };
  
  /**
   * Output values produced by this calculation step.
   */
  output: {
    vector?: Vector;
    matrix?: Matrix;
    value?: number;
    text?: string;
  };
  
  /**
   * Optional array of intermediate calculation strings for detailed visualization.
   * Example: "Row 0: 3*7 + 3*4 = 33 ≡ 7 (mod 26)"
   */
  intermediateSteps?: string[];
}

/**
 * Represents the complete result of an encryption or decryption operation.
 * Includes the final result text and all calculation steps for visualization.
 */
export interface CipherResult {
  /**
   * The final encrypted or decrypted text (uppercase letters A-Z only).
   */
  result: string;
  
  /**
   * Array of all calculation steps performed during the operation.
   */
  steps: CalculationStep[];
  
  /**
   * The key matrix used for encryption/decryption.
   */
  keyMatrix: Matrix;
  
  /**
   * The inverse matrix (only present for decryption operations).
   */
  inverseMatrix?: Matrix;
}

/**
 * Represents the validation result for a key matrix.
 * Indicates whether the matrix is valid for use in Hill cipher operations.
 */
export interface MatrixValidation {
  /**
   * Whether the matrix is valid (determinant coprime with 26).
   */
  isValid: boolean;
  
  /**
   * The determinant of the matrix modulo 26.
   */
  determinant: number;
  
  /**
   * The greatest common divisor of the determinant and 26.
   * Must be 1 for a valid matrix.
   */
  gcd: number;
  
  /**
   * Error message explaining why the matrix is invalid (if applicable).
   */
  error?: string;
}
