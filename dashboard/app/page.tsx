export default function Home() {
  const agents = [
    { name: "Cline CLI", status: "ACTIVE", task: "Building Automation Tools" },
    { name: "Kestra Orchestrator", status: "IDLE", task: "Waiting for Commit" },
    { name: "CodeRabbit", status: "WATCHING", task: "Reviewing PRs" },
    { name: "Oumi Trainer", status: "PENDING", task: "RL Fine-tuning" },
  ];

  return (
    <main className="min-h-screen bg-black text-green-400 p-10 font-mono">
      <h1 className="text-4xl font-bold mb-8 border-b border-green-500 pb-4">
        SYSTEM STATUS: ONLINE
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div key={agent.name} className="border border-green-800 p-6 rounded hover:bg-green-900/20 transition">
            <h2 className="text-2xl font-bold mb-2">{agent.name}</h2>
            <div className="flex items-center space-x-2 mb-4">
              <span className={`h-3 w-3 rounded-full ${agent.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
              <span className="text-xl">{agent.status}</span>
            </div>
            <p className="text-green-300">Current Task: {agent.task}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-4 border border-gray-700 rounded text-sm text-gray-400">
        <p>Deployment ID: VERCEL-ALPHA-01</p>
        <p>Server Location: Vercel Edge Network</p>
      </div>
    </main>
  );
}