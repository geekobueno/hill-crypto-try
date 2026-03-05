'use client';

export default function Disclaimer() {
  return (
    <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg p-6">
      <div className="flex items-start gap-4">
        {/* Warning icon */}
        <div className="flex-shrink-0">
          <svg 
            className="w-8 h-8 text-yellow-500" 
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
        </div>
        
        {/* Content */}
        <div className="flex-1 space-y-3">
          <h2 className="text-xl font-mono font-bold text-yellow-500">
            À des fins éducatives uniquement
          </h2>
          
          <div className="space-y-2 text-sm font-mono text-yellow-500/90 leading-relaxed">
            <p>
              Cette application est conçue pour enseigner le chiffrement de Hill, 
              un algorithme cryptographique historique développé par Lester S. Hill en 1929.
            </p>
            
            <p>
              <strong className="text-yellow-500">Avertissement :</strong> Le chiffrement de Hill 
              n'est <strong>pas sécurisé</strong> pour un usage moderne. Il est vulnérable aux 
              attaques par texte clair connu et ne doit jamais être utilisé pour protéger 
              des données sensibles réelles.
            </p>
            
            <p>
              Cette application est destinée à des fins éducatives pour comprendre les 
              concepts fondamentaux de la cryptographie classique, notamment :
            </p>
            
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Chiffrement par substitution polyalphabétique</li>
              <li>Opérations matricielles en cryptographie</li>
              <li>Arithmétique modulaire</li>
              <li>Vulnérabilités des systèmes cryptographiques classiques</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
