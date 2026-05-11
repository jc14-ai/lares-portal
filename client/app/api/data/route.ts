import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const project = searchParams.get("project") || "";

    console.log(project);
    await fetch(`http://localhost:5001`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({project:project})
    });

    const res = await fetch("http://localhost:5001/data");
    const data = await res.json();

    return NextResponse.json(data);
}