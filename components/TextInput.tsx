'use client';

import { useState, useEffect } from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  modulo?: 26 | 37;
}

export default function TextInput({ 
  value, 
  onChange, 
  label, 
  placeholder = "Entrez votre texte ici...",
  disabled = false,
  modulo = 26
}: TextInputProps) {
  const [error, setError] = useState<string>('');
  
  // Process text based on modulo
  const regex = modulo === 26 ? /[^A-Z]/g : /[^A-Z0-9 ]/g;
  const processedText = value.toUpperCase().replace(regex, '');
  
  // Validate input
  useEffect(() => {
    if (value.trim() === '') {
      setError('Veuillez entrer du texte à chiffrer');
    } else {
      setError('');
    }
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="block text-green-400 font-mono text-sm font-semibold">
        {label}
      </label>
      
      {/* Text input area */}
      <textarea
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        rows={4}
        className={`
          w-full px-4 py-3 font-mono text-base
          bg-black/50 border-2 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-green-500
          transition-colors resize-none
          ${error && value.trim() === '' 
            ? 'border-red-500/50 text-red-400' 
            : 'border-green-500/50 text-green-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label={label}
        aria-invalid={error && value.trim() === '' ? 'true' : 'false'}
        aria-describedby={error && value.trim() === '' ? 'text-input-error' : undefined}
      />
      
      {/* Character count and processed text preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-gray-400">
            Caractères: <span className="text-green-400">{value.length}</span>
          </span>
          <span className="text-gray-400">
            Traités: <span className="text-green-400">{processedText.length}</span>
          </span>
        </div>
        
        {/* Processed text preview */}
        {processedText && (
          <div className="p-3 bg-black/30 border border-green-500/30 rounded">
            <div className="text-xs text-gray-400 mb-1">
              Texte traité ({modulo === 26 ? 'A-Z uniquement' : 'A-Z, 0-9, ␣'}):
            </div>
            <div className="font-mono text-sm text-green-400 break-all">
              {processedText || <span className="text-gray-500 italic">Aucun caractère valide</span>}
            </div>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && value.trim() === '' && (
        <div 
          id="text-input-error"
          className="flex items-center gap-2 text-red-400 text-sm font-mono"
          role="alert"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
