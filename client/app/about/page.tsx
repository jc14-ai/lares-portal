'use client'

import NavBar from "@/components/NavBar"

export default function page() {
    return (
        <main className="bg-white w-screen min-h-screen h-fit flex flex-col justify-center items-center">
            <NavBar/>
            <h1 className="text-gray-500 font-bold text-2xl">About Us</h1>
        </main>
    )
}