import { NextResponse } from 'next/server';

// THE SHARED STATE
let missionStatus = {
  coderabbit: "✅ No PRs detected",
  kestra: "💤 Waiting for CodeRabbit...",
  cline: "💤 Standby",
  oumi: "💤 Idle",
  last_log: "System initialized."
};

// GET: Dashboard reads this
export async function GET() {
  return NextResponse.json(missionStatus);
}

// POST: Agents update this
export async function POST(request: Request) {
  const body = await request.json();
  missionStatus = { ...missionStatus, ...body };
  return NextResponse.json({ success: true });
}