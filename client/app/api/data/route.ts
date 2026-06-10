import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const project = searchParams.get("project") || "";

    console.log(project);
    await fetch(`http://127.0.0.1:5001`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({project:project})
    });

    const res = await fetch("http://127.0.0.1:5001/data");
    if (!res.ok) {
        return NextResponse.json([]);
    }
    const data = await res.json();

    return NextResponse.json(data);
}