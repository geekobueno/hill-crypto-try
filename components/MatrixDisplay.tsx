'use client';

import { Matrix } from '@/lib/types';

interface MatrixDisplayProps {
  matrix: Matrix;
  highlight?: boolean;
  label?: string;
}

export default function MatrixDisplay({ 
  matrix, 
  highlight = false,
  label 
}: MatrixDisplayProps) {
  const size = matrix.length;
  
  return (
    <div className="inline-flex flex-col items-center gap-2">
      {/* Optional label */}
      {label && (
        <div className="text-xs font-mono text-gray-400">
          {label}
        </div>
      )}
      
      {/* Matrix with brackets */}
      <div className="relative inline-block">
        {/* Left bracket */}
        <div 
          className={`
            absolute left-0 top-0 bottom-0 w-2 
            border-l-2 border-t-2 border-b-2 
            transition-colors duration-300
            ${highlight 
              ? 'border-green-400' 
              : 'border-green-500/50'
            }
          `}
          aria-hidden="true"
        />
        
        {/* Matrix grid */}
        <div 
          className="px-4 py-2"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            gap: '0.5rem'
          }}
          role="table"
          aria-label={label || "Matrice"}
        >
          {matrix.map((row, i) => 
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`
                  w-12 h-12 flex items-center justify-center
                  font-mono text-lg font-semibold
                  transition-all duration-300
                  ${highlight 
                    ? 'text-green-400 scale-105' 
                    : 'text-green-400/80'
                  }
                `}
                role="cell"
                aria-label={`Élément ligne ${i + 1} colonne ${j + 1}: ${cell}`}
              >
                {cell}
              </div>
            ))
          )}
        </div>
        
        {/* Right bracket */}
        <div 
          className={`
            absolute right-0 top-0 bottom-0 w-2 
            border-r-2 border-t-2 border-b-2 
            transition-colors duration-300
            ${highlight 
              ? 'border-green-400' 
              : 'border-green-500/50'
            }
          `}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
