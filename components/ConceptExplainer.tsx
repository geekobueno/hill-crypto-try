'use client';

import { useState } from 'react';

interface ConceptExplainerProps {
  concepts?: ConceptDefinition[];
}

interface ConceptDefinition {
  term: string;
  definition: string;
  example?: string;
}

const defaultConcepts: ConceptDefinition[] = [
  {
    term: 'Matrices valides pour Hill',
    definition: 'Pour que le chiffrement de Hill fonctionne, la matrice de clé doit être inversible modulo 26. Cela nécessite deux conditions : (1) le déterminant ne doit pas être zéro, et (2) le déterminant doit être copremier avec 26 (pgcd(det, 26) = 1). Si ces conditions ne sont pas remplies, le déchiffrement est impossible car on ne peut pas calculer la matrice inverse.',
    example: 'Matrice valide : [[3,3],[2,5]] avec det=9, pgcd(9,26)=1 ✓ | Matrice invalide : [[2,4],[1,2]] avec det=0 ✗ | Matrice invalide : [[13,1],[0,1]] avec det=13, pgcd(13,26)=13 ✗'
  },
  {
    term: 'Padding automatique',
    definition: 'Si la longueur du texte n\'est pas un multiple de la taille de la matrice, l\'algorithme ajoute automatiquement des lettres X à la fin pour compléter le dernier bloc. Cela garantit que tous les vecteurs ont la bonne taille pour la multiplication matricielle.',
    example: 'Pour une matrice 2×2 : "HELLO" (5 lettres) → "HELLOX" (6 lettres) → vecteurs [7,4], [11,11], [14,23]'
  },
  {
    term: 'Déterminant',
    definition: 'Une valeur scalaire calculée à partir d\'une matrice carrée. Pour une matrice 2×2 [a,b;c,d], le déterminant est ad - bc. Le déterminant indique si une matrice est inversible.',
    example: 'Pour [[3,3],[2,5]], det = 3×5 - 3×2 = 15 - 6 = 9'
  },
  {
    term: 'Inverse modulaire',
    definition: 'Un nombre x tel que (a × x) mod m = 1. L\'inverse modulaire n\'existe que si a et m sont premiers entre eux (pgcd = 1).',
    example: 'L\'inverse de 9 modulo 26 est 3, car (9 × 3) mod 26 = 27 mod 26 = 1'
  },
  {
    term: 'Coprimalité',
    definition: 'Deux nombres sont premiers entre eux (copremiers) si leur plus grand commun diviseur (pgcd) est 1. C\'est essentiel pour que la matrice soit inversible modulo 26.',
    example: '9 et 26 sont copremiers car pgcd(9, 26) = 1, mais 13 et 26 ne le sont pas car pgcd(13, 26) = 13'
  },
  {
    term: 'Arithmétique modulaire',
    definition: 'Un système arithmétique pour les entiers où les nombres "s\'enroulent" après avoir atteint une certaine valeur (le module). Dans le chiffre de Hill, nous utilisons modulo 26 pour les 26 lettres de l\'alphabet.',
    example: '33 mod 26 = 7 (car 33 = 1×26 + 7)'
  },
  {
    term: 'Matrice de clé',
    definition: 'Une matrice carrée (2×2 ou 3×3) utilisée pour chiffrer et déchiffrer les messages. Elle doit être inversible modulo 26 pour permettre le déchiffrement.',
    example: 'Une matrice 2×2 valide : [[3,3],[2,5]] avec det = 9, qui est copremier avec 26'
  },
  {
    term: 'Attaque par texte clair connu',
    definition: 'Une méthode de cryptanalyse où un attaquant possède des paires de texte clair et texte chiffré correspondants. Pour le chiffre de Hill, connaître n paires (où n est la dimension de la matrice) permet de récupérer la clé secrète en résolvant l\'équation matricielle K = C × P⁻¹ (mod 26).',
    example: 'Avec 2 paires pour une matrice 2×2 : si "HE"→"AB" et "LO"→"CD", on peut calculer la matrice de clé en construisant les matrices P (texte clair) et C (texte chiffré), puis en résolvant K = C × P⁻¹ mod 26'
  }
];

export default function ConceptExplainer({ concepts = defaultConcepts }: ConceptExplainerProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleConcept = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-mono font-bold text-green-400 mb-4">
        Concepts clés
      </h2>
      
      <div className="space-y-2">
        {concepts.map((concept, index) => (
          <div
            key={index}
            className="bg-black/30 border border-green-500/30 rounded-lg overflow-hidden transition-all"
          >
            {/* Concept header - clickable */}
            <button
              onClick={() => toggleConcept(index)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-green-500/5 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
              aria-expanded={expandedIndex === index}
              aria-controls={`concept-${index}`}
            >
              <span className="font-mono font-semibold text-green-400 text-left">
                {concept.term}
              </span>
              
              <svg
                className={`w-5 h-5 text-green-400 transition-transform duration-200 ${
                  expandedIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {/* Concept content - expandable */}
            {expandedIndex === index && (
              <div
                id={`concept-${index}`}
                className="px-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <p className="text-sm font-mono text-green-400/80 leading-relaxed">
                  {concept.definition}
                </p>
                
                {concept.example && (
                  <div className="bg-black/50 border border-green-500/20 rounded p-3">
                    <div className="text-xs font-mono text-green-400/60 mb-1">
                      Exemple :
                    </div>
                    <div className="text-sm font-mono text-green-400/90">
                      {concept.example}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Helper text */}
      <div className="text-xs font-mono text-gray-500 text-center pt-2">
        Cliquez sur un concept pour voir sa définition et des exemples
      </div>
    </div>
  );
}
