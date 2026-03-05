'use client';

import { ModuloType } from '@/lib/types';
import { numberToChar } from '@/lib/charMapping';

interface AlphabetReferenceProps {
  compact?: boolean;
  modulo?: ModuloType;
}

export default function AlphabetReference({ compact = false, modulo = 26 }: AlphabetReferenceProps) {
  // Generate alphabet mapping based on modulo
  const getMapping = () => {
    const mapping: { char: string; number: number }[] = [];
    
    for (let i = 0; i < modulo; i++) {
      mapping.push({
        char: numberToChar(i, modulo),
        number: i
      });
    }
    
    return mapping;
  };
  
  const mapping = getMapping();
  
  const getTitle = () => {
    if (modulo === 26) {
      return 'Correspondance Alphabet ↔ Nombres';
    } else {
      return 'Correspondance Caractères ↔ Nombres (A-Z, 0-9, espace)';
    }
  };

  if (compact) {
    return (
      <div className="bg-black/30 border border-green-500/30 rounded-lg p-4">
        <h3 className="text-sm font-mono text-green-400/70 mb-3 text-center">
          {getTitle()}
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {mapping.map(({ char, number }) => (
            <div
              key={number}
              className="flex items-center gap-1 text-xs font-mono"
            >
              <span className="text-green-400 font-bold">{char === ' ' ? '␣' : char}</span>
              <span className="text-green-400/50">=</span>
              <span className="text-green-400/80">{number}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 border border-green-500/30 rounded-lg p-6">
      <h3 className="text-lg font-mono text-green-400 font-semibold mb-4 text-center">
        {getTitle()}
      </h3>
      <div className="grid grid-cols-13 gap-2">
        {mapping.map(({ char, number }) => (
          <div
            key={number}
            className="flex flex-col items-center justify-center p-2 bg-green-500/5 border border-green-500/20 rounded hover:bg-green-500/10 transition-colors"
          >
            <span className="text-xl font-mono text-green-400 font-bold">
              {char === ' ' ? '␣' : char}
            </span>
            <span className="text-xs font-mono text-green-400/50">↕</span>
            <span className="text-lg font-mono text-green-400/80">
              {number}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
