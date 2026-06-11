import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const project = searchParams.get("project") || "";

    console.log(project);
    await fetch(`${process.env.FLASK_PUBLIC_API_URL}`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({project:project})
    });

    const res = await fetch(`${process.env.FLASK_PUBLIC_API_URL}/data`);
    if (!res.ok) {
        return NextResponse.json([]);
    }
    const data = await res.json();

    return NextResponse.json(data);
}