'use client';

import { useState } from 'react';

interface ResultDisplayProps {
  result: string;
  type: 'ciphertext' | 'plaintext';
  label?: string;
}

export default function ResultDisplay({ 
  result, 
  type,
  label 
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Échec de la copie:', err);
    }
  };

  // Default labels in French based on type
  const defaultLabel = type === 'ciphertext' ? 'Texte chiffré' : 'Texte déchiffré';
  const displayLabel = label || defaultLabel;

  // Empty result handling
  if (!result || result.length === 0) {
    return (
      <div className="w-full p-6 bg-terminal-border/30 rounded-lg border border-terminal-border">
        <div className="text-center text-gray-500 font-mono text-sm">
          Aucun résultat
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-terminal-border/30 rounded-lg border border-terminal-border">
      {/* Label */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">
          {displayLabel}
        </h3>
        
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`
            px-4 py-2 rounded font-mono text-sm font-semibold
            transition-all duration-300
            ${copied 
              ? 'bg-green-500/20 text-green-400 border-green-400' 
              : 'bg-terminal-accent/10 text-terminal-accent border-terminal-accent hover:bg-terminal-accent/20'
            }
            border
          `}
          aria-label={copied ? 'Texte copié' : 'Copier le texte'}
        >
          {copied ? '✓ Copié !' : 'Copier'}
        </button>
      </div>

      {/* Result text */}
      <div 
        className="
          p-4 rounded bg-black/30
          font-mono text-2xl font-bold text-green-400
          break-all leading-relaxed
          border border-green-500/20
        "
        role="region"
        aria-label={`${displayLabel}: ${result}`}
      >
        {result}
      </div>

      {/* Character count */}
      <div className="mt-3 text-xs font-mono text-gray-500 text-right">
        {result.length} caractère{result.length > 1 ? 's' : ''}
      </div>
    </div>
  );
}
