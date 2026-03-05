# Implementation Plan: Hill Cipher Educational App

## Overview

This plan implements an interactive Next.js application that teaches the Hill cipher encryption algorithm through visual demonstrations and step-by-step calculations. The implementation uses TypeScript for type safety, mathjs for matrix operations, Framer Motion for animations, and Tailwind CSS for styling.

## Tasks

- [x] 1. Set up Next.js project with dependencies
  - Initialize Next.js 14 project with TypeScript and App Router
  - Install dependencies: mathjs, framer-motion, tailwindcss, fast-check, vitest
  - Configure Tailwind CSS with cryptographic terminal aesthetic
  - Set up project structure: lib/, components/, app/
  - _Requirements: 7.9_

- [x] 2. Implement core type definitions
  - [x] 2.1 Create lib/types.ts with all TypeScript interfaces
    - Define Matrix, Vector, CalculationStep, CipherResult, MatrixValidation types
    - _Requirements: 1.6, 2.4, 4.6_

- [x] 3. Implement mathematical utility functions
  - [x] 3.1 Create lib/matrixMath.ts with modular arithmetic functions
    - Implement gcdExtended() using extended Euclidean algorithm
    - Implement modInverse() with null return for non-coprime values
    - _Requirements: 6.3, 6.4_
  
  - [ ]* 3.2 Write property test for modular inverse
    - **Property 12: Modular Inverse Existence**
    - **Validates: Requirements 6.3, 6.4**
  
  - [x] 3.3 Implement matrix determinant calculation
    - Implement matrixDeterminant() for 2×2 and 3×3 matrices
    - Use cofactor expansion for 3×3 matrices
    - _Requirements: 6.1, 6.2_
  
  - [x] 3.4 Implement matrix inverse modulo 26
    - Implement matrixInverseMod26() with validation
    - Return null for non-invertible matrices
    - _Requirements: 3.2, 6.7_
  
  - [ ]* 3.5 Write property test for matrix inverse identity
    - **Property 3: Matrix Inverse Identity**
    - **Validates: Requirements 3.2, 6.7**
  
  - [x] 3.6 Implement matrix-vector multiplication
    - Implement multiplyMatrixVector() with modulo 26
    - Implement multiplyMatrices() for matrix-matrix multiplication
    - _Requirements: 2.6, 6.5, 6.6_
  
  - [ ]* 3.7 Write property test for matrix-vector multiplication
    - **Property 2: Matrix-Vector Multiplication Correctness**
    - **Validates: Requirements 2.6, 6.5**
  
  - [x] 3.8 Implement matrix validation function
    - Implement validateMatrix() checking dimensions and coprimality
    - Return MatrixValidation with determinant, gcd, and error message
    - _Requirements: 1.2, 1.3, 1.4, 1.6_
  
  - [ ]* 3.9 Write property test for determinant coprimality
    - **Property 4: Determinant Coprimality Equivalence**
    - **Validates: Requirements 1.2, 1.3, 6.1, 6.2**

- [x] 4. Implement Hill cipher core functions
  - [x] 4.1 Create lib/hillCipher.ts with text conversion functions
    - Implement textToVectors() with padding logic
    - Implement vectorsToText() for reverse conversion
    - _Requirements: 2.2, 2.3, 2.4, 2.7, 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ]* 4.2 Write property test for text-vector round trip
    - **Property 5: Text-Vector Round Trip**
    - **Validates: Requirements 2.4, 2.7, 13.1, 13.2**
  
  - [ ]* 4.3 Write property test for padding to block size
    - **Property 8: Padding to Block Size Multiple**
    - **Validates: Requirements 2.3, 13.4, 13.5**
  
  - [x] 4.4 Implement vector encryption function
    - Implement encryptVector() with matrix multiplication and modulo 26
    - _Requirements: 2.5, 2.6, 6.5, 6.6_
  
  - [ ]* 4.5 Write property test for block size matching
    - **Property 9: Block Size Matches Matrix Dimension**
    - **Validates: Requirements 8.4**
  
  - [x] 4.6 Implement main encryption function
    - Implement encrypt() with step recording
    - Record vector conversion, matrix multiplication, and modulo steps
    - Include intermediate calculations for each row
    - _Requirements: 2.1, 2.5, 2.6, 2.7, 2.8, 4.1, 4.2, 4.3, 4.4, 4.7_
  
  - [x] 4.7 Implement decryption function
    - Implement decrypt() using inverse matrix
    - Record inverse calculation step
    - Reuse encrypt() with inverse matrix
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.5_
  
  - [ ]* 4.8 Write property test for encryption-decryption round trip
    - **Property 1: Encryption-Decryption Round Trip**
    - **Validates: Requirements 2.1, 3.1, 3.4, 3.5**
  
  - [ ]* 4.9 Write property test for calculation steps completeness
    - **Property 6: Calculation Steps Completeness**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7**
  
  - [ ]* 4.10 Write property test for output range validity
    - **Property 7: Output Range Validity**
    - **Validates: Requirements 2.8, 6.6**

- [x] 5. Checkpoint - Ensure core mathematical functions work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement random matrix generation
  - [x] 6.1 Create lib/matrixGenerator.ts
    - Implement generateRandomValidMatrix() for 2×2 and 3×3 matrices
    - Ensure generated matrices have determinant coprime with 26
    - _Requirements: 10.2, 10.3_
  
  - [ ]* 6.2 Write property test for random matrix generation
    - **Property 10: Random Matrix Generation Validity**
    - **Validates: Requirements 10.2, 10.3**

