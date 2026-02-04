export default function Downloadables() {
    const documents = [
        'SDCA',
        'DC/DM',
        'Meeting Notes',
        'RTMIA',
        'SI/RN',
        'SEDO',
        'UATC',
        'PSGP'
    ];
    return (
        <div className="flex flex-col rounded-xl border border-gray-100 shadow w-full p-4 gap-4 h-fit">
            <h1 className="text-black font-bold text-base md:text-xl lg:text-2xl">
                Downloadable Documents
            </h1>
            <select className="p-4 border-2 border-blue-500 rounded-xl font-bold text-blue-500 hover:bg-gray-100 duration-200 cursor-pointer">
                <option value="" className="text-black font-light">2025 Documents</option>
                {documents.map(doc => (
                    <option key={doc} className="text-black font-light" value={doc.toLowerCase().replace(/ /g, '_')}>{doc}</option>
                ))}
            </select>
            <p className="text-[0.8em] text-gray-400 md:text-[1em] lg:text-[1em] italic">
                Select a document type from the dropdown above to begin download.
            </p>
        </div>
    )
}