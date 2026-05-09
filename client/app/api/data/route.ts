import { NextResponse } from "next/server";

export async function GET(){
    await fetch("http://localhost:5001");

    const res = await fetch("http://localhost:5001/data");
    const data = await res.json();

    return NextResponse.json({data:data});
}