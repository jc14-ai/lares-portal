'use client'

import { ChangeEvent } from "react"

export default function Downloadables() {
    const documents = [
        { 
            '2024_link':'https://drive.google.com/drive/u/0/folders/1VGRCFjUYXQn_RlAKg33Fad0FGFUI7JAE' , 
            '2025_link':'https://drive.google.com/drive/u/2/folders/174Vsdd6r-2vR_k-72PVmXIIqeZrOZ8v1' , 
            document: 'SDCA' 
        },
        { 
            '2024_link':'https://drive.google.com/drive/folders/1nfJHkjzJMfR6H8Qfcq5LNExmigOfkUsP' , 
            '2025_link':'https://drive.google.com/drive/u/2/folders/1GNmNpk-0PeniNoeXCdvUvI1_1R2hvwLE' , 
            document: 'DC/DM' 
        },
        { 
            '2024_link':'https://drive.google.com/drive/u/2/folders/10CQ4tgpfIBv_XMvkchOsjtQePL4BZ_ty' , 
            '2025_link':'https://drive.google.com/drive/u/2/folders/1J6QlkaO_6myVZhDgibJQMYjpi_A1m9cT' , 
            document: 'Meeting Notes' 
        },
        { 
            '2024_link':'https://drive.google.com/drive/u/2/folders/1v-jmBIckTOvhuR2OWwaaEMffTIZa5CQH' , 
            '2025_link':'https://drive.google.com/drive/u/2/folders/1tOnxfaEfHWUwEgBnItJtZulCZylWhaiO' , 
            document: 'RTMIA' 
        },
        { 
            '2024_link':'https://drive.google.com/drive/u/2/folders/1K6PLdyysNk5STHm4OlzM4aF6JoGFL62y' , 
            '2025_link':'https://drive.google.com/drive/u/2/folders/16wAXzIC1DR-y3LTfC5Si1AtyBiVV3MBz' , 
            document: 'SI/RN' 
        },
        { 
            '2024_link':'https://drive.google.com/drive/u/2/folders/1Rrhb3xLJcNZImzXKpxC9E69b-UejKHMs' , 
            '2025_link':'https://drive.google.com/drive/u/2/folders/1qsN98kx4N0At1CaJXbLsWbwyu90OTveh' , 
            document: 'SEDO' 
        },
        { 
            '2024_link':'https://drive.google.com/drive/u/2/folders/1jcv7xes759L55xWAE4sXyWqLoao7AHSk' , 
            '2025_link':'https://drive.google.com/drive/u/2/folders/1-rfdVyxdcEe-sCJopj89PM2j5Q4h5Yhc' , 
            document: 'UATC' 
        },
        { 
            '2024_link':'https://drive.google.com/drive/u/2/folders/1tQQ4oFNJVKL0qj7jzNRCKvTT85RGh7hD' , 
            '2025_link':'https://drive.google.com/drive/u/2/folders/12zg7H_ssKr3NVtLwKPT107EvLlp2n33Q' , 
            document: 'PSGP' 
        }
    ]

    const directLink = (url:ChangeEvent<HTMLSelectElement>) => {
        const link = url.target.value;

        if(link){
            window.open(link, '_blank');
        }
    }
 
    return (
        <div className="flex flex-col rounded-xl border border-gray-100 shadow w-full p-4 gap-4 h-fit">
            <h1 className="text-black font-bold text-base md:text-xl lg:text-2xl">
                Downloadable Documents
            </h1>
            <select className="p-4 border-2 border-blue-500 rounded-xl font-bold text-blue-500 hover:bg-gray-100 duration-200 cursor-pointer"
            onChange={directLink}>
                <option value="" className="text-black font-light">2024 Documents</option>
                {documents.map(doc => (
                    <option key={doc.document} className="text-black font-light" value={doc["2024_link"]}>
                        {doc.document}
                    </option>
                ))}
            </select>
            <select className="p-4 border-2 border-blue-500 rounded-xl font-bold text-blue-500 hover:bg-gray-100 duration-200 cursor-pointer"
            onChange={directLink}>
                <option value="" className="text-black font-light">2025 Documents</option>
                {documents.map(doc => (
                    <option key={doc.document} className="text-black font-light" value={doc["2025_link"]}>
                        {doc.document}
                    </option>
                ))}
            </select>
            <p className="text-[0.8em] text-gray-400 md:text-[1em] lg:text-[1em] italic">
                Select a document type from the dropdown above to begin download.
            </p>
        </div>
    )
}