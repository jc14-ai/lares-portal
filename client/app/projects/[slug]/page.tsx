'use client'

import Downloadables from "@/components/Downloadables";
import NavBar from "@/components/NavBar";
import Timeline, { TimelineHeaders, SidebarHeader, DateHeader, TodayMarker } from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import moment from "moment";
import { use, useEffect, useState } from "react";

type ProjectProps = {
    "activity": string;
    "actualStart": string;
    "actualEnd": string;
    "planStart": string;
    "planEnd": string;
    "owner": string;
    "status": string;
}

const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s?.includes('complete')) return 'bg-emerald-500 hover:bg-emerald-600';
    if (s?.includes('progress') || s?.includes('ongoing')) return 'bg-sky-500 hover:bg-sky-600';
    if (s?.includes('delayed') || s?.includes('late')) return 'bg-rose-500 hover:bg-rose-600';
    if (s?.includes('Not started') || s?.includes('pending')) return 'bg-slate-400 hover:bg-slate-500';
    return 'bg-indigo-500 hover:bg-indigo-600';
};

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const project = decodeURIComponent(resolvedParams.slug);
    const [data, setData] = useState<ProjectProps[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                setData([]);
                const res = await fetch(`/api/data?project=${encodeURIComponent(project)}`);
                const result = await res.json();

                if (result) {
                    setData(result);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [project]);

    const filteredData = data.filter(item => item["planStart"] && item["planEnd"]);

    const groups = filteredData.map((item, index) => ({
        id: index,
        title: (
            <div className="flex w-full items-center text-[0.7em] font-semibold py-2">
                <div className="flex-1 truncate pr-3 text-black font-bold uppercase tracking-tight">{item["activity"]}</div>
                <div className="flex flex-wrap items-center justify-center w-[150px] text-black border-l border-gray-100 gap-1.5 px-2">
                    {item["owner"]?.split('/').map((owner, idx) => (
                        <span key={idx} className="whitespace-nowrap px-2 py-0.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-[0.85em] leading-tight font-medium">
                            {owner.trim()}
                        </span>
                    ))}
                </div>
            </div>
        ),
        owner: item["owner"]
    }));

    const items = filteredData.map((item, index) => ({
        id: index,
        group: index,
        title: item["activity"],
        owner: item["owner"],
        status: item["status"],
        start_time: moment(item["planStart"], "M/D").valueOf(),
        end_time: moment(item["planEnd"], "M/D").add(1, 'day').valueOf(),
        canMove: false,
        canResize: false,
    }));

    return (
        <section className="flex flex-col items-center bg-gray-50 min-h-screen w-screen h-fit pb-12">

            <NavBar />

            <div className="flex flex-col justify-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm w-[90%] min-h-32 h-fit mb-6 gap-2 mt-28">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    <p className="text-blue-600 text-[0.75em] lg:text-[0.85em] font-bold tracking-wider uppercase">
                        Project Dashboard
                    </p>
                </div>

                <h1 className="text-blue-900 text-3xl lg:text-4xl font-black">
                    {project}
                </h1>
            </div>

            <div className="flex gap-6 w-[90%] flex-col xl:flex-row">
                <div className="flex flex-col min-w-[70%] w-full">
                    <div className="flex justify-between items-end w-full h-fit pb-4 mb-4">
                        <div>
                            <h1 className="text-gray-900 font-extrabold text-2xl mb-1">
                                Project Workplan
                            </h1>
                            <p className="text-gray-500 text-sm font-medium">Timeline visualization of project milestones and activities</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex gap-2">
                                {['Completed', 'Ongoing', 'Delayed', 'Not Started'].map(s => (
                                    <div key={s} className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${getStatusColor(s).split(' ')[0]}`}></span>
                                        <span className="text-[0.65em] font-semibold text-gray-500 uppercase tracking-tight">{s}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="border border-blue-200 bg-blue-50 text-blue-700 font-bold text-[0.7em] px-3 py-1.5 rounded-full shadow-sm">
                                Live Preview
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                        {filteredData.length > 0 ? (
                            <Timeline
                                groups={groups}
                                items={items}
                                defaultTimeStart={moment().startOf('month').valueOf()}
                                defaultTimeEnd={moment().endOf('month').valueOf()}
                                stackItems
                                lineHeight={60}
                                itemHeightRatio={0.7}
                                canMove={false}
                                canResize={false}
                                sidebarWidth={350}
                                className="custom-timeline"
                                itemRenderer={({ item, getItemProps }) => {
                                    const statusColor = getStatusColor(item.status);
                                    const { key, ...rest } = getItemProps({
                                        className: `${statusColor} transition-all duration-200 rounded-lg flex items-center px-3 shadow-sm border border-white/20`,
                                        style: {
                                            borderRadius: '8px',
                                        }
                                    });
                                    return (
                                        <div
                                            key={key}
                                            {...rest}
                                            title={`${item.title}\n${moment(item.start_time).format('MMM D')} - ${moment(item.end_time).format('MMM D, YYYY')} (${moment(item.end_time).diff(moment(item.start_time), 'days')} ${moment(item.end_time).diff(moment(item.start_time), 'days') === 1 ? 'day' : 'days'})`}
                                        >
                                            <div className="flex flex-col justify-center overflow-hidden w-full">
                                                <span className="text-white text-[0.75rem] font-bold truncate leading-tight">
                                                    {item.title}
                                                </span>
                                                <span className="text-white/80 text-[0.6rem] font-medium uppercase tracking-tighter truncate">
                                                    {item.status || 'Planned'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }}
                            >
                                <TimelineHeaders className="bg-gray-50 border-b border-gray-200 sticky top-0 z-20">
                                    <SidebarHeader>
                                        {({ getRootProps }) => (
                                            <div {...getRootProps()} className="flex items-center bg-gray-50 text-gray-500 font-bold text-[0.7em] uppercase tracking-wider border-r border-gray-200">
                                                <div className="flex-1 px-4 py-3 border-r border-gray-200 text-black text-center">Activities</div>
                                                <div className="w-[150px] px-4 py-3 text-black text-center">Owner</div>
                                            </div>
                                        )}
                                    </SidebarHeader>
                                    <DateHeader unit="month" labelFormat={(interval) => interval[0].format("MMMM YYYY")} className="bg-gray-50 font-bold" />
                                    <DateHeader unit="week" labelFormat={(interval) => `Week ${Math.ceil((interval[0].date() + 7) / 7)}`} className="bg-gray-50 font-bold text-xs" />
                                    <TodayMarker />
                                </TimelineHeaders>
                            </Timeline>
                        ) : (
                            <div className="flex flex-col justify-center items-center h-[600px] w-full bg-gray-50/50 space-y-4">
                                <div className="p-4 bg-white rounded-full shadow-inner">
                                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h1 className="text-gray-400 font-medium text-xl">Work plan not available for this project.</h1>
                            </div>
                        )}
                    </div>
                </div>
                <Downloadables />
            </div>
        </section>
    )
}