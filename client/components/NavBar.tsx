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
        <nav className="flex flex-wrap items-center bg-blue-900/90 backdrop-blur-md w-full min-h-16 h-fit px-8 py-3 z-[100] fixed top-0 left-0 border-b border-white/10 shadow-lg">
            <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
                <h1 className="font-black text-white text-2xl tracking-tighter uppercase">LRA-LARES</h1>
            </div>
            
            <div className="md:hidden ml-auto">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="text-white hover:text-blue-200 transition-colors p-2 rounded-lg bg-white/5"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            <div className={`${isMenuOpen ? "flex" : "hidden"} w-full md:flex md:w-auto flex-col md:flex-row md:items-center mt-4 md:mt-0 ml-auto gap-1`}>
                {buttons.map(button => (
                    button.type === 'button' ? 
                    <button key={button.name} className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-bold text-sm text-left md:text-center mt-1 md:mt-0" 
                    onClick={() => {
                        if(button.redirect) router.push(button.redirect);
                        setIsMenuOpen(false);
                    }}>
                        {button.name}
                    </button>
                    : 
                    <div key={button.name} className="relative mt-1 md:mt-0"
                    onMouseEnter={() => setProjectHovered(button.name)}
                    onMouseLeave={() => setProjectHovered("")}>
                        <button className={`w-full px-4 py-2 rounded-xl transition-all duration-300 font-bold text-sm text-left md:text-center flex items-center justify-between gap-1 ${projectHovered === button.name ? 'bg-white/15 text-white' : 'text-white/90 hover:text-white hover:bg-white/10'}`} 
                        onClick={() => setProjectHovered(projectHovered === button.name ? "" : button.name)}>
                            <span>{button.name}</span>
                            <svg className={`w-4 h-4 transition-transform duration-300 ${projectHovered === button.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        
                        {button.projects && button.name === projectHovered && (
                            <div className="md:absolute static bg-white border border-gray-100 min-w-[240px] w-full h-fit rounded-2xl md:right-0 shadow-2xl z-[110] flex flex-col p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-3 py-2 mb-1">
                                    <p className="text-[0.65em] font-black text-gray-400 uppercase tracking-widest">{button.name} Sub-Projects</p>
                                </div>
                                {button.projects.map(proj => (
                                    <button key={proj} className="w-full text-gray-700 px-3 py-2.5 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-200 font-bold text-sm text-left flex items-center justify-between group"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/projects/${encodeURIComponent(proj)}`);
                                        setIsMenuOpen(false);
                                        setProjectHovered("");
                                    }}>
                                        <span>{proj}</span>
                                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                ))}
                            </div> 
                        )}
                    </div>
                ))}
            </div>
        </nav>
    )
}