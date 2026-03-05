'use client';

export default function Footer() {
  return (
    <footer className="bg-terminal-border/30 border-t-2 border-terminal-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Project Info */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <svg 
                className="w-6 h-6 text-green-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
              <h3 className="text-xl font-mono font-bold text-green-400">
                Projet Académique
              </h3>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-mono text-gray-300">
                Projet réalisé dans le cadre du cours de <span className="text-green-400 font-semibold">CRYPTOGRAPHIE</span>
              </p>
              <p className="text-sm font-mono text-gray-300">
                <span className="text-green-400 font-semibold">ESGIS-TOGO</span> • Filière Systèmes Réseaux et Sécurité
              </p>
              <p className="text-sm font-mono text-gray-400">
                Promotion Master 2 • 2025-2026
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-terminal-border/50"></div>

          {/* Students List */}
          <div className="space-y-4">
            <h4 className="text-center text-base font-mono font-semibold text-green-400">
              Équipe du projet
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 1, name: 'EHLAN K. Etonam' },
                { id: 2, name: 'EZIAN Komla' },
                { id: 3, name: 'AFFO-DOGO Rachaad' },
                { id: 4, name: 'SIMTAYA Martin' },
                { id: 5, name: 'ABAKAR Mahamat' },
                { id: 6, name: 'TCHATAKOURA Bassitou' }
              ].map((student) => (
                <div 
                  key={student.id}
                  className="bg-black/30 border border-green-500/30 rounded-lg p-3 flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-green-400">
                      {student.id}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-gray-300">
                    {student.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-terminal-border/50"></div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs font-mono text-gray-500">
              © 2025-2026 ESGIS-TOGO • Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
