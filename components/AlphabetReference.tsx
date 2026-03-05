'use client';

interface AlphabetReferenceProps {
  compact?: boolean;
}

export default function AlphabetReference({ compact = false }: AlphabetReferenceProps) {
  // Generate alphabet mapping (A=0, B=1, ..., Z=25)
  const alphabet = Array.from({ length: 26 }, (_, i) => ({
    letter: String.fromCharCode(65 + i),
    number: i
  }));

  if (compact) {
    return (
      <div className="bg-black/30 border border-green-500/30 rounded-lg p-4">
        <h3 className="text-sm font-mono text-green-400/70 mb-3 text-center">
          Correspondance Alphabet ↔ Nombres
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {alphabet.map(({ letter, number }) => (
            <div
              key={letter}
              className="flex items-center gap-1 text-xs font-mono"
            >
              <span className="text-green-400 font-bold">{letter}</span>
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
        Correspondance Alphabet ↔ Nombres
      </h3>
      <div className="grid grid-cols-13 gap-2">
        {alphabet.map(({ letter, number }) => (
          <div
            key={letter}
            className="flex flex-col items-center justify-center p-2 bg-green-500/5 border border-green-500/20 rounded hover:bg-green-500/10 transition-colors"
          >
            <span className="text-xl font-mono text-green-400 font-bold">
              {letter}
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
