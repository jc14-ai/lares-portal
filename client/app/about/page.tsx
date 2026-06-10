import NavBar from "@/components/NavBar";

export default function AboutPage() {
    return (
        <section className="flex flex-col items-center bg-gray-50 min-h-screen w-screen pb-20">
            <NavBar />

            {/* Hero Section */}
            <div className="flex flex-col justify-center px-8 py-16 rounded-b-[3rem] bg-blue-900 shadow-2xl w-full h-fit mt-20 text-center items-center">
                <div className="flex items-center gap-2 mb-4 bg-blue-800/50 px-4 py-1.5 rounded-full backdrop-blur-sm border border-blue-700">
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                    <p className="text-blue-200 text-xs font-bold tracking-widest uppercase">
                        About Our Company
                    </p>
                </div>
                <h1 className="text-white text-4xl lg:text-6xl font-black max-w-4xl leading-tight">
                    Land Registration Systems, Inc.
                </h1>
                <p className="text-blue-100 mt-6 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed opacity-90">
                    Empowering the Philippines through world-class infrastructure and innovative digital solutions.
                </p>
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-12 w-[90%] max-w-6xl -mt-10">
                
                {/* Core Narrative Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-blue-900 text-3xl font-extrabold leading-tight">
                                Our Roots & Global Heritage
                            </h2>
                            <div className="w-20 h-1.5 bg-blue-500 rounded-full"></div>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                <span className="font-bold text-gray-900">Land Registration Systems, Inc. (LARES)</span> is a subsidiary of 
                                <span className="text-blue-700 font-semibold"> IL&FS Technologies India</span>, 
                                part of the <span className="font-bold">IL&FS Group</span>—one of the largest infrastructure and finance conglomerates in India.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                IL&FS stands as a pioneer in India's leading infrastructure development, focusing on commercialization and the creation of value-added financial services that drive national growth.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-blue-100 rounded-3xl transform rotate-3 scale-95 opacity-50"></div>
                            <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl shadow-lg text-white">
                                <h3 className="text-xl font-bold mb-4">Strategic Focus</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-blue-400 rounded-full p-1">
                                            <svg className="w-3 h-3 text-blue-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        </div>
                                        <span>Infrastructure Project Development</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-blue-400 rounded-full p-1">
                                            <svg className="w-3 h-3 text-blue-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        </div>
                                        <span>Commercialization of Key Assets</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-blue-400 rounded-full p-1">
                                            <svg className="w-3 h-3 text-blue-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        </div>
                                        <span>Value-Added Financial Services</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission Card */}
                <div className="relative overflow-hidden bg-blue-900 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h2 className="text-blue-400 font-black text-2xl uppercase tracking-widest mb-4">
                            The LARES Mission in the Philippines
                        </h2>
                        <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-8">
                            LARES was established specifically to implement the nationwide <span className="text-blue-300">Land Titling Computerization Project (LTCP)</span> for the Land Registration Authority (LRA).
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-blue-800/50 border border-blue-700 px-6 py-4 rounded-xl">
                                <p className="text-blue-300 text-sm font-bold uppercase mb-1">Project Partner</p>
                                <p className="text-xl font-bold">Land Registration Authority</p>
                            </div>
                            <div className="bg-blue-800/50 border border-blue-700 px-6 py-4 rounded-xl">
                                <p className="text-blue-300 text-sm font-bold uppercase mb-1">Primary Objective</p>
                                <p className="text-xl font-bold">Nationwide Computerization</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values/Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Infrastructure", desc: "Global leaders in conglomerate scale developments.", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
                        { title: "Governance", desc: "Rigorous financial services and value creation.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                        { title: "Technology", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", desc: "Pioneering the digitalization of public land records." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-500 font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}