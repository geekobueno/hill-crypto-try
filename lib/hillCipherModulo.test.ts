import { describe, it, expect } from 'vitest';
import {
  textToVectors,
  vectorsToText,
  encryptVector,
  encrypt,
  decrypt
} from './hillCipherModulo';
import { Matrix, Vector } from './types';

describe('hillCipherModulo', () => {
  describe('textToVectors', () => {
    describe('modulo 26', () => {
      it('converts text to vectors of specified block size', () => {
        const vectors = textToVectors('HELLO', 2, 26);
        
        expect(vectors).toHaveLength(3); // HELLOX -> 6 chars -> 3 vectors
        expect(vectors[0]).toEqual([7, 4]); // H, E
        expect(vectors[1]).toEqual([11, 11]); // L, L
        expect(vectors[2]).toEqual([14, 23]); // O, X (padded)
      });

      it('pads text with X when length is not multiple of block size', () => {
        const vectors = textToVectors('ABC', 2, 26);
        
        expect(vectors).toHaveLength(2);
        expect(vectors[1]).toEqual([2, 23]); // C, X
      });

      it('handles text that is already a multiple of block size', () => {
        const vectors = textToVectors('ABCD', 2, 26);
        
        expect(vectors).toHaveLength(2);
        expect(vectors[0]).toEqual([0, 1]); // A, B
        expect(vectors[1]).toEqual([2, 3]); // C, D
      });

      it('works with block size 3', () => {
        const vectors = textToVectors('HELLO', 3, 26);
        
        expect(vectors).toHaveLength(2); // HELLOXX -> 6 chars
        expect(vectors[0]).toEqual([7, 4, 11]); // H, E, L
        expect(vectors[1]).toEqual([11, 14, 23]); // L, O, X
      });
    });

    describe('modulo 37', () => {
      it('converts text with letters, digits, and spaces', () => {
        const vectors = textToVectors('AB 12', 2, 37);
        
        expect(vectors).toHaveLength(3);
        expect(vectors[0]).toEqual([0, 1]); // A, B
        expect(vectors[1]).toEqual([36, 27]); // space, 1
        expect(vectors[2]).toEqual([28, 36]); // 2, space (padded)
      });

      it('pads with space for modulo 37', () => {
        const vectors = textToVectors('ABC', 2, 37);
        
        expect(vectors[1][1]).toBe(36); // space
      });
    });
  });

  describe('vectorsToText', () => {
    it('converts vectors back to text for modulo 26', () => {
      const vector: Vector = [7, 4, 11, 11, 14];
      const text = vectorsToText(vector, 26);
      
      expect(text).toBe('HELLO');
    });

    it('converts vectors back to text for modulo 37', () => {
      const vector: Vector = [7, 4, 11, 11, 14, 36, 27, 28]; // HELLO 12
      const text = vectorsToText(vector, 37);
      
      expect(text).toBe('HELLO 12');
    });

    it('handles empty vector', () => {
      const text = vectorsToText([], 26);
      expect(text).toBe('');
    });
  });

  describe('encryptVector', () => {
    it('encrypts a vector using matrix multiplication with modulo 26', () => {
      const matrix: Matrix = [[3, 3], [2, 5]];
      const vector: Vector = [7, 4]; // H, E
      
      const encrypted = encryptVector(matrix, vector, 26);
      
      expect(encrypted).toHaveLength(2);
      expect(encrypted[0]).toBe(7); // (3*7 + 3*4) % 26 = 33 % 26 = 7
      expect(encrypted[1]).toBe(8); // (2*7 + 5*4) % 26 = 34 % 26 = 8
    });

    it('encrypts a vector with modulo 37', () => {
      const matrix: Matrix = [[5, 8], [3, 7]];
      const vector: Vector = [0, 1]; // A, B
      
      const encrypted = encryptVector(matrix, vector, 37);
      
      expect(encrypted).toHaveLength(2);
      expect(encrypted[0]).toBe((5*0 + 8*1) % 37); // 8
      expect(encrypted[1]).toBe((3*0 + 7*1) % 37); // 7
    });
  });

  describe('encrypt', () => {
    it('encrypts plaintext with 2x2 matrix and modulo 26', () => {
      const matrix: Matrix = [[3, 3], [2, 5]];
      const result = encrypt('HELLO', matrix, 26);
      
      expect(result.result).toBeTruthy();
      expect(result.result.length).toBeGreaterThan(0);
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.keyMatrix).toEqual(matrix);
    });

    it('encrypts plaintext with 3x3 matrix and modulo 26', () => {
      const matrix: Matrix = [
        [6, 24, 1],
        [13, 16, 10],
        [20, 17, 15]
      ];
      const result = encrypt('HELLO', matrix, 26);
      
      expect(result.result).toBeTruthy();
      expect(result.steps.length).toBeGreaterThan(0);
    });

    it('encrypts text with digits and spaces using modulo 37', () => {
      const matrix: Matrix = [[5, 8], [3, 7]];
      const result = encrypt('AB 12', matrix, 37);
      
      expect(result.result).toBeTruthy();
      expect(result.steps.length).toBeGreaterThan(0);
    });

    it('includes calculation steps', () => {
      const matrix: Matrix = [[3, 3], [2, 5]];
      const result = encrypt('HE', matrix, 26);
      
      expect(result.steps).toContainEqual(
        expect.objectContaining({
          type: 'vector_conversion'
        })
      );
      
      expect(result.steps).toContainEqual(
        expect.objectContaining({
          type: 'matrix_multiplication'
        })
      );
    });

    it('cleans input text before encryption', () => {
      const matrix: Matrix = [[3, 3], [2, 5]];
      const result1 = encrypt('HELLO!!!', matrix, 26);
      const result2 = encrypt('HELLO', matrix, 26);
      
      expect(result1.result).toBe(result2.result);
    });
  });

  describe('decrypt', () => {
    it('decrypts ciphertext back to original plaintext with modulo 26', () => {
      const matrix: Matrix = [[3, 3], [2, 5]];
      const plaintext = 'HELLO';
      
      const encrypted = encrypt(plaintext, matrix, 26);
      const decrypted = decrypt(encrypted.result, matrix, 26);
      
      expect(decrypted.result).toBe('HELLOX'); // Padded with X
    });

    it('decrypts with 3x3 matrix and modulo 26', () => {
      const matrix: Matrix = [
        [6, 24, 1],
        [13, 16, 10],
        [20, 17, 15]
      ];
      const plaintext = 'ATTACK';
      
      const encrypted = encrypt(plaintext, matrix, 26);
      const decrypted = decrypt(encrypted.result, matrix, 26);
      
      expect(decrypted.result).toBe(plaintext);
    });

    it('decrypts with modulo 37', () => {
      const matrix: Matrix = [[5, 8], [3, 7]];
      const plaintext = 'AB 12';
      
      const encrypted = encrypt(plaintext, matrix, 37);
      const decrypted = decrypt(encrypted.result, matrix, 37);
      
      // Should match original with possible padding
      expect(decrypted.result.trim()).toBe(plaintext.trim());
    });

    it('includes inverse matrix in result', () => {
      const matrix: Matrix = [[3, 3], [2, 5]];
      const encrypted = encrypt('HELLO', matrix, 26);
      const decrypted = decrypt(encrypted.result, matrix, 26);
      
      expect(decrypted.inverseMatrix).toBeDefined();
      expect(decrypted.inverseMatrix).not.toBeNull();
    });

    it('throws error for non-invertible matrix', () => {
      const matrix: Matrix = [[2, 4], [1, 2]]; // det = 0
      
      expect(() => decrypt('ABCD', matrix, 26)).toThrow();
    });
  });

  describe('encryption/decryption round trip', () => {
    it('successfully encrypts and decrypts with modulo 26', () => {
      const matrix: Matrix = [[3, 3], [2, 5]];
      const original = 'TESTMESSAGE';
      
      const encrypted = encrypt(original, matrix, 26);
      const decrypted = decrypt(encrypted.result, matrix, 26);
      
      // Remove padding
      expect(decrypted.result.startsWith(original)).toBe(true);
    });

    it('successfully encrypts and decrypts with modulo 37', () => {
      const matrix: Matrix = [[5, 8], [3, 7]];
      const original = 'TEST 123';
      
      const encrypted = encrypt(original, matrix, 37);
      const decrypted = decrypt(encrypted.result, matrix, 37);
      
      expect(decrypted.result.trim()).toBe(original);
    });
  });
});
