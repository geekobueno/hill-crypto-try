export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-terminal-accent mb-2">
            Hill Cipher Educational App
          </h1>
          <p className="text-terminal-text opacity-80">
            Learn classical encryption through interactive demonstrations
          </p>
          <p className="text-terminal-warning text-sm mt-2">
            ⚠️ For educational purposes only - not secure for real-world use
          </p>
        </header>

        <div className="terminal-box">
          <p className="text-center text-terminal-text">
            Application setup complete. Components will be added in subsequent tasks.
          </p>
        </div>
      </div>
    </main>
  );
}
