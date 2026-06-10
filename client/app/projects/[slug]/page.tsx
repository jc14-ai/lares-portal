'use client'

import Downloadables from "@/components/Downloadables";
import NavBar from "@/components/NavBar";
import Timeline, { TimelineHeaders, SidebarHeader, DateHeader, TodayMarker } from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import moment from "moment";
import { use, useEffect, useState } from "react";

type ProjectProps = {
    wbsNumber: string;
    taskTitle: string;
    taskOwner: string;
    startDate: string;
    dueDate: string;
    planStartDate:string;
    planEndDate: string;
    progressStatus: "Not started" | "In progress" | "Completed" | "Blocked";
    duration: string;
    pct: string;
}



export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const project = decodeURIComponent(resolvedParams.slug);
    const [data, setData] = useState<ProjectProps[]>([]);
    const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setData([]);
                const res = await fetch(`/api/data?project=${encodeURIComponent(project)}`);
                if (!res.ok) {
                    setData([]);
                    return;
                }
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

    const filteredData = data.filter(item => item.planStartDate && item.planEndDate);

    const parseDate = (value?: string) => {
        if (!value) return null;
        const parsed = moment(value, ["M/D/YY", "M/D/YYYY"], true);
        return parsed.isValid() ? parsed : null;
    };

    const getEarliestMoment = (values: string[]) => {
        const moments = values.map(parseDate).filter((m): m is moment.Moment => m !== null);
        return moments.length ? moment.min(moments) : null;
    };

    const getLatestMoment = (values: string[]) => {
        const moments = values.map(parseDate).filter((m): m is moment.Moment => m !== null);
        return moments.length ? moment.max(moments) : null;
    };

    const parseDurationValue = (value?: string) => {
        if (!value) return 0;
        const match = value.toString().trim().match(/-?[\d,.]+/);
        if (!match) return 0;
        const normalized = match[0].replace(/,/g, "");
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const sprintMap = filteredData.reduce<Record<number, {
        sprint: number;
        tasks: ProjectProps[];
        owners: Set<string>;
        planStartDates: string[];
        planEndDates: string[];
        startDates: string[];
        dueDates: string[];
        statuses: Set<string>;
        durations: number[];
    }>>((acc, item) => {
        const wbs = item.wbsNumber?.trim();
        const match = wbs?.match(/^(\d+)\./);
        if (!match) return acc;

        const sprint = Number(match[1]);
        if (Number.isNaN(sprint) || sprint < 1 || sprint > 4) return acc;

        if (!acc[sprint]) {
            acc[sprint] = {
                sprint,
                tasks: [],
                owners: new Set<string>(),
                planStartDates: [],
                planEndDates: [],
                startDates: [],
                dueDates: [],
                statuses: new Set<string>(),
                durations: [],
            };
        }

        acc[sprint].tasks.push(item);
        if (item.taskOwner) acc[sprint].owners.add(item.taskOwner);
        if (item.planStartDate) acc[sprint].planStartDates.push(item.planStartDate);
        if (item.planEndDate) acc[sprint].planEndDates.push(item.planEndDate);
        if (item.startDate) acc[sprint].startDates.push(item.startDate);
        if (item.dueDate) acc[sprint].dueDates.push(item.dueDate);
        if (item.progressStatus) acc[sprint].statuses.add(item.progressStatus);
        if (item.duration) acc[sprint].durations.push(parseDurationValue(item.duration));

        return acc;
    }, {});

    const sprintGroups = Object.values(sprintMap)
        .sort((a, b) => a.sprint - b.sprint)
        .map((sprint) => {
            const firstTask = sprint.tasks.find((task) => task.wbsNumber?.trim().endsWith('.1'));
        const planStart = parseDate(firstTask?.planStartDate || sprint.planStartDates[0]);
        const planEnd = getLatestMoment(sprint.planEndDates);
        const actualStart = parseDate(firstTask?.startDate) || getEarliestMoment(sprint.startDates) || planStart;
        const actualEnd = getLatestMoment(sprint.dueDates) || planEnd;
        const totalDuration = sprint.durations.reduce((sum, value) => sum + value, 0);
        const durationLabel = totalDuration > 0 ? `${totalDuration} day${totalDuration === 1 ? '' : 's'}` : 'TBD';
        const status = sprint.statuses.has('Not started')
            ? 'Not started'
            : sprint.statuses.has('In progress')
                ? 'In progress'
                : sprint.statuses.has('Blocked')
                    ? 'Blocked'
                    : 'Completed';

        return {
            id: sprint.sprint,
            sprintNumber: sprint.sprint,
            owners: Array.from(sprint.owners),
            planStart,
            planEnd,
            actualStart,
            actualEnd,
            status,
            totalDuration,
            durationLabel,
        };
        })
        .filter((group) => group.planStart && group.planEnd && group.actualEnd);

    // Compute maximum owners count to size row height so owner chips are visible
    const maxOwners = sprintGroups.length ? Math.max(...sprintGroups.map(g => g.owners.length)) : 1;
    // Conservative row height calculation:
    // - base height 48px
    // - assume ~3 chips fit per line; additional rows add 18px each
    // - cap the resulting height to avoid excessive row tallness
    const chipsPerRow = 3;
    const additionalRows = Math.max(0, Math.ceil(maxOwners / chipsPerRow) - 1);
    const computedLineHeight = Math.min(88, 48 + additionalRows * 18);

    const groups = sprintGroups.flatMap((group) => {
        const sprintRow = {
            id: group.id,
            title: (
                <div 
                    className={`flex w-full items-stretch text-[0.75em] md:text-[1.1em] font-semibold h-full border-b border-gray-50 cursor-pointer transition-colors duration-200 ${selectedSprintId === group.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedSprintId(selectedSprintId === group.id ? null : group.id)}
                >
                    <div className="flex-1 min-w-0 px-4 py-2 text-black font-bold uppercase tracking-tight border-r border-gray-200 h-full flex items-center leading-snug whitespace-normal line-clamp-2">
                        {selectedSprintId === group.id ? '▼' : '▶'} Sprint {group.sprintNumber}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-wrap items-start justify-center gap-1 px-4 py-2 text-black border-r border-gray-200 h-full">
                        {group.owners.map((owner, idx) => (
                            <span key={idx} className="break-words whitespace-normal rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-gray-700 text-[0.65em] md:text-[0.9em] leading-tight font-medium">
                                {owner}
                            </span>
                        ))}
                    </div>
                    <div className="flex-1 min-w-0 px-4 py-2 text-right text-black font-semibold uppercase tracking-tight h-full flex items-center justify-end">
                        {group.durationLabel}
                    </div>
                </div>
            ),
        };

        if (selectedSprintId === group.id) {
            const taskRows = (sprintMap[group.id]?.tasks || []).map((task) => {
                const cleanSidebarTitle = task.taskTitle.replace(/^Sprint\s+\d+[:\s]*/i, '');
                return {
                    id: `task-${task.wbsNumber}`,
                    title: (
                        <div className="flex w-full items-stretch text-[0.8em] md:text-[0.95em] font-bold h-full border-b border-gray-100 bg-gray-50/50 pl-8">
                            <div className="flex-1 min-w-0 px-4 py-1.5 text-gray-800 border-r border-gray-200 h-full flex items-center leading-tight">
                                <span className="truncate w-full" title={cleanSidebarTitle}>
                                    {cleanSidebarTitle}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0 px-4 py-1.5 text-gray-600 border-r border-gray-200 h-full flex items-center justify-center italic font-semibold">
                                <span className="truncate w-full text-center" title={task.taskOwner}>
                                    {task.taskOwner}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0 px-4 py-1.5 text-right text-gray-600 h-full flex items-center justify-end font-mono font-bold">
                                <span className="truncate w-full" title={`${task.duration} ${Number(task.duration) === 1 ? 'day' : 'days'}`}>
                                    {task.duration} {Number(task.duration) === 1 ? 'day' : 'days'}
                                </span>
                            </div>
                        </div>
                    ),
                };
            });
            return [sprintRow, ...taskRows];
        }

        return [sprintRow];
    });

    const items = [
        ...sprintGroups.flatMap((group) => {
            const planItem = {
                id: `${group.id}-plan`,
                group: group.id,
                title: 'Plan',
                owner: group.owners.join(', '),
                status: group.status,
                start_time: group.planStart!.valueOf(),
                end_time: group.planEnd!.clone().add(1, 'day').valueOf(),
                canMove: false,
                canResize: false,
                isPlan: true,
                planEnd: group.planEnd!.format('M/D/YY'),
            };

            const actualItem = group.actualStart && group.actualEnd ? {
                id: `${group.id}-actual`,
                group: group.id,
                title: 'Actual',
                owner: group.owners.join(', '),
                status: group.status,
                start_time: group.actualStart.valueOf(),
                end_time: group.actualEnd.clone().add(1, 'day').valueOf(),
                canMove: false,
                canResize: false,
                isPlan: false,
                planEnd: group.planEnd!.format('M/D/YY'),
            } : null;

            return actualItem ? [planItem, actualItem] : [planItem];
        }),
        ...(selectedSprintId && sprintMap[selectedSprintId] ? sprintMap[selectedSprintId].tasks.flatMap((task) => {
            const planStart = parseDate(task.planStartDate);
            const planEnd = parseDate(task.planEndDate);
            if (!planStart || !planEnd) return [];

            const cleanTaskTitle = task.taskTitle.replace(/^Sprint\s+\d+[:\s]*/i, '');

            const taskPlanItem = {
                id: `task-${task.wbsNumber}-plan`,
                group: `task-${task.wbsNumber}`,
                title: cleanTaskTitle,
                status: task.progressStatus,
                start_time: planStart.valueOf(),
                end_time: planEnd.clone().add(1, 'day').valueOf(),
                canMove: false,
                canResize: false,
                isPlan: true,
                isTask: true,
                planEnd: planEnd.format('M/D/YY'),
            };

            const actualStart = parseDate(task.startDate);
            const actualEnd = parseDate(task.dueDate);
            if (actualStart && actualEnd) {
                const taskActualItem = {
                    id: `task-${task.wbsNumber}-actual`,
                    group: `task-${task.wbsNumber}`,
                    title: cleanTaskTitle,
                    status: task.progressStatus,
                    start_time: actualStart.valueOf(),
                    end_time: actualEnd.clone().add(1, 'day').valueOf(),
                    canMove: false,
                    canResize: false,
                    isPlan: false,
                    isTask: true,
                    planEnd: planEnd.format('M/D/YY'),
                };
                return [taskPlanItem, taskActualItem];
            }

            return [taskPlanItem];
        }) : [])
    ];

    const defaultTimeStart = items.length
        ? moment(Math.min(...items.map((item) => item.start_time))).startOf('week').valueOf()
        : moment().startOf('week').valueOf();
    const defaultTimeEnd = items.length
        ? moment(Math.min(...items.map((item) => item.start_time))).startOf('week').add(1, 'week').valueOf()
        : moment().endOf('week').valueOf();

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
                        {items.length > 0 ? (
                            <Timeline
                                groups={groups}
                                items={items}
                                defaultTimeStart={defaultTimeStart}
                                defaultTimeEnd={defaultTimeEnd}
                                stackItems
                                lineHeight={computedLineHeight}
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
                                        const planEndMs = moment(item.planEnd, ["M/D/YY", "M/D/YYYY"]).valueOf();
                                        const dayMs = 24 * 60 * 60 * 1000;

                                        if (totalMs <= 0) {
                                            background = '#3b82f6';
                                        } else {
                                            const getPct = (time: number) => Math.max(0, Math.min(100, ((time - startMs) / totalMs) * 100));
                                            const stops: string[] = [];
                                            const pBaseEnd = getPct(planEndMs);
                                            if (pBaseEnd > 0) {
                                                stops.push(`#3b82f6 0%`, `#3b82f6 ${pBaseEnd}%`);
                                            }
                                            const pYellowEnd = getPct(planEndMs + dayMs);
                                            if (pYellowEnd > pBaseEnd) {
                                                stops.push(`#eab308 ${pBaseEnd}%`, `#eab308 ${pYellowEnd}%`);
                                            }
                                            const pOrangeEnd = getPct(planEndMs + 3 * dayMs);
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
                                            <div className="relative w-full h-full pointer-events-none px-1">
                                                <div className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                                                    <div className="bg-slate-900 text-white text-[0.6rem] md:text-[0.65rem] font-black px-2 py-0.5 rounded shadow-lg border border-slate-700 whitespace-nowrap">
                                                        {moment(item.start_time).format('MMM D')}
                                                    </div>
                                                </div>
                                                <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                                                    <div className="bg-slate-900 text-white text-[0.6rem] md:text-[0.65rem] font-black px-2 py-0.5 rounded shadow-lg border border-slate-700 whitespace-nowrap">
                                                        {moment(item.end_time).clone().format('MMM D')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }}
                            >
                                <TimelineHeaders className="bg-slate-900 border-b border-slate-700 sticky top-0 z-20">
                                    <SidebarHeader>
                                        {({ getRootProps }) => (
                                            <div {...getRootProps()} className="flex items-center bg-slate-900 text-white font-bold text-[0.7em] md:text-[1.05em] uppercase tracking-wider border-r border-slate-700">
                                                <div className="flex-1 min-w-0 px-4 py-3 text-center">Activities</div>
                                                <div className="flex-1 min-w-0 px-4 py-3 text-center">Owner</div>
                                                <div className="flex-1 min-w-0 px-4 py-3 text-center">Duration</div>
                                            </div>
                                        )}
                                    </SidebarHeader>
                                    <DateHeader unit="month" labelFormat={(interval) => interval[0].format("MMMM YYYY")} className="font-bold md:text-lg" />
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