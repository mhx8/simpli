import { NextResponse } from 'next/server';
import { saveLead } from '@/lib/azureTable';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await saveLead(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving lead:", error);
    return NextResponse.json({ success: false, error: "Failed to save lead" }, { status: 500 });
  }
}