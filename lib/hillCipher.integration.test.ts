import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from './hillCipher';
import { Matrix } from './types';

describe('Hill Cipher Integration - French Text Validation', () => {
  const keyMatrix2x2: Matrix = [
    [3, 3],
    [2, 5]
  ];

  it('generates intermediate steps with French labels for encryption', () => {
    const plaintext = 'HELLO';
    const result = encrypt(plaintext, keyMatrix2x2);

    // Check that steps are recorded
    expect(result.steps.length).toBeGreaterThan(0);

    // Find a matrix multiplication step
    const multiplicationStep = result.steps.find(
      step => step.type === 'matrix_multiplication'
    );

    expect(multiplicationStep).toBeDefined();
    expect(multiplicationStep?.intermediateSteps).toBeDefined();
    expect(multiplicationStep!.intermediateSteps!.length).toBeGreaterThan(0);

    // Verify French text in intermediate steps
    const firstIntermediateStep = multiplicationStep!.intermediateSteps![0];
    expect(firstIntermediateStep).toMatch(/^Ligne \d+:/);
    expect(firstIntermediateStep).toContain('≡');
    expect(firstIntermediateStep).toContain('(mod 26)');
  });

  it('uses French description for vector conversion', () => {
    const plaintext = 'AB';
    const result = encrypt(plaintext, keyMatrix2x2);

    const conversionStep = result.steps.find(
      step => step.type === 'vector_conversion'
    );

    expect(conversionStep).toBeDefined();
    expect(conversionStep!.description).toContain('Convertir');
    expect(conversionStep!.description).toContain('en vecteurs de taille');
  });

  it('uses French description for matrix multiplication', () => {
    const plaintext = 'AB';
    const result = encrypt(plaintext, keyMatrix2x2);

    const multiplicationStep = result.steps.find(
      step => step.type === 'matrix_multiplication'
    );

    expect(multiplicationStep).toBeDefined();
    expect(multiplicationStep!.description).toContain('Chiffrer le vecteur');
  });

  it('uses French description for inverse calculation in decryption', () => {
    const ciphertext = 'AB';
    const result = decrypt(ciphertext, keyMatrix2x2);

    const inverseStep = result.steps.find(
      step => step.type === 'inverse_calculation'
    );

    expect(inverseStep).toBeDefined();
    expect(inverseStep!.description).toContain('Calculer la matrice inverse modulo 26');
  });

  it('displays detailed row-by-row calculations with proper format', () => {
    const plaintext = 'HI';
    const result = encrypt(plaintext, keyMatrix2x2);

    const multiplicationStep = result.steps.find(
      step => step.type === 'matrix_multiplication'
    );

    expect(multiplicationStep).toBeDefined();
    expect(multiplicationStep!.intermediateSteps).toBeDefined();

    // Check format: "Ligne 0: 3*7 + 3*8 = 45 ≡ 19 (mod 26)"
    const intermediateSteps = multiplicationStep!.intermediateSteps!;
    
    for (let i = 0; i < intermediateSteps.length; i++) {
      const step = intermediateSteps[i];
      
      // Should start with "Ligne X:"
      expect(step).toMatch(/^Ligne \d+:/);
      
      // Should contain multiplication operations
      expect(step).toMatch(/\d+\*\d+/);
      
      // Should contain equals sign
      expect(step).toContain('=');
      
      // Should contain modular equivalence symbol
      expect(step).toContain('≡');
      
      // Should end with (mod 26)
      expect(step).toContain('(mod 26)');
    }
  });

  it('generates correct intermediate calculations for 3x3 matrix', () => {
    const keyMatrix3x3: Matrix = [
      [6, 24, 1],
      [13, 16, 10],
      [20, 17, 15]
    ];

    const plaintext = 'ACT';
    const result = encrypt(plaintext, keyMatrix3x3);

    const multiplicationStep = result.steps.find(
      step => step.type === 'matrix_multiplication'
    );

    expect(multiplicationStep).toBeDefined();
    expect(multiplicationStep!.intermediateSteps).toBeDefined();
    expect(multiplicationStep!.intermediateSteps!.length).toBe(3); // 3 rows for 3x3 matrix

    // Each row should have the format with 3 multiplications
    multiplicationStep!.intermediateSteps!.forEach(step => {
      expect(step).toMatch(/^Ligne \d+:/);
      // Should have 3 multiplication operations (e.g., "6*0 + 24*2 + 1*19")
      const multiplications = step.match(/\d+\*\d+/g);
      expect(multiplications).toHaveLength(3);
    });
  });
});
