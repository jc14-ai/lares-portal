'use client'

import Downloadables from "@/components/Downloadables";
import NavBar from "@/components/NavBar";
import Timeline from "react-calendar-timeline";
import moment from "moment";
import { use, useEffect, useState } from "react";

type ProjectProps = {
    activity:string;
    actualStart:string;
    actualEnd:string;
    planStart:string;
    planEnd:string;
    owner:string;
    status:string;
}

export default function Page({params}: {params: Promise<{ slug: string }>}) {
    const resolvedParams = use(params);
    const project = decodeURIComponent(resolvedParams.slug);
    const [data, setData] = useState<ProjectProps[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/data");
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    return (
        <section className="flex flex-col items-center bg-white min-h-screen w-screen h-fit pb-8">

            <NavBar />

            <div className="flex flex-col justify-center p-4 rounded-xl border border-gray-100 shadow w-[90%] min-h-30 h-fit mb-4 gap-2 mt-25">

                <p className="text-blue-500 text-[0.8em] lg:text-[0.9em] font-light">
                    PROJECT DASHBOARD
                </p>

                <h1 className="text-blue-800 text-2xl lg:text-3xl font-extrabold">
                    {project}
                </h1>

            </div>

            <div className="flex gap-4 w-[90%] flex-col md:flex-row lg:flex-row">

                <div className="flex flex-col min-w-[70%] w-full">

                    <span className="flex justify-between w-full h-fit py-2 border-b border-gray-200 mb-4">

                        <h1 className="text-black font-bold text-2xl">
                            Project Plan
                        </h1>

                        <p className="border border-blue-200 bg-blue-100 text-blue-700 font-light text-[0.7em] p-2 rounded">
                            Live Preview
                        </p>

                    </span>

                    <div className="bg-white border border-gray-200 h-150 w-full rounded-xl shadow-sm relative overflow-hidden">
                        <Timeline
                            groups={data ? data.map((item) => ({ id: item.activity, title: item.activity })) : []}
                            items={data ? data.map((item, index) => ({id: index, group: index, title: item.activity, start_time: new Date(item.planStart), end_time: new Date(item.planEnd)})) : []}
                            defaultTimeStart={new Date("2024-01-01").getTime()}
                            defaultTimeEnd={new Date("2024-01-02").getTime()}
                        />
                    </div>
                </div>

                <Downloadables />

            </div>
        </section>
    )
}