- [x] 7. Implement known-plaintext attack (bonus feature)
  - [x] 7.1 Create lib/cryptanalysis.ts
    - Implement knownPlaintextAttack() function
    - Require n pairs for n×n matrix
    - Use matrix equation solving to recover key
    - _Requirements: 11.2, 11.3, 11.4, 11.5_
  
  - [ ]* 7.2 Write property test for attack recovery
    - **Property 11: Known-Plaintext Attack Recovery**
    - **Validates: Requirements 11.2, 11.3**

- [x] 8. Implement UI components - Matrix input
  - [x] 8.1 Create components/MatrixInput.tsx
    - Implement matrix input grid with individual cell inputs
    - Add real-time validation on cell change
    - Display validation feedback (determinant, gcd, error message)
    - Constrain input values to [0, 25]
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 7.1, 7.2_

- [x] 9. Implement UI components - Text input and controls
  - [x] 9.1 Create components/TextInput.tsx
    - Implement text input field with validation
    - Show character count and processed text preview
    - Display error for empty input
    - _Requirements: 7.3, 9.1_
  
  - [x] 9.2 Create components/ControlPanel.tsx
    - Implement matrix size selector (2×2 or 3×3)
    - Add encrypt and decrypt buttons with disabled states
    - Add "Generate Random Valid Matrix" button
    - _Requirements: 7.4, 7.5, 8.1, 8.2, 8.3, 9.3, 10.1, 10.4, 10.5_

- [x] 10. Implement UI components - Display components
  - [x] 10.1 Create components/MatrixDisplay.tsx
    - Implement visual matrix display with brackets
    - Add optional highlighting for animations
    - Use monospace font for alignment
    - _Requirements: 7.9_
  
  - [x] 10.2 Create components/VectorDisplay.tsx
    - Implement vector display with brackets
    - Show letter-to-number mappings
    - _Requirements: 4.6, 7.9_
  
  - [x] 10.3 Create components/ResultDisplay.tsx
    - Display final ciphertext or plaintext prominently
    - Show copy-to-clipboard functionality
    - _Requirements: 7.6_

- [x] 11. Implement step-by-step visualization
  - [x] 11.1 Create components/StepByStep.tsx
    - Implement step navigation (Previous/Next buttons)
    - Display current step number and total count
    - Show step description, input, and output
    - Render different layouts for different step types
    - Add Framer Motion animations for step transitions
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 5.1, 7.7, 7.8_
  
  - [x] 11.2 Add intermediate calculation display
    - Show detailed row-by-row calculations for matrix multiplication
    - Display formulas like "3*7 + 3*4 = 33 ≡ 7 (mod 26)"
    - Add staggered animation for intermediate steps
    - _Requirements: 4.7, 5.2, 5.3_

- [x] 12. Implement educational content components
  - [x] 12.1 Create components/Disclaimer.tsx
    - Display "For educational purposes only" warning
    - Add brief explanation of Hill cipher history
    - _Requirements: 12.1, 12.4_
  
  - [x] 12.2 Create components/ConceptExplainer.tsx
    - Add tooltips or expandable sections for key concepts
    - Explain determinant, modular inverse, coprimality
    - _Requirements: 12.2, 12.3_

- [x] 13. Implement known-plaintext attack UI (bonus)
  - [x] 13.1 Create components/AttackSection.tsx
    - Implement interface for entering plaintext-ciphertext pairs
    - Show required number of pairs based on matrix size
    - Display recovered key matrix when attack succeeds
    - Show mathematical steps of the attack
    - Add disclaimer about security implications
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [ ] 14. Assemble main page
  - [x] 14.1 Create app/page.tsx
    - Import and compose all components
    - Implement state management for matrix, text, results, and current step
    - Wire up event handlers for encryption, decryption, and matrix generation
    - Handle matrix size changes with state reset
    - Implement error handling and display
    - _Requirements: 7.5, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 14.2 Configure Tailwind CSS theme
    - Set up terminal-style cryptographic aesthetic
    - Configure monospace fonts, dark color scheme
    - Add custom animations for validation states
    - _Requirements: 5.4, 7.9_
  
  - [x] 14.3 Create app/layout.tsx
    - Set up root layout with metadata
    - Include Framer Motion provider if needed
    - Add global styles
    - _Requirements: 5.3_

- [ ] 15. Final checkpoint - Integration testing
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 16. Write integration tests
  - [ ]* 16.1 Create tests for complete encryption workflow
    - Test: Enter plaintext → encrypt → verify result → decrypt → verify original
    - Test: Switch matrix sizes → verify state reset
    - _Requirements: 2.1, 3.1, 8.2, 8.3_
  
  - [ ]* 16.2 Create tests for validation workflows
    - Test: Enter invalid matrix → see error → correct → successful encryption
    - Test: Empty text input → see error → enter text → error clears
    - _Requirements: 1.4, 9.1, 9.2, 9.5_
  
  - [ ]* 16.3 Create tests for step-by-step navigation
    - Test: Complete encryption → navigate through all steps → verify content
    - Test: Step animations render without errors
    - _Requirements: 4.8, 5.1, 5.2_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The design document uses TypeScript, so all implementation will be in TypeScript
- Fast-check will be used for property-based testing
- Vitest will be used for unit and integration testing
