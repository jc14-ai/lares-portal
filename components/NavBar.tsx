'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
type ButtonProps = {
    name:string;
    redirect?:string;
    type?: 'dropdown' | 'button';
    projects?: string[];
}

export default function NavBar(){
    const router = useRouter();
    const buttons:ButtonProps[] = [
        {
            name: 'Home',
            type: 'button',
            redirect: '/'
        },
        {
            name: 'PHILARIS-CO',
            type:'dropdown',
            projects: ['MUT 2.2','PCO 9.10.0','RCOCD', 'CLRP LOGO']
        },
        {
            name: 'PHILARIS-RD',
            type:'dropdown',
            projects: ['PRD 47.1.0', 'PRD 47.3.0']
        },
        {
            name: 'PORTALS',
            type:'dropdown',
            projects: ['eSerbisyo Portal','CLRP']
        },
        {
            name: 'OSS PROJECTS',
            type:'dropdown',
            projects: ['FMIS','HRMS','LIS','EIS','PRMS']
        },
        {
            name: 'Others',
            type:'dropdown',
            projects: ['NIS','Expediente AI Tools','Mapping System']
        },
        {
            name: 'About Us',
            type: 'button',
            redirect: '/about'
        },
    ];

    const [projectHovered, setProjectHovered] = useState<string>("");

    return (
        <nav className="flex fixed items-center bg-blue-900 w-screen min-h-[50px] h-fit p-4 z-2 top-0">
            <h1 className="flex justify-center items-center font-bold text-white text-xl min-w-[240px]">LRA-LARES</h1>
            {buttons.map(button => (
                button.type === 'button' ? 
                <button key={button.name} className={"ml-4 text-white rounded hover:bg-blue-800 p-2 min-w-fit duration-200 cursor-pointer font-bold"} 
                onClick={() => {
                    if(button.redirect) router.push(button.redirect);
                }}>
                    {button.name}
                </button>
                : 
                <button key={button.name} className="ml-4 text-white rounded hover:bg-blue-800 p-2 min-w-fit duration-200 cursor-pointer font-bold" 
                onMouseEnter={() => {
                    setProjectHovered(button.name);
                }}
                onMouseLeave={() => {
                    setProjectHovered("");
                }}>
                    {button.name}
                    {button.projects  && button.name === projectHovered ? 
                    <div className="absolute bg-white border border-gray-200 min-w-[200px] w-fit h-fit rounded mt-2">
                        {button.projects.map(proj => (
                            <p key={proj} className="flex text-black p-3 hover:bg-gray-100 hover:text-blue-800 duration-200 cursor-pointer font-bold text-[0.9em]"
                            onClick={() => router.push(`/projects/${proj.toLowerCase().replace(/\s+/g, '-').replace(/\./g,'-')}`)}>
                                {proj}
                            </p>
                        ))}
                    </div> 
                    : 
                    null
                    }
                </button>
            ))}
        </nav>
    )
}