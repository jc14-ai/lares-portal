import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch(`${process.env.FLASK_PUBLIC_API_URL}/api/leaves`);
        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch leave data" }, { status: 500 });
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
