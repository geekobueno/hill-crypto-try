import { describe, it, expect } from 'vitest';
import { knownPlaintextAttack, KnownPair } from './cryptanalysisModulo';
import { encrypt } from './hillCipherModulo';
import { Matrix } from './types';
import { multiplyMatricesModulo } from './matrixMathModulo';

describe('cryptanalysisModulo', () => {
  describe('knownPlaintextAttack', () => {
    describe('modulo 26', () => {
      it('recovers 2x2 key matrix from 2 known pairs', () => {
        const originalKey: Matrix = [[3, 3], [2, 5]];
        
        // Create known pairs
        const pairs: KnownPair[] = [
          { plaintext: 'HE', ciphertext: encrypt('HE', originalKey, 26).result.substring(0, 2) },
          { plaintext: 'LP', ciphertext: encrypt('LP', originalKey, 26).result.substring(0, 2) }
        ];
        
        const recoveredKey = knownPlaintextAttack(pairs, 2, 26);
        
        expect(recoveredKey).not.toBeNull();
        expect(recoveredKey).toEqual(originalKey);
      });

      it('recovers 3x3 key matrix from 3 known pairs', () => {
        const originalKey: Matrix = [
          [6, 24, 1],
          [13, 16, 10],
          [20, 17, 15]
        ];
        
        // Use plaintexts that create an invertible matrix
        // BIG, ELF, HEX creates a matrix with det=9 mod 26 (coprime with 26)
        const pairs: KnownPair[] = [
          { plaintext: 'BIG', ciphertext: encrypt('BIG', originalKey, 26).result.substring(0, 3) },
          { plaintext: 'ELF', ciphertext: encrypt('ELF', originalKey, 26).result.substring(0, 3) },
          { plaintext: 'HEX', ciphertext: encrypt('HEX', originalKey, 26).result.substring(0, 3) }
        ];
        
        const recoveredKey = knownPlaintextAttack(pairs, 3, 26);
        
        expect(recoveredKey).not.toBeNull();
        expect(recoveredKey).toEqual(originalKey);
      });

      it('returns null when not enough pairs provided', () => {
        const pairs: KnownPair[] = [
          { plaintext: 'HE', ciphertext: 'AB' }
        ];
        
        const result = knownPlaintextAttack(pairs, 2, 26);
        
        expect(result).toBeNull();
      });

      it('returns null when plaintext matrix is not invertible', () => {
        const originalKey: Matrix = [[3, 3], [2, 5]];
        
        // Use pairs that create a non-invertible plaintext matrix
        const pairs: KnownPair[] = [
          { plaintext: 'AA', ciphertext: encrypt('AA', originalKey, 26).result.substring(0, 2) },
          { plaintext: 'AA', ciphertext: encrypt('AA', originalKey, 26).result.substring(0, 2) }
        ];
        
        const result = knownPlaintextAttack(pairs, 2, 26);
        
        expect(result).toBeNull();
      });

      it('handles pairs with extra characters', () => {
        const originalKey: Matrix = [[3, 3], [2, 5]];
        
        // Use plaintexts that create an invertible matrix
        const pairs: KnownPair[] = [
          { plaintext: 'HELLO', ciphertext: encrypt('HELLO', originalKey, 26).result },
          { plaintext: 'THERE', ciphertext: encrypt('THERE', originalKey, 26).result }
        ];
        
        const recoveredKey = knownPlaintextAttack(pairs, 2, 26);
        
        expect(recoveredKey).not.toBeNull();
        expect(recoveredKey).toEqual(originalKey);
      });

      it('recovered key can decrypt messages encrypted with original key', () => {
        const originalKey: Matrix = [[3, 3], [2, 5]];
        const testMessage = 'SECRETMESSAGE';
        
        // Encrypt with original key
        const encrypted = encrypt(testMessage, originalKey, 26);
        
        // Create known pairs
        const pairs: KnownPair[] = [
          { plaintext: 'HE', ciphertext: encrypt('HE', originalKey, 26).result.substring(0, 2) },
          { plaintext: 'LP', ciphertext: encrypt('LP', originalKey, 26).result.substring(0, 2) }
        ];
        
        const recoveredKey = knownPlaintextAttack(pairs, 2, 26);
        
        expect(recoveredKey).not.toBeNull();
        
        if (recoveredKey) {
          // Verify recovered key produces same ciphertext
          const encryptedWithRecovered = encrypt(testMessage, recoveredKey, 26);
          expect(encryptedWithRecovered.result).toBe(encrypted.result);
        }
      });
    });

    describe('modulo 37', () => {
      it('recovers 2x2 key matrix from 2 known pairs with modulo 37', () => {
        const originalKey: Matrix = [[5, 8], [3, 7]];
        
        const pairs: KnownPair[] = [
          { plaintext: 'AB', ciphertext: encrypt('AB', originalKey, 37).result.substring(0, 2) },
          { plaintext: '12', ciphertext: encrypt('12', originalKey, 37).result.substring(0, 2) }
        ];
        
        const recoveredKey = knownPlaintextAttack(pairs, 2, 37);
        
        expect(recoveredKey).not.toBeNull();
        expect(recoveredKey).toEqual(originalKey);
      });

      it('handles pairs with spaces in modulo 37', () => {
        const originalKey: Matrix = [[5, 8], [3, 7]];
        
        const pairs: KnownPair[] = [
          { plaintext: 'A ', ciphertext: encrypt('A ', originalKey, 37).result.substring(0, 2) },
          { plaintext: 'B1', ciphertext: encrypt('B1', originalKey, 37).result.substring(0, 2) }
        ];
        
        const recoveredKey = knownPlaintextAttack(pairs, 2, 37);
        
        expect(recoveredKey).not.toBeNull();
        expect(recoveredKey).toEqual(originalKey);
      });

      it('recovered key works with mixed character types', () => {
        const originalKey: Matrix = [[5, 8], [3, 7]];
        const testMessage = 'AB 12';
        
        const encrypted = encrypt(testMessage, originalKey, 37);
        
        const pairs: KnownPair[] = [
          { plaintext: 'AB', ciphertext: encrypt('AB', originalKey, 37).result.substring(0, 2) },
          { plaintext: '12', ciphertext: encrypt('12', originalKey, 37).result.substring(0, 2) }
        ];
        
        const recoveredKey = knownPlaintextAttack(pairs, 2, 37);
        
        expect(recoveredKey).not.toBeNull();
        
        if (recoveredKey) {
          const encryptedWithRecovered = encrypt(testMessage, recoveredKey, 37);
          expect(encryptedWithRecovered.result).toBe(encrypted.result);
        }
      });
    });

    describe('edge cases', () => {
      it('returns null for empty pairs array', () => {
        const result = knownPlaintextAttack([], 2, 26);
        expect(result).toBeNull();
      });

      it('returns null when pairs have insufficient text length', () => {
        const pairs: KnownPair[] = [
          { plaintext: 'A', ciphertext: 'B' },
          { plaintext: 'C', ciphertext: 'D' }
        ];
        
        const result = knownPlaintextAttack(pairs, 2, 26);
        expect(result).toBeNull();
      });

      it('cleans text before processing', () => {
        const originalKey: Matrix = [[3, 3], [2, 5]];
        
        const pairs: KnownPair[] = [
          { plaintext: 'H!E@', ciphertext: encrypt('HE', originalKey, 26).result.substring(0, 2) },
          { plaintext: 'L#P$', ciphertext: encrypt('LP', originalKey, 26).result.substring(0, 2) }
        ];
        
        const recoveredKey = knownPlaintextAttack(pairs, 2, 26);
        
        expect(recoveredKey).not.toBeNull();
        expect(recoveredKey).toEqual(originalKey);
      });
    });

    describe('mathematical verification', () => {
      it('recovered key satisfies C = K * P (mod 26)', () => {
        const originalKey: Matrix = [[3, 3], [2, 5]];
        
        const pairs: KnownPair[] = [
          { plaintext: 'HE', ciphertext: encrypt('HE', originalKey, 26).result.substring(0, 2) },
          { plaintext: 'LP', ciphertext: encrypt('LP', originalKey, 26).result.substring(0, 2) }
        ];
        
        const recoveredKey = knownPlaintextAttack(pairs, 2, 26);
        
        expect(recoveredKey).not.toBeNull();
        
        if (recoveredKey) {
          // Verify the mathematical relationship
          // For each pair, K * plaintext_vector should equal ciphertext_vector
          for (const pair of pairs) {
            const plainEncrypted = encrypt(pair.plaintext, recoveredKey, 26);
            expect(plainEncrypted.result.substring(0, 2)).toBe(pair.ciphertext);
          }
        }
      });
    });
  });
});
