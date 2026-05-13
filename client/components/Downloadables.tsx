'use client'

import { ChangeEvent } from "react"

export default function Downloadables() {
    const documents = [
        {
            '2024_link': 'https://drive.google.com/drive/u/0/folders/1VGRCFjUYXQn_RlAKg33Fad0FGFUI7JAE',
            '2025_link': 'https://drive.google.com/drive/u/2/folders/174Vsdd6r-2vR_k-72PVmXIIqeZrOZ8v1',
            document: 'SDCA'
        },
        {
            '2024_link': 'https://drive.google.com/drive/folders/1nfJHkjzJMfR6H8Qfcq5LNExmigOfkUsP',
            '2025_link': 'https://drive.google.com/drive/u/2/folders/1GNmNpk-0PeniNoeXCdvUvI1_1R2hvwLE',
            document: 'DC/DM'
        },
        {
            '2024_link': 'https://drive.google.com/drive/u/2/folders/10CQ4tgpfIBv_XMvkchOsjtQePL4BZ_ty',
            '2025_link': 'https://drive.google.com/drive/u/2/folders/1J6QlkaO_6myVZhDgibJQMYjpi_A1m9cT',
            document: 'Meeting Notes'
        },
        {
            '2024_link': 'https://drive.google.com/drive/u/2/folders/1v-jmBIckTOvhuR2OWwaaEMffTIZa5CQH',
            '2025_link': 'https://drive.google.com/drive/u/2/folders/1tOnxfaEfHWUwEgBnItJtZulCZylWhaiO',
            document: 'RTMIA'
        },
        {
            '2024_link': 'https://drive.google.com/drive/u/2/folders/1K6PLdyysNk5STHm4OlzM4aF6JoGFL62y',
            '2025_link': 'https://drive.google.com/drive/u/2/folders/16wAXzIC1DR-y3LTfC5Si1AtyBiVV3MBz',
            document: 'SI/RN'
        },
        {
            '2024_link': 'https://drive.google.com/drive/u/2/folders/1Rrhb3xLJcNZImzXKpxC9E69b-UejKHMs',
            '2025_link': 'https://drive.google.com/drive/u/2/folders/1qsN98kx4N0At1CaJXbLsWbwyu90OTveh',
            document: 'SEDO'
        },
        {
            '2024_link': 'https://drive.google.com/drive/u/2/folders/1jcv7xes759L55xWAE4sXyWqLoao7AHSk',
            '2025_link': 'https://drive.google.com/drive/u/2/folders/1-rfdVyxdcEe-sCJopj89PM2j5Q4h5Yhc',
            document: 'UATC'
        },
        {
            '2024_link': 'https://drive.google.com/drive/u/2/folders/1tQQ4oFNJVKL0qj7jzNRCKvTT85RGh7hD',
            '2025_link': 'https://drive.google.com/drive/u/2/folders/12zg7H_ssKr3NVtLwKPT107EvLlp2n33Q',
            document: 'PSGP'
        }
    ]

    const directLink = (url: ChangeEvent<HTMLSelectElement>) => {
        const link = url.target.value;
        if (link) {
            window.open(link, '_blank');
        }
    }

    return (
        <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-xl w-full p-6 gap-6 h-fit sticky top-28">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h1 className="text-gray-900 font-extrabold text-xl">
                    Resources
                </h1>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[0.65em] font-black text-gray-400 uppercase tracking-widest px-1">Fiscal Year 2024</label>
                    <select
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 hover:border-blue-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200 cursor-pointer appearance-none"
                        onChange={directLink}
                    >
                        <option value="" className="text-gray-500">Choose document</option>
                        {documents.map(doc => (
                            <option key={doc.document} value={doc["2024_link"]}>
                                {doc.document}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[0.65em] font-black text-gray-400 uppercase tracking-widest px-1">Fiscal Year 2025</label>
                    <select
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 hover:border-blue-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200 cursor-pointer appearance-none"
                        onChange={directLink}
                    >
                        <option value="" className="text-gray-500">Choose document</option>
                        {documents.map(doc => (
                            <option key={doc.document} value={doc["2025_link"]}>
                                {doc.document}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-[0.75em] text-amber-800 font-medium leading-relaxed">
                    <span className="font-bold">Pro Tip:</span> Select a document from the dropdowns above to open its Google Drive location.
                </p>
            </div>
        </div>
    )
}