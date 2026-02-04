export default function Prioritization(){
    return (
        <div className="flex flex-col rounded-xl border border-gray-100 shadow min-w-full md:min-w-[70%] lg:min-w-[70%] p-4 gap-4 min-h-[600px]">
            <h1 className="text-black font-bold text-base md:text-xl lg:text-2xl">
                Prioritization
            </h1>
            <div className="flex-1 bg-gray-100 rounded border overflow-hidden relative">
             <iframe 
              src="https://docs.google.com/spreadsheets/d/1EqlWUGgIXWLAscIHHaInxLYdcg3AeQpqpaV27qdQhn8/preview?widget=true&headers=false" 
              style={{ 
                transform: 'scale(0.85)',
                transformOrigin: '0 0',
                width: '117.65%',
                height: '117.65%',
                border: 'none'
              }}
              title="Project Prioritization List"
              className="absolute inset-0">
            </iframe>
          </div>
        </div>
    )
}