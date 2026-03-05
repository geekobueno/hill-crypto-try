'use client';

import { useState } from 'react';
import { Matrix, MatrixValidation, CipherResult, ModuloType } from '@/lib/types';
import { encrypt, decrypt } from '@/lib/hillCipherModulo';
import { generateRandomValidMatrix } from '@/lib/matrixGeneratorModulo';
import { validateMatrixModulo } from '@/lib/matrixMathModulo';
import MatrixInput from '@/components/MatrixInput';
import TextInput from '@/components/TextInput';
import ControlPanel from '@/components/ControlPanel';
import ResultDisplay from '@/components/ResultDisplay';
import StepByStep from '@/components/StepByStep';
import Disclaimer from '@/components/Disclaimer';
import ConceptExplainer from '@/components/ConceptExplainer';
import AttackSection from '@/components/AttackSection';
import AlphabetReference from '@/components/AlphabetReference';
import Footer from '@/components/Footer';

export default function Home() {
  // State management
  const [matrixSize, setMatrixSize] = useState<2 | 3 | 4>(2);
  const [modulo, setModulo] = useState<ModuloType>(26);
  const [matrix, setMatrix] = useState<Matrix>([[3, 3], [2, 5]]);
  const [matrixValidation, setMatrixValidation] = useState<MatrixValidation>({
    isValid: true,
    determinant: 9,
    gcd: 1
  });
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<CipherResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  // Handle modulo change
  const handleModuloChange = (newModulo: ModuloType) => {
    setModulo(newModulo);
    // Revalidate matrix with new modulo
    const validation = validateMatrixModulo(matrix, newModulo);
    setMatrixValidation(validation);
    // Clear results
    setResult(null);
    setError('');
  };

  // Handle matrix size change
  const handleMatrixSizeChange = (newSize: 2 | 3 | 4) => {
    setMatrixSize(newSize);
    // Reset matrix to default for new size
    const defaultMatrix = newSize === 2 
      ? [[3, 3], [2, 5]] 
      : newSize === 3
      ? [[6, 24, 1], [13, 16, 10], [20, 17, 15]]
      : [[6, 24, 1, 13], [13, 16, 10, 20], [20, 17, 15, 6], [1, 2, 3, 5]];
    setMatrix(defaultMatrix);
    // Revalidate with current modulo
    const validation = validateMatrixModulo(defaultMatrix, modulo);
    setMatrixValidation(validation);
    // Clear results
    setResult(null);
    setError('');
  };

  // Handle matrix change
  const handleMatrixChange = (newMatrix: Matrix, validation: MatrixValidation) => {
    setMatrix(newMatrix);
    setMatrixValidation(validation);
    // Clear error if matrix becomes valid
    if (validation.isValid && error) {
      setError('');
    }
  };

  // Handle text change
  const handleTextChange = (newText: string) => {
    setText(newText);
    // Clear error if text is provided
    if (newText.trim() && error) {
      setError('');
    }
  };

  // Handle encryption
  const handleEncrypt = () => {
    // Validate inputs
    const cleanText = text.trim();
    
    if (!cleanText) {
      setError('Veuillez entrer du texte à chiffrer');
      return;
    }
    
    if (!matrixValidation.isValid) {
      setError('La matrice de clé n\'est pas valide. Veuillez corriger la matrice.');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      const encryptResult = encrypt(cleanText, matrix, modulo);
      setResult(encryptResult);
    } catch (err) {
      setError(`Erreur lors du chiffrement: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle decryption
  const handleDecrypt = () => {
    // Validate inputs
    const cleanText = text.trim();
    
    if (!cleanText) {
      setError('Veuillez entrer du texte à déchiffrer');
      return;
    }
    
    if (!matrixValidation.isValid) {
      setError('La matrice de clé n\'est pas valide. Veuillez corriger la matrice.');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      const decryptResult = decrypt(cleanText, matrix, modulo);
      setResult(decryptResult);
    } catch (err) {
      setError(`Erreur lors du déchiffrement: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle random matrix generation
  const handleGenerateMatrix = () => {
    const newMatrix = generateRandomValidMatrix(matrixSize, modulo);
    setMatrix(newMatrix);
    // Revalidate with current modulo
    const validation = validateMatrixModulo(newMatrix, modulo);
    setMatrixValidation(validation);
    setError('');
  };

  // Check if encrypt/decrypt buttons should be disabled
  const cleanText = text.trim();
  const encryptDisabled = !cleanText || !matrixValidation.isValid || isProcessing;
  const decryptDisabled = !cleanText || !matrixValidation.isValid || isProcessing;

  return (
    <main className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <header className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-terminal-accent">
              Chiffre de Hill
            </h1>
            <p className="text-terminal-text opacity-80 text-lg">
              Apprenez le chiffrement classique par des démonstrations interactives
            </p>
          </header>

          {/* Disclaimer */}
          <Disclaimer />

          {/* Modulo Selector */}
          <div className="bg-terminal-border/30 rounded-lg border border-terminal-border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-green-400 mb-2">
                  Mode de chiffrement
                </h3>
                <p className="text-sm font-mono text-gray-400">
                  Choisissez le jeu de caractères à utiliser
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleModuloChange(26)}
                  className={`
                    px-6 py-3 font-mono text-sm font-bold rounded-lg
                    border-2 transition-all
                    ${modulo === 26
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-black/30 border-gray-600/50 text-gray-400 hover:border-green-500/50 hover:text-green-400/70'
                    }
                    focus:outline-none focus:ring-2 focus:ring-green-500
                  `}
                  aria-label="Modulo 26 (A-Z)"
                  aria-pressed={modulo === 26}
                >
                  <div className="text-center">
                    <div className="text-lg">Modulo 26</div>
                    <div className="text-xs opacity-70">A-Z</div>
                  </div>
                </button>
                <button
                  onClick={() => handleModuloChange(37)}
                  className={`
                    px-6 py-3 font-mono text-sm font-bold rounded-lg
                    border-2 transition-all
                    ${modulo === 37
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-black/30 border-gray-600/50 text-gray-400 hover:border-green-500/50 hover:text-green-400/70'
                    }
                    focus:outline-none focus:ring-2 focus:ring-green-500
                  `}
                  aria-label="Modulo 37 (A-Z, 0-9, espace)"
                  aria-pressed={modulo === 37}
                >
                  <div className="text-center">
                    <div className="text-lg">Modulo 37</div>
                    <div className="text-xs opacity-70">A-Z, 0-9, ␣</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Alphabet Reference */}
          <AlphabetReference compact={true} modulo={modulo} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Controls and Inputs */}
            <div className="space-y-6">
              {/* Matrix Size Selector and Control Panel */}
              <div className="bg-terminal-border/30 rounded-lg border border-terminal-border p-6">
                <h2 className="text-xl font-bold text-green-400 mb-4">
                  Contrôles
                </h2>
                <ControlPanel
                  matrixSize={matrixSize}
                  onMatrixSizeChange={handleMatrixSizeChange}
                  onEncrypt={handleEncrypt}
                  onDecrypt={handleDecrypt}
                  onGenerateMatrix={handleGenerateMatrix}
                  encryptDisabled={encryptDisabled}
                  decryptDisabled={decryptDisabled}
                  isProcessing={isProcessing}
                />
              </div>

              {/* Matrix Input */}
              <div className="bg-terminal-border/30 rounded-lg border border-terminal-border p-6">
                <h2 className="text-xl font-bold text-green-400 mb-4">
                  Matrice de clé ({matrixSize}×{matrixSize})
                </h2>
                <MatrixInput
                  size={matrixSize}
                  initialMatrix={matrix}
                  modulo={modulo}
                  onChange={handleMatrixChange}
                />
              </div>

              {/* Text Input */}
              <div className="bg-terminal-border/30 rounded-lg border border-terminal-border p-6">
                <TextInput
                  value={text}
                  onChange={handleTextChange}
                  label="Texte d'entrée"
                  placeholder="Entrez votre texte ici..."
                  disabled={isProcessing}
                  modulo={modulo}
                />
              </div>
            </div>

            {/* Right Column: Results and Visualization */}
            <div className="space-y-6">
              {/* Error Display */}
              {error && (
                <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start gap-3">
                    <svg 
                      className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    <div className="flex-1">
                      <div className="text-sm font-mono font-bold text-red-400 mb-1">
                        Erreur
                      </div>
                      <div className="text-sm font-mono text-red-400/80">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Result Display */}
              {result && (
                <div className="bg-terminal-border/30 rounded-lg border border-terminal-border p-6 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="text-xl font-bold text-green-400 mb-4">
                    Résultat
                  </h2>
                  <ResultDisplay
                    result={result.result}
                    type={result.inverseMatrix ? 'plaintext' : 'ciphertext'}
                  />
                </div>
              )}

              {/* Step-by-Step Visualization */}
              {result && result.steps.length > 0 && (
                <div className="bg-terminal-border/30 rounded-lg border border-terminal-border p-6 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="text-xl font-bold text-green-400 mb-4">
                    Calculs étape par étape
                  </h2>
                  <StepByStep steps={result.steps} />
                </div>
              )}

              {/* Placeholder when no result */}
              {!result && !error && (
                <div className="bg-terminal-border/30 rounded-lg border border-terminal-border p-12 text-center">
                  <svg 
                    className="w-16 h-16 mx-auto mb-4 text-gray-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  <p className="text-gray-500 font-mono text-sm">
                    Entrez du texte et une matrice valide, puis cliquez sur Chiffrer ou Déchiffrer
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className="bg-terminal-border/30 rounded-lg border border-terminal-border p-6">
            <ConceptExplainer />
          </div>

          {/* Attack Section (Bonus Feature) */}
          <div className="bg-terminal-border/30 rounded-lg border border-terminal-border p-6">
            <AttackSection matrixSize={matrixSize} modulo={modulo} onMatrixSizeChange={handleMatrixSizeChange} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
