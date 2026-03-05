'use client';

import { useState, useEffect } from 'react';
import { Matrix, MatrixValidation, ModuloType } from '@/lib/types';
import { validateMatrixModulo } from '@/lib/matrixMathModulo';

interface MatrixInputProps {
  size: 2 | 3 | 4;
  initialMatrix?: Matrix;
  modulo: ModuloType;
  onChange: (matrix: Matrix, validation: MatrixValidation) => void;
}

export default function MatrixInput({ size, initialMatrix, modulo, onChange }: MatrixInputProps) {
  const [matrix, setMatrix] = useState<Matrix>(
    initialMatrix || Array(size).fill(null).map(() => Array(size).fill(0))
  );
  const [validation, setValidation] = useState<MatrixValidation>({ 
    isValid: false, 
    determinant: 0, 
    gcd: 0 
  });

  // Update matrix when size or modulo changes
  useEffect(() => {
    const newMatrix = initialMatrix || Array(size).fill(null).map(() => Array(size).fill(0));
    setMatrix(newMatrix);
    const newValidation = validateMatrixModulo(newMatrix, modulo);
    setValidation(newValidation);
    onChange(newMatrix, newValidation);
  }, [size, initialMatrix, modulo]);

  const handleCellChange = (row: number, col: number, value: string) => {
    // Parse the input value
    let numValue = parseInt(value) || 0;
    
    // Constrain to [0, modulo-1]
    numValue = Math.max(0, Math.min(modulo - 1, numValue));
    
    // Create new matrix with updated value
    const newMatrix = matrix.map((r, i) => 
      i === row ? r.map((c, j) => j === col ? numValue : c) : [...r]
    );
    
    setMatrix(newMatrix);
    
    // Validate the new matrix
    const newValidation = validateMatrixModulo(newMatrix, modulo);
    setValidation(newValidation);
    
    // Notify parent component
    onChange(newMatrix, newValidation);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        {/* Matrix grid */}
        <div className="relative inline-block">
          {/* Left bracket */}
          <div className="absolute left-0 top-0 bottom-0 w-2 border-l-2 border-t-2 border-b-2 border-green-500/50" />
          
          {/* Matrix cells */}
          <div 
            className="px-4 py-2"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
              gap: '0.5rem'
            }}
          >
            {matrix.map((row, i) => 
              row.map((cell, j) => (
                <input
                  key={`${i}-${j}`}
                  type="number"
                  min="0"
                  max={modulo - 1}
                  value={cell}
                  onChange={(e) => handleCellChange(i, j, e.target.value)}
                  className={`
                    ${size === 4 ? 'w-14 h-14 text-lg' : 'w-16 h-16 text-xl'} text-center font-mono
                    bg-black/50 border-2 rounded
                    focus:outline-none focus:ring-2 focus:ring-green-500
                    transition-colors
                    ${validation.isValid 
                      ? 'border-green-500/50 text-green-400' 
                      : 'border-red-500/50 text-red-400'
                    }
                  `}
                  aria-label={`Cellule de matrice ligne ${i + 1} colonne ${j + 1}`}
                />
              ))
            )}
          </div>
          
          {/* Right bracket */}
          <div className="absolute right-0 top-0 bottom-0 w-2 border-r-2 border-t-2 border-b-2 border-green-500/50" />
        </div>
      </div>

      {/* Validation feedback */}
      <div className="text-center space-y-2">
        <div className="font-mono text-sm">
          <span className="text-gray-400">det = </span>
          <span className={validation.isValid ? 'text-green-400' : 'text-red-400'}>
            {validation.determinant}
          </span>
          <span className="text-gray-400 mx-2">|</span>
          <span className="text-gray-400">gcd(det, {modulo}) = </span>
          <span className={validation.gcd === 1 ? 'text-green-400' : 'text-red-400'}>
            {validation.gcd}
          </span>
        </div>
        
        {validation.isValid ? (
          <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-mono">La matrice est valide pour le chiffrement</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-red-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-mono">{validation.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
