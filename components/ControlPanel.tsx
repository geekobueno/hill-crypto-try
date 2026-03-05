'use client';

interface ControlPanelProps {
  matrixSize: 2 | 3 | 4;
  onMatrixSizeChange: (size: 2 | 3 | 4) => void;
  onEncrypt: () => void;
  onDecrypt: () => void;
  onGenerateMatrix: () => void;
  encryptDisabled: boolean;
  decryptDisabled: boolean;
  isProcessing?: boolean;
}

export default function ControlPanel({
  matrixSize,
  onMatrixSizeChange,
  onEncrypt,
  onDecrypt,
  onGenerateMatrix,
  encryptDisabled,
  decryptDisabled,
  isProcessing = false
}: ControlPanelProps) {
  return (
    <div className="space-y-6">
      {/* Matrix Size Selector */}
      <div className="space-y-3">
        <label className="block text-green-400 font-mono text-sm font-semibold">
          Taille de la matrice
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => onMatrixSizeChange(2)}
            disabled={isProcessing}
            className={`
              flex-1 px-6 py-3 font-mono text-lg font-bold rounded-lg
              border-2 transition-all
              ${matrixSize === 2
                ? 'bg-green-500/20 border-green-500 text-green-400 shadow-lg shadow-green-500/20'
                : 'bg-black/50 border-green-500/30 text-green-400/60 hover:border-green-500/50 hover:text-green-400'
              }
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-green-500
            `}
            aria-label="Sélectionner matrice 2×2"
            aria-pressed={matrixSize === 2}
          >
            2×2
          </button>
          <button
            onClick={() => onMatrixSizeChange(3)}
            disabled={isProcessing}
            className={`
              flex-1 px-6 py-3 font-mono text-lg font-bold rounded-lg
              border-2 transition-all
              ${matrixSize === 3
                ? 'bg-green-500/20 border-green-500 text-green-400 shadow-lg shadow-green-500/20'
                : 'bg-black/50 border-green-500/30 text-green-400/60 hover:border-green-500/50 hover:text-green-400'
              }
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-green-500
            `}
            aria-label="Sélectionner matrice 3×3"
            aria-pressed={matrixSize === 3}
          >
            3×3
          </button>
          <button
            onClick={() => onMatrixSizeChange(4)}
            disabled={isProcessing}
            className={`
              flex-1 px-6 py-3 font-mono text-lg font-bold rounded-lg
              border-2 transition-all
              ${matrixSize === 4
                ? 'bg-green-500/20 border-green-500 text-green-400 shadow-lg shadow-green-500/20'
                : 'bg-black/50 border-green-500/30 text-green-400/60 hover:border-green-500/50 hover:text-green-400'
              }
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-green-500
            `}
            aria-label="Sélectionner matrice 4×4"
            aria-pressed={matrixSize === 4}
          >
            4×4
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Encrypt and Decrypt Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onEncrypt}
            disabled={encryptDisabled || isProcessing}
            className={`
              px-6 py-3 font-mono text-base font-bold rounded-lg
              border-2 transition-all
              ${encryptDisabled || isProcessing
                ? 'bg-black/30 border-gray-600/50 text-gray-600 cursor-not-allowed'
                : 'bg-green-500/10 border-green-500 text-green-400 hover:bg-green-500/20 hover:shadow-lg hover:shadow-green-500/20'
              }
              focus:outline-none focus:ring-2 focus:ring-green-500
            `}
            aria-label="Chiffrer le texte"
            aria-disabled={encryptDisabled || isProcessing}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Chiffrer</span>
            </div>
          </button>

          <button
            onClick={onDecrypt}
            disabled={decryptDisabled || isProcessing}
            className={`
              px-6 py-3 font-mono text-base font-bold rounded-lg
              border-2 transition-all
              ${decryptDisabled || isProcessing
                ? 'bg-black/30 border-gray-600/50 text-gray-600 cursor-not-allowed'
                : 'bg-green-500/10 border-green-500 text-green-400 hover:bg-green-500/20 hover:shadow-lg hover:shadow-green-500/20'
              }
              focus:outline-none focus:ring-2 focus:ring-green-500
            `}
            aria-label="Déchiffrer le texte"
            aria-disabled={decryptDisabled || isProcessing}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <span>Déchiffrer</span>
            </div>
          </button>
        </div>

        {/* Generate Random Matrix Button */}
        <button
          onClick={onGenerateMatrix}
          disabled={isProcessing}
          className={`
            w-full px-6 py-3 font-mono text-base font-bold rounded-lg
            border-2 transition-all
            ${isProcessing
              ? 'bg-black/30 border-gray-600/50 text-gray-600 cursor-not-allowed'
              : 'bg-black/50 border-green-500/50 text-green-400 hover:border-green-500 hover:bg-green-500/10 hover:shadow-lg hover:shadow-green-500/10'
            }
            focus:outline-none focus:ring-2 focus:ring-green-500
          `}
          aria-label="Générer une matrice valide aléatoire"
          aria-disabled={isProcessing}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Générer une matrice valide aléatoire</span>
          </div>
        </button>
      </div>

      {/* Helper text for disabled buttons */}
      {(encryptDisabled || decryptDisabled) && (
        <div className="text-xs font-mono text-gray-500 text-center">
          {encryptDisabled && decryptDisabled ? (
            <span>Entrez du texte et une matrice valide pour activer les boutons</span>
          ) : encryptDisabled ? (
            <span>Entrez du texte pour activer le chiffrement</span>
          ) : (
            <span>Entrez du texte pour activer le déchiffrement</span>
          )}
        </div>
      )}
    </div>
  );
}
