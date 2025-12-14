"use client";
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [status, setStatus] = useState<any>(null);

  // Poll the status.json file every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/status.json?t=' + new Date().getTime()) // Prevent caching
        .then(res => res.json())
        .then(data => setStatus(data));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div className="p-10 text-white">Loading Mission Control...</div>;

  return (
    <main className="min-h-screen bg-black text-green-400 p-10 font-mono">
      <h1 className="text-4xl font-bold mb-8 border-b border-green-700 pb-4">
        🚀 AVENGERS PROTOCOL: LIVE STATUS
      </h1>

      <div className="grid grid-cols-2 gap-6">
        {/* CODERABBIT CARD */}
        <div className={`p-6 border-2 rounded ${status.coderabbit.includes("Issue") ? 'border-red-500 text-red-400' : 'border-green-600'}`}>
          <h2 className="text-xl font-bold">🐰 CodeRabbit Review</h2>
          <p className="text-2xl mt-2">{status.coderabbit}</p>
        </div>

        {/* KESTRA CARD */}
        <div className={`p-6 border-2 rounded ${status.kestra === "Active" ? 'border-yellow-400 text-yellow-400' : 'border-blue-600'}`}>
          <h2 className="text-xl font-bold">⚡ Kestra Orchestrator</h2>
          <p className="text-2xl mt-2">{status.kestra}</p>
        </div>

        {/* CLINE CARD */}
        <div className={`p-6 border-2 rounded ${status.cline === "FIXED" ? 'border-green-400 bg-green-900/20' : 'border-gray-600'}`}>
          <h2 className="text-xl font-bold">🤖 Cline Auto-Fixer</h2>
          <p className="text-2xl mt-2">{status.cline}</p>
        </div>

        {/* OUMI CARD */}
        <div className={`p-6 border-2 rounded ${status.oumi === "TRAINED" ? 'border-purple-500 text-purple-400' : 'border-gray-600'}`}>
          <h2 className="text-xl font-bold">🧠 Oumi RL Brain</h2>
          <p className="text-2xl mt-2">{status.oumi}</p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-900 border border-gray-700 rounded">
        <span className="text-gray-500">LATEST LOG:</span>
        <span className="ml-4 text-white typing-effect">{status.last_log}</span>
      </div>
    </main>
  );
}