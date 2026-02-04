'use client'

import { useState } from "react";
import { useRouter } from "next/navigation"

export default function DashboardAccess(){
    const router = useRouter();
    const [hovered, setHovered] = useState(false);

    return (
        <div className="flex justify-between items-center p-4 rounded-xl border border-gray-100 shadow w-[90%] min-h-30 h-fit cursor-pointer hover:border-blue-500 duration-200 mb-4 group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => router.push('/')}>
            <span className="flex items-center gap-2">
                <div className="md:flex lg:flex justify-center items-center bg-blue-100 rounded-full hidden md:h-10 md:w-10 lg:h-15 lg:w-15 group-hover:bg-blue-700 duration-200 p-2">
                    <img className="w-[50%]" src={`${hovered ? '/stat-white.png' : '/stat-blue.png'}`}/>
                </div>
                <span className="flex flex-col gap-2">
                    <h1 className="font-bold text-black text-base md:text-xl lg:text-2xl group-hover:text-blue-700 duration-200">
                        System Dashboard Access
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base lg:text-xl">
                        Click here to access project metrics, view kanban, and manage reports
                    </p>
                </span>
            </span>
            {/* <img src=""/> */}
        </div>
    )
}