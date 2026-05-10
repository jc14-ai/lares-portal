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
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <nav className="flex flex-wrap items-center bg-blue-900 w-full min-h-12.5 h-fit p-4 z-100 fixed top-0 left-0">
            <h1 className="flex justify-center items-center font-bold text-white text-xl md:min-w-60 min-w-fit">LRA-LARES</h1>
            
            <div className="md:hidden ml-auto">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="text-white hover:text-gray-300 focus:outline-none p-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            <div className={`${isMenuOpen ? "flex" : "hidden"} w-full md:flex md:w-auto flex-col md:flex-row md:items-center mt-4 md:mt-0`}>
                {buttons.map(button => (
                    button.type === 'button' ? 
                    <button key={button.name} className={"md:ml-4 text-white rounded hover:bg-blue-800 p-2 min-w-fit duration-200 cursor-pointer font-bold text-left md:text-center mt-2 md:mt-0"} 
                    onClick={() => {
                        if(button.redirect) router.push(button.redirect);
                        setIsMenuOpen(false);
                    }}>
                        {button.name}
                    </button>
                    : 
                    <div key={button.name} className="md:ml-4 relative mt-2 md:mt-0"
                    onMouseEnter={() => {
                        setProjectHovered(button.name);
                    }}
                    onMouseLeave={() => {
                        setProjectHovered("");
                    }}>
                        <button className="w-full text-white rounded hover:bg-blue-800 p-2 min-w-fit duration-200 cursor-pointer font-bold text-left md:text-center flex items-center justify-between md:inline-block" 
                        onClick={() => {
                            if (projectHovered === button.name) {
                                setProjectHovered("");
                            } else {
                                setProjectHovered(button.name);
                            }
                        }}>
                            <span>{button.name}</span>
                            <svg className="w-4 h-4 ml-1 md:hidden inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {button.projects  && button.name === projectHovered ? 
                        <div className="md:absolute static bg-white border border-gray-200 min-w-50 w-full md:w-max h-fit rounded md:left-0 shadow-lg z-50 flex flex-col items-start overflow-hidden">
                            {button.projects.map(proj => (
                                <p key={proj} className="w-full text-black p-3 hover:bg-gray-100 hover:text-blue-800 duration-200 cursor-pointer font-bold text-[0.9em] text-left"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/projects/${encodeURIComponent(proj)}`);
                                    setIsMenuOpen(false);
                                    setProjectHovered("");
                                }}>
                                    {proj}
                                </p>
                            ))}
                        </div> 
                        : 
                        null
                        }
                    </div>
                ))}
            </div>
        </nav>
    )
}