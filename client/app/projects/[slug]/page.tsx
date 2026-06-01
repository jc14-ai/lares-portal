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
    "status": "Completed" | "In progress" | "Not started";
}



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
            <div className="flex w-full items-stretch text-[0.75em] md:text-[1.1em] font-semibold h-full border-b border-gray-50">
                <div className="flex-1 px-4 py-2 text-black font-bold uppercase tracking-tight border-r border-gray-200 h-full flex items-center leading-snug whitespace-normal line-clamp-2">
                    {item["activity"]}
                </div>
                <div className="flex flex-wrap items-center justify-center w-[150px] text-black gap-1.5 px-2 border-r border-gray-200 h-full">
                    {item["owner"]?.split('/').map((owner, idx) => (
                        <span key={idx} className="whitespace-nowrap px-2 py-0.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-[0.8em] md:text-[1.2em] leading-tight font-medium">
                            {owner.trim()}
                        </span>
                    ))}
                </div>
                <div className="w-[100px] flex items-center justify-center px-2 h-full">
                    {(() => {
                        if (!item["planEnd"]) return <span className="text-gray-300">-</span>;
                        const pEnd = moment(item["planEnd"], "M/D");
                        const aEnd = item["actualEnd"] ? moment(item["actualEnd"], "M/D") : moment();
                        const diff = aEnd.diff(pEnd, 'days');

                        if (diff > 0) return <span className="text-rose-600 font-bold">{diff}d</span>;
                        if (diff < 0 && item['status'] === 'Not started') return <span className="text-gray-600 font-bold text-[0.8em] md:text-[1.2em]">N/A</span>;
                        return <span className="text-emerald-600 font-bold">0d</span>;
                    })()}
                </div>
            </div>
        ),
        owner: item["owner"]
    }));

    const items = filteredData.flatMap((item, index) => {
        const planItem = {
            id: `${index}-plan`,
            group: index,
            title: `${item["activity"]} (Plan)`,
            owner: item["owner"],
            status: item['status'],
            start_time: moment(item["planStart"], "M/D").valueOf(),
            end_time: moment(item["planEnd"], "M/D").add(1, 'day').valueOf(),
            canMove: false,
            canResize: false,
            isPlan: true,
            planEnd: item["planEnd"]
        };

        const result = [planItem];

        if (item["actualStart"] && item["actualEnd"]) {
            result.push({
                id: `${index}-actual`,
                group: index,
                title: `${item["activity"]} (Actual)`,
                owner: item["owner"],
                status: item["status"],
                start_time: moment(item["actualStart"], "M/D").valueOf(),
                end_time: moment(item["actualEnd"], "M/D").add(1, 'day').valueOf(),
                canMove: false,
                canResize: false,
                isPlan: false,
                planEnd: item["planEnd"]
            });
        }

        return result;
    });

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
                <div className="flex flex-col min-w-[80%] w-full">
                    <div className="flex justify-between items-end w-full h-fit pb-4 mb-4">
                        <div>
                            <h1 className="text-gray-900 font-extrabold text-2xl md:text-3xl mb-1">
                                Project Workplan
                            </h1>
                            <p className="text-gray-500 text-sm md:text-lg font-medium">Timeline visualization of project milestones and activities</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="border border-blue-200 bg-blue-50 text-blue-700 font-bold text-[0.7em] md:text-[1.05em] px-3 py-1.5 rounded-full shadow-sm">
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
                                sidebarWidth={450}
                                className="custom-timeline"
                                itemRenderer={({ item, getItemProps }) => {
                                    let background = '';
                                    if (item.status === 'Not started') {
                                        background = '#94a3b8'; // slate-400
                                    } else if (item.isPlan) {
                                        background = '#10b981'; // emerald-500
                                    } else {
                                        const startMs = item.start_time;
                                        const endMs = item.end_time;
                                        const totalMs = endMs - startMs;
                                        const planEndMs = moment(item.planEnd, "M/D").valueOf();
                                        const dayMs = 24 * 60 * 60 * 1000;
                                        
                                        if (totalMs <= 0) {
                                            background = '#3b82f6';
                                        } else {
                                            const getPct = (time) => Math.max(0, Math.min(100, ((time - startMs) / totalMs) * 100));
                                            let stops = [];
                                            let pBaseEnd = getPct(planEndMs);
                                            if (pBaseEnd > 0) {
                                                stops.push(`#3b82f6 0%`, `#3b82f6 ${pBaseEnd}%`);
                                            }
                                            let pYellowEnd = getPct(planEndMs + dayMs);
                                            if (pYellowEnd > pBaseEnd) {
                                                stops.push(`#eab308 ${pBaseEnd}%`, `#eab308 ${pYellowEnd}%`);
                                            }
                                            let pOrangeEnd = getPct(planEndMs + 3 * dayMs);
                                            if (pOrangeEnd > pYellowEnd) {
                                                stops.push(`#f97316 ${pYellowEnd}%`, `#f97316 ${pOrangeEnd}%`);
                                            }
                                            if (100 > pOrangeEnd) {
                                                stops.push(`#ef4444 ${pOrangeEnd}%`, `#ef4444 100%`);
                                            }
                                            if (stops.length === 0) background = '#3b82f6';
                                            else background = `linear-gradient(to right, ${stops.join(', ')})`;
                                        }
                                    }

                                    const { key, style, ...rest } = getItemProps({
                                        className: `transition-all duration-200 rounded-sm flex items-center shadow-sm border border-white/20 group !overflow-visible`,
                                    });
                                    return (
                                        <div
                                            key={key}
                                            {...rest}
                                            style={{ ...style, background }}
                                            title={`${item.title}\n${moment(item.start_time).format('MMM D')} - ${moment(item.end_time).format('MMM D, YYYY')} (${moment(item.end_time).diff(moment(item.start_time), 'days')} ${moment(item.end_time).diff(moment(item.start_time), 'days') === 1 ? 'day' : 'days'})`}
                                        >
                                            <div className="relative w-full h-full pointer-events-none">
                                                <span className="absolute flex items-center justify-center h-[30px] right-[calc(100%+6px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[0.55rem] font-bold text-white whitespace-nowrap bg-slate-900/90 px-1.5 py-0.5 rounded border border-gray-200 shadow-sm z-50">
                                                    {moment(item.start_time).format('MMM D')}
                                                </span>
                                                <span className="absolute flex items-center justify-center h-[30px] left-[calc(100%+6px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[0.55rem] font-bold text-white whitespace-nowrap bg-slate-900/90 px-1.5 py-0.5 rounded border border-gray-200 shadow-sm z-50">
                                                    {moment(item.end_time).clone().format('MMM D')}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }}
                            >
                                <TimelineHeaders className="bg-slate-900 border-b border-slate-700 sticky top-0 z-20">
                                    <SidebarHeader>
                                        {({ getRootProps }) => (
                                            <div {...getRootProps()} className="flex items-center bg-slate-900 text-white font-bold text-[0.7em] md:text-[1.05em] uppercase tracking-wider border-r border-slate-700">
                                                <div className="flex-1 px-4 py-3 text-center">Activities</div>
                                                <div className="w-[150px] px-4 py-3 text-center">Owner</div>
                                                <div className="w-[100px] px-4 py-3 text-center">Delay</div>
                                            </div>
                                        )}
                                    </SidebarHeader>
                                    <DateHeader unit="month" labelFormat={(interval) => interval[0].format("MMMM YYYY")} className="font-bold md:text-lg" />
                                    <DateHeader unit="week" labelFormat={(interval) => interval[0].format("MMM D")} className="font-bold text-xs md:text-sm" />
                                    <DateHeader unit="day" labelFormat={(interval) => interval[0].format("D")} className="font-bold text-xs md:text-sm" />
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
                <div className="flex flex-col gap-6 w-full xl:min-w-[20%] xl:w-auto h-fit sticky top-28">
                    <Downloadables />
                    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-xl w-full p-6 gap-4">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                            <div className="p-2 bg-slate-50 rounded-lg">
                                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <h1 className="text-gray-900 font-extrabold text-xl">
                                Legends
                            </h1>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span>
                                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Planned Date</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full shadow-sm" style={{ background: 'linear-gradient(to right, #3b82f6, #eab308, #f97316, #ef4444)' }}></span>
                                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Actual Date</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-slate-400 shadow-sm"></span>
                                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Not Started</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}