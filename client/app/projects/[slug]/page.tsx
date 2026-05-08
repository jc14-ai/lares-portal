import Downloadables from "@/components/Downloadables";
import NavBar from "@/components/NavBar";

export default async function Page({params}: {params: Promise<{slug: string}>}) {
    const resolvedParams = await params;
    const project = decodeURIComponent(resolvedParams.slug);
    return (
        <section className="flex flex-col items-center bg-white min-h-screen w-screen h-fit pb-8">
            <NavBar/>
            <div className="flex flex-col justify-center p-4 rounded-xl border border-gray-100 shadow w-[90%] min-h-30 h-fit mb-4 gap-2 mt-25">
                <p className="text-blue-500 text-[0.8em] lg:text-[0.9em] font-light">PROJECT DASHBOARD</p>
                <h1 className="text-blue-800 text-2xl lg:text-3xl font-extrabold">{project}</h1>
            </div>
            <div className="flex gap-4 w-[90%] flex-col md:flex-row lg:flex-row">
                <div className="flex flex-col min-w-[70%] w-full">
                    <span className="flex justify-between w-full h-fit py-2 border-b border-gray-200 mb-4">
                        <h1 className="text-black font-bold text-2xl">Project Plan</h1>
                        <p className="border border-blue-200 bg-blue-100 text-blue-700 font-light text-[0.7em] p-2 rounded">Live Preview</p>
                    </span>
                    <div className="bg-white border border-gray-200 h-150 w-full rounded-xl shadow-sm relative overflow-hidden">
                        <iframe
                        src="https://docs.google.com/spreadsheets/d/1FSY9iphvfd4OixE8NpnH7_Zi-W62Sxo0CJPibWgUCww/edit?gid=0#gid=0" // TODO: put the source for the google spreadsheet 
                        style={{width:'100%', height:'100%', border:'none'}}
                        title="Project Plan"
                        />
                    </div>
                </div>
                <Downloadables/>
            </div>
        </section>
    )
}