'use client';

import { useState } from 'react';
import { knownPlaintextAttack, KnownPair } from '@/lib/cryptanalysis';
import { Matrix } from '@/lib/types';
import MatrixDisplay from './MatrixDisplay';
import { encrypt } from '@/lib/hillCipher';
import { generateRandomValidMatrix } from '@/lib/matrixGenerator';

interface AttackSectionProps {
  matrixSize: 2 | 3;
}

export default function AttackSection({ matrixSize }: AttackSectionProps) {
  const [pairs, setPairs] = useState<KnownPair[]>(
    Array(matrixSize).fill(null).map(() => ({ plaintext: '', ciphertext: '' }))
  );
  const [recoveredKey, setRecoveredKey] = useState<Matrix | null>(null);
  const [attackFailed, setAttackFailed] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [generatedKeyMatrix, setGeneratedKeyMatrix] = useState<Matrix | null>(null);

  // Reset pairs when matrix size changes
  const handleMatrixSizeChange = (newSize: number) => {
    if (newSize !== pairs.length) {
      setPairs(Array(newSize).fill(null).map(() => ({ plaintext: '', ciphertext: '' })));
      setRecoveredKey(null);
      setAttackFailed(false);
      setShowSteps(false);
      setGeneratedKeyMatrix(null);
    }
  };

  // Update when matrixSize prop changes
  if (pairs.length !== matrixSize) {
    handleMatrixSizeChange(matrixSize);
  }

  const handlePairChange = (index: number, field: 'plaintext' | 'ciphertext', value: string) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    setPairs(newPairs);
    
    // Reset results when input changes
    setRecoveredKey(null);
    setAttackFailed(false);
    setShowSteps(false);
  };

  const generatePairs = () => {
    // Generate a random valid matrix
    const keyMatrix = generateRandomValidMatrix(matrixSize);
    setGeneratedKeyMatrix(keyMatrix);
    
    // Generate random plaintexts and encrypt them
    const newPairs: KnownPair[] = [];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let i = 0; i < matrixSize; i++) {
      // Generate random plaintext of exactly matrixSize letters
      let plaintext = '';
      for (let j = 0; j < matrixSize; j++) {
        plaintext += letters[Math.floor(Math.random() * letters.length)];
      }
      
      // Encrypt the plaintext
      const encrypted = encrypt(plaintext, keyMatrix);
      const ciphertext = encrypted.result.substring(0, matrixSize);
      
      newPairs.push({ plaintext, ciphertext });
    }
    
    setPairs(newPairs);
    
    // Reset attack results
    setRecoveredKey(null);
    setAttackFailed(false);
    setShowSteps(false);
  };

  const handleAttack = () => {
    // Validate that all pairs have sufficient text
    const validPairs = pairs.every(pair => {
      const cleanPlaintext = pair.plaintext.toUpperCase().replace(/[^A-Z]/g, '');
      const cleanCiphertext = pair.ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
      return cleanPlaintext.length >= matrixSize && cleanCiphertext.length >= matrixSize;
    });

    if (!validPairs) {
      setAttackFailed(true);
      setRecoveredKey(null);
      setShowSteps(false);
      return;
    }

    // Attempt the attack
    const result = knownPlaintextAttack(pairs, matrixSize);
    
    if (result) {
      setRecoveredKey(result);
      setAttackFailed(false);
      setShowSteps(true);
    } else {
      setRecoveredKey(null);
      setAttackFailed(true);
      setShowSteps(false);
    }
  };

  const canAttemptAttack = pairs.every(pair => {
    const cleanPlaintext = pair.plaintext.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanCiphertext = pair.ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    return cleanPlaintext.length >= matrixSize && cleanCiphertext.length >= matrixSize;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-mono font-bold text-red-400">
          Attaque par texte clair connu
        </h2>
        <p className="text-sm font-mono text-gray-400 leading-relaxed">
          Cette section démontre comment le chiffrement de Hill peut être cassé avec des paires 
          texte clair-texte chiffré connues. Pour une matrice {matrixSize}×{matrixSize}, vous avez 
          besoin de {matrixSize} paire{matrixSize > 2 ? 's' : ''}.
        </p>
      </div>

      {/* Security Warning */}
      <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg 
            className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <div className="space-y-1">
            <div className="text-sm font-mono font-bold text-red-400">
              Vulnérabilité de sécurité
            </div>
            <div className="text-xs font-mono text-red-400/80 leading-relaxed">
              Cette attaque démontre pourquoi le chiffrement de Hill n'est pas sécurisé pour 
              un usage moderne. Si un attaquant connaît quelques paires texte clair-texte chiffré, 
              il peut récupérer la clé complète et déchiffrer tous les messages.
            </div>
          </div>
        </div>
      </div>

      {/* Input Pairs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-mono font-semibold text-green-400">
            Paires connues (minimum {matrixSize} paire{matrixSize > 2 ? 's' : ''} requise{matrixSize > 2 ? 's' : ''})
          </h3>
          
          {/* Generate Pairs Button */}
          <button
            onClick={generatePairs}
            className="
              px-4 py-2 font-mono text-sm font-bold rounded-lg
              border-2 border-blue-500 text-blue-400
              bg-blue-500/10 hover:bg-blue-500/20
              transition-all
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            aria-label="Générer des paires d'exemple"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Générer des paires</span>
            </div>
          </button>
        </div>

        {/* Show generated key matrix if available */}
        {generatedKeyMatrix && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg 
                className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <div className="space-y-2 flex-1">
                <div className="text-sm font-mono font-bold text-blue-400">
                  Paires générées avec une clé aléatoire
                </div>
                <div className="text-xs font-mono text-blue-400/80">
                  Ces paires ont été créées en chiffrant des textes aléatoires avec la matrice ci-dessous. 
                  Utilisez l'attaque pour voir si vous pouvez récupérer cette clé !
                </div>
                <div className="flex justify-center pt-2">
                  <MatrixDisplay matrix={generatedKeyMatrix} highlight={false} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {pairs.map((pair, index) => (
          <div 
            key={index}
            className="bg-black/30 border border-green-500/30 rounded-lg p-4 space-y-3"
          >
            <div className="text-sm font-mono font-semibold text-green-400/80">
              Paire {index + 1}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Plaintext input */}
              <div className="space-y-2">
                <label 
                  htmlFor={`plaintext-${index}`}
                  className="block text-xs font-mono text-green-400/70"
                >
                  Texte clair (min. {matrixSize} lettres)
                </label>
                <input
                  id={`plaintext-${index}`}
                  type="text"
                  value={pair.plaintext}
                  onChange={(e) => handlePairChange(index, 'plaintext', e.target.value)}
                  placeholder="Ex: HELLO"
                  className="
                    w-full px-3 py-2 font-mono text-sm
                    bg-black/50 border border-green-500/30 rounded
                    text-green-400 placeholder-green-400/30
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    transition-all
                  "
                  aria-label={`Texte clair pour la paire ${index + 1}`}
                />
              </div>

              {/* Ciphertext input */}
              <div className="space-y-2">
                <label 
                  htmlFor={`ciphertext-${index}`}
                  className="block text-xs font-mono text-green-400/70"
                >
                  Texte chiffré (min. {matrixSize} lettres)
                </label>
                <input
                  id={`ciphertext-${index}`}
                  type="text"
                  value={pair.ciphertext}
                  onChange={(e) => handlePairChange(index, 'ciphertext', e.target.value)}
                  placeholder="Ex: HGDAL"
                  className="
                    w-full px-3 py-2 font-mono text-sm
                    bg-black/50 border border-green-500/30 rounded
                    text-green-400 placeholder-green-400/30
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    transition-all
                  "
                  aria-label={`Texte chiffré pour la paire ${index + 1}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Attack Button */}
      <button
        onClick={handleAttack}
        disabled={!canAttemptAttack}
        className={`
          w-full px-6 py-3 font-mono text-base font-bold rounded-lg
          border-2 transition-all
          ${!canAttemptAttack
            ? 'bg-black/30 border-gray-600/50 text-gray-600 cursor-not-allowed'
            : 'bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/20'
          }
          focus:outline-none focus:ring-2 focus:ring-red-500
        `}
        aria-label="Lancer l'attaque par texte clair connu"
        aria-disabled={!canAttemptAttack}
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Lancer l'attaque</span>
        </div>
      </button>

      {/* Attack Failed Message */}
      {attackFailed && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
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
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
            <div className="space-y-1">
              <div className="text-sm font-mono font-bold text-red-400">
                Attaque échouée
              </div>
              <div className="text-xs font-mono text-red-400/80">
                L'attaque n'a pas pu récupérer la clé. Assurez-vous que :
              </div>
              <ul className="text-xs font-mono text-red-400/80 list-disc list-inside ml-2 space-y-1">
                <li>Chaque paire a au moins {matrixSize} lettres</li>
                <li>Les paires sont valides (texte chiffré correspond au texte clair)</li>
                <li>La matrice de texte clair est inversible modulo 26</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Recovered Key Display */}
      {recoveredKey && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Success message */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <div className="space-y-1">
                <div className="text-sm font-mono font-bold text-red-400">
                  Clé récupérée avec succès !
                </div>
                <div className="text-xs font-mono text-red-400/80">
                  L'attaque a réussi à récupérer la matrice de clé à partir des paires connues.
                </div>
              </div>
            </div>
          </div>

          {/* Recovered key matrix */}
          <div className="bg-black/30 border border-red-500/30 rounded-lg p-6">
            <h4 className="text-sm font-mono font-semibold text-red-400 mb-4">
              Matrice de clé récupérée
            </h4>
            <div className="flex justify-center">
              <MatrixDisplay matrix={recoveredKey} highlight={true} />
            </div>
          </div>

          {/* Mathematical steps */}
          {showSteps && (
            <div className="bg-black/30 border border-green-500/30 rounded-lg p-6 space-y-4">
              <h4 className="text-sm font-mono font-semibold text-green-400">
                Étapes mathématiques de l'attaque
              </h4>
              
              <div className="space-y-3 text-xs font-mono text-green-400/80 leading-relaxed">
                <div className="space-y-2">
                  <div className="text-green-400 font-semibold">Étape 1 : Construction des matrices</div>
                  <div className="ml-4 space-y-1">
                    <div>• Convertir chaque paire texte clair-texte chiffré en vecteurs numériques</div>
                    <div>• Construire la matrice P (texte clair) avec les vecteurs comme colonnes</div>
                    <div>• Construire la matrice C (texte chiffré) avec les vecteurs comme colonnes</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-green-400 font-semibold">Étape 2 : Équation matricielle</div>
                  <div className="ml-4 space-y-1">
                    <div>• Dans le chiffrement de Hill : C = K × P (mod 26)</div>
                    <div>• Où K est la matrice de clé inconnue que nous voulons trouver</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-green-400 font-semibold">Étape 3 : Calcul de l'inverse</div>
                  <div className="ml-4 space-y-1">
                    <div>• Calculer P⁻¹ (l'inverse de la matrice de texte clair modulo 26)</div>
                    <div>• Si P n'est pas inversible, l'attaque échoue</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-green-400 font-semibold">Étape 4 : Récupération de la clé</div>
                  <div className="ml-4 space-y-1">
                    <div>• Résoudre pour K : K = C × P⁻¹ (mod 26)</div>
                    <div>• La matrice résultante est la clé secrète récupérée</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-green-400 font-semibold">Étape 5 : Vérification</div>
                  <div className="ml-4 space-y-1">
                    <div>• Vérifier que K × P ≡ C (mod 26)</div>
                    <div>• La clé récupérée peut maintenant déchiffrer tous les messages</div>
                  </div>
                </div>
              </div>

              {/* Formula display */}
              <div className="bg-black/50 border border-green-500/20 rounded p-4 mt-4">
                <div className="text-center font-mono text-green-400 space-y-2">
                  <div className="text-sm">Formule de l'attaque :</div>
                  <div className="text-lg font-bold">K = C × P⁻¹ (mod 26)</div>
                </div>
              </div>
            </div>
          )}

          {/* Educational note */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg 
                className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <div className="space-y-1">
                <div className="text-sm font-mono font-bold text-yellow-500">
                  Implications pour la sécurité
                </div>
                <div className="text-xs font-mono text-yellow-500/80 leading-relaxed">
                  Cette démonstration montre que le chiffrement de Hill est vulnérable aux 
                  attaques par texte clair connu. Dans un scénario réel, un attaquant pourrait 
                  obtenir des paires texte clair-texte chiffré en devinant le contenu de messages 
                  (par exemple, des en-têtes standards, des salutations communes, etc.). C'est 
                  pourquoi les systèmes cryptographiques modernes utilisent des algorithmes 
                  beaucoup plus complexes et résistants à ce type d'attaque.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
