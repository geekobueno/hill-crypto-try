'use client';

import { Vector } from '@/lib/types';

interface VectorDisplayProps {
  vector: Vector;
  highlight?: boolean;
  label?: string;
  showMapping?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export default function VectorDisplay({ 
  vector, 
  highlight = false,
  label,
  showMapping = false,
  orientation = 'vertical'
}: VectorDisplayProps) {
  // Convert number to letter (0=A, 1=B, ..., 25=Z)
  const numberToLetter = (num: number): string => {
    return String.fromCharCode(65 + num);
  };

  return (
    <div className="inline-flex flex-col items-center gap-2">
      {/* Optional label */}
      {label && (
        <div className="text-xs font-mono text-gray-400">
          {label}
        </div>
      )}
      
      {/* Vector with brackets */}
      <div className="relative inline-block">
        {orientation === 'vertical' ? (
          <>
            {/* Top bracket */}
            <div 
              className={`
                absolute left-0 right-0 top-0 h-2 
                border-l-2 border-r-2 border-t-2 
                transition-colors duration-300
                ${highlight 
                  ? 'border-green-400' 
                  : 'border-green-500/50'
                }
              `}
              aria-hidden="true"
            />
            
            {/* Vector elements */}
            <div 
              className="px-4 py-2 flex flex-col gap-2"
              role="list"
              aria-label={label || "Vecteur"}
            >
              {vector.map((value, i) => (
                <div
                  key={i}
                  className={`
                    w-12 h-12 flex items-center justify-center
                    font-mono text-lg font-semibold
                    transition-all duration-300
                    ${highlight 
                      ? 'text-green-400 scale-105' 
                      : 'text-green-400/80'
                    }
                  `}
                  role="listitem"
                  aria-label={`Élément ${i + 1}: ${value}${showMapping ? ` (${numberToLetter(value)})` : ''}`}
                >
                  {value}
                </div>
              ))}
            </div>
            
            {/* Bottom bracket */}
            <div 
              className={`
                absolute left-0 right-0 bottom-0 h-2 
                border-l-2 border-r-2 border-b-2 
                transition-colors duration-300
                ${highlight 
                  ? 'border-green-400' 
                  : 'border-green-500/50'
                }
              `}
              aria-hidden="true"
            />
          </>
        ) : (
          <>
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
            
            {/* Vector elements */}
            <div 
              className="px-4 py-2 flex flex-row gap-2"
              role="list"
              aria-label={label || "Vecteur"}
            >
              {vector.map((value, i) => (
                <div
                  key={i}
                  className={`
                    w-12 h-12 flex items-center justify-center
                    font-mono text-lg font-semibold
                    transition-all duration-300
                    ${highlight 
                      ? 'text-green-400 scale-105' 
                      : 'text-green-400/80'
                    }
                  `}
                  role="listitem"
                  aria-label={`Élément ${i + 1}: ${value}${showMapping ? ` (${numberToLetter(value)})` : ''}`}
                >
                  {value}
                </div>
              ))}
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
          </>
        )}
      </div>
      
      {/* Optional letter-to-number mapping */}
      {showMapping && (
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {vector.map((value, i) => (
            <div
              key={i}
              className="text-xs font-mono text-gray-400"
              aria-label={`Correspondance: ${numberToLetter(value)} égale ${value}`}
            >
              {numberToLetter(value)}={value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
