'use client';

import { useEffect, useState } from "react";

type Employee = {
    department: string;
    id: string;
    name: string;
    statuses: string[];
}

type MonthData = {
    days_of_week: string[];
    day_numbers: string[];
    employees: Employee[];
    holiday_days: number[];
}

type LeaveData = {
    legends: Record<string, string>;
    months: Record<string, MonthData>;
}

export default function Calendar() {
    const [data, setData] = useState<LeaveData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [activeMonth, setActiveMonth] = useState<string>("January");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDept, setSelectedDept] = useState("All");
    const [hoveredColIndex, setHoveredColIndex] = useState<number | null>(null);

    useEffect(() => {
        async function fetchLeaveData() {
            try {
                const res = await fetch("/api/leaves");
                if (!res.ok) {
                    throw new Error("Failed to fetch leave calendar data");
                }
                const result = await res.json();
                setData(result);
                
                const months = Object.keys(result.months || {});
                if (months.length > 0) {
                    const currentMonthName = new Date().toLocaleString('en-US', { month: 'long' });
                    if (months.includes(currentMonthName)) {
                        setActiveMonth(currentMonthName);
                    } else {
                        setActiveMonth(months[0]);
                    }
                }
            } catch (err) {
                setError("An error occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchLeaveData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col w-[90%] rounded-2xl border border-gray-100 bg-white shadow-xl p-8 mb-6 gap-6 items-center justify-center min-h-[400px]">
                <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                <p className="text-gray-500 font-medium">Loading Leave Tracker...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col w-[90%] rounded-2xl border border-red-100 bg-red-50/50 shadow p-8 mb-6 gap-4 items-center justify-center min-h-[200px]">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-red-700 font-semibold text-lg">Failed to load Leave Calendar</p>
                <p className="text-red-500 text-sm">{error || "Data is unavailable"}</p>
            </div>
        );
    }

    const chronologicalMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthNames = Object.keys(data.months).sort(
        (a, b) => chronologicalMonths.indexOf(a) - chronologicalMonths.indexOf(b)
    );
    const activeMonthData = data.months[activeMonth];

    const departments = ["All", ...Array.from(new Set(
        activeMonthData?.employees.map(emp => emp.department).filter(Boolean) || []
    ))];

    const filteredEmployees = activeMonthData?.employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              emp.id.includes(searchQuery);
        const matchesDept = selectedDept === "All" || emp.department === selectedDept;
        return matchesSearch && matchesDept;
    }) || [];

    const getStatusStyle = (status: string) => {
        if (!status) return "bg-transparent text-transparent";
        
        const norm = status.toUpperCase().trim();
        
        if (norm === "WFH") return "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold";
        if (norm === "WOS") return "bg-blue-50 text-blue-700 border border-blue-200 font-bold";
        if (norm === "VL") return "bg-amber-50 text-amber-700 border border-amber-200 font-bold";
        if (norm === "SL" || norm.startsWith("SL")) return "bg-rose-50 text-rose-700 border border-rose-200 font-bold";
        if (norm === "EL") return "bg-red-100 text-red-700 border border-red-300 font-bold";
        if (norm === "HOL" || norm === "HOLIDAY") return "bg-red-500 text-white font-extrabold border border-red-600";
        if (norm === "SNWD") return "bg-red-50 text-red-700 border border-red-200 font-bold";
        if (norm === "CRD") return "bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold";
        if (norm === "PTA") return "bg-orange-50 text-orange-700 border border-orange-200 font-bold";
        if (norm === "TSW") return "bg-purple-50 text-purple-700 border border-purple-200 font-bold";
        if (norm === "OS") return "bg-slate-100 text-slate-700 border border-slate-300 font-bold";
        if (norm === "HDAY" || norm === "HD") return "bg-amber-50/50 text-amber-600 border border-amber-200/60 font-bold";

        return "bg-gray-100 text-gray-700 border border-gray-200 font-semibold";
    };

    return (
        <div className="flex flex-col w-[90%] rounded-2xl border border-gray-100 bg-white shadow-xl p-6 mb-6 gap-6 transition-all duration-300">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                        <p className="text-blue-600 text-xs font-bold tracking-wider uppercase">Hotline & Leave Tracker</p>
                    </div>
                    <h1 className="font-extrabold text-2xl lg:text-3xl text-gray-900 tracking-tight">
                        Leave Calendar FY2026
                    </h1>
                </div>
            </div>

            {/* Month Tab/Selector */}
            <div className="w-full border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {monthNames.map((month) => (
                        <button
                            key={month}
                            onClick={() => {
                                setActiveMonth(month);
                                setSelectedDept("All");
                            }}
                            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all duration-150 cursor-pointer whitespace-nowrap border ${
                                activeMonth === month
                                    ? "bg-slate-900 text-white shadow-md border-slate-900"
                                    : "bg-white text-gray-600 border-gray-200 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                        >
                            {month}
                        </button>
                    ))}
                </div>
            </div>

            {/* Controls / Filter Area */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
                <div className="flex flex-1 flex-col md:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search employee name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-gray-50/50"
                        />
                        <svg className="w-5 h-5 absolute left-3.5 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Department Select */}
                    <div className="relative min-w-[150px]">
                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 bg-gray-50/50 appearance-none pr-8 cursor-pointer"
                        >
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept === "All" ? "All Depts" : dept}
                                </option>
                            ))}
                        </select>
                        <svg className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Grid Calendar Table */}
            <div className="w-full overflow-hidden border border-gray-200 rounded-2xl shadow-sm bg-white">
                <div className="overflow-x-auto w-full max-h-[500px]">
                    <table className="w-full border-collapse table-fixed text-left">
                        <thead>
                            <tr className="bg-slate-900 text-white border-b border-slate-700 text-xs">
                                <th className="sticky left-0 z-30 bg-slate-900 px-4 py-3.5 font-bold uppercase tracking-wider text-left border-r border-slate-700 w-[110px]">
                                    Dept
                                </th>
                                <th className="sticky left-[110px] z-30 bg-slate-900 px-4 py-3.5 font-bold uppercase tracking-wider text-left border-r border-slate-700 w-[60px] text-center">
                                    ID
                                </th>
                                <th className="sticky left-[170px] z-30 bg-slate-900 px-4 py-3.5 font-bold uppercase tracking-wider text-left border-r border-slate-700 w-[140px]">
                                    Employee
                                </th>
                                {activeMonthData?.day_numbers.map((num, idx) => {
                                    const dayName = activeMonthData.days_of_week[idx] || "";
                                    const isWeekend = dayName.startsWith("S"); // Sat, Sun
                                    const isHoliday = activeMonthData.holiday_days?.includes(idx);
                                    return (
                                        <th
                                            key={idx}
                                            onMouseEnter={() => setHoveredColIndex(idx)}
                                            onMouseLeave={() => setHoveredColIndex(null)}
                                            className={`px-1 py-1.5 text-center font-bold border-r border-slate-700 w-[42px] min-w-[42px] transition-colors duration-150 ${
                                                isHoliday ? "bg-red-800" : isWeekend ? "bg-slate-800" : "bg-slate-900"
                                            } ${hoveredColIndex === idx ? "brightness-125" : ""}`}
                                        >
                                            <div className="text-[10px] opacity-75 font-semibold uppercase">{dayName.substring(0, 3)}</div>
                                            <div className="text-xs font-black">{num}</div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((emp, empIdx) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors duration-100">
                                        <td className="sticky left-0 z-20 bg-white font-bold text-gray-700 px-4 py-2.5 border-r border-gray-200 text-xs shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                            {emp.department && (
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                                    emp.department === "CMT" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                                                }`}>
                                                    {emp.department}
                                                </span>
                                            )}
                                        </td>
                                        <td className="sticky left-[110px] z-20 bg-white font-medium text-gray-500 px-2 py-2.5 border-r border-gray-200 text-xs text-center shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                            {emp.id}
                                        </td>
                                        <td className="sticky left-[170px] z-20 bg-white font-bold text-gray-900 px-4 py-2.5 border-r border-gray-200 text-xs shadow-[4px_0_8px_rgba(0,0,0,0.03)] truncate" title={emp.name}>
                                            {emp.name}
                                        </td>
                                        {Array.from({ length: 31 }).map((_, idx) => {
                                            const status = emp.statuses[idx] || "";
                                            const dayName = activeMonthData?.days_of_week[idx] || "";
                                            const isWeekend = dayName.startsWith("S");
                                            const isHovered = hoveredColIndex === idx;
                                            const hasDay = idx < (activeMonthData?.day_numbers.length || 0);
                                            const isHoliday = hasDay && activeMonthData?.holiday_days?.includes(idx);
                                            const isHolidayStatus = ["HOL", "SNWD", "HOLIDAY"].includes(status.toUpperCase());
                                            return (
                                                <td
                                                    key={idx}
                                                    onMouseEnter={() => hasDay && setHoveredColIndex(idx)}
                                                    onMouseLeave={() => setHoveredColIndex(null)}
                                                    className={`p-0.5 border-r border-gray-100 text-center align-middle transition-colors duration-100 ${
                                                        isHoliday ? "bg-red-50" : isWeekend ? "bg-slate-50/50" : "bg-transparent"
                                                    } ${isHovered && hasDay ? "bg-blue-50/40" : ""} ${!hasDay ? "bg-gray-50/20" : ""}`}
                                                >
                                                    {hasDay && status && !isHolidayStatus ? (
                                                        <div
                                                            className={`w-full h-[26px] flex items-center justify-center rounded-lg text-[9px] shadow-sm select-none transition-transform duration-100 hover:scale-[1.08] cursor-help ${getStatusStyle(
                                                                status
                                                            )}`}
                                                            title={`${emp.name} (${activeMonth} ${idx+1}): ${data.legends[status.toUpperCase()] || status}`}
                                                        >
                                                            {status}
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-[26px] bg-transparent" />
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3 + (activeMonthData?.day_numbers.length || 0)} className="text-center py-12 text-gray-400 font-medium">
                                        No employees found matching the filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Compact Collapsible Legends Panel */}
            <details className="group border border-gray-100 bg-gray-50/40 rounded-2xl p-4 transition-all duration-300">
                <summary className="flex justify-between items-center font-bold text-gray-800 text-sm cursor-pointer list-none select-none">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Calendar Status Legends & Abbreviations</span>
                    </div>
                    <span className="text-xs text-blue-600 font-bold group-open:hidden">Show Legends →</span>
                    <span className="text-xs text-blue-600 font-bold hidden group-open:inline">← Hide Legends</span>
                </summary>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 border-t border-gray-100 pt-4">
                    {Object.entries(data.legends).map(([code, desc]) => (
                        <div key={code} className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-gray-100/80 shadow-sm hover:shadow transition-shadow">
                            <span className={`px-2 py-0.5 rounded text-[9px] min-w-[36px] text-center shrink-0 ${getStatusStyle(code)}`}>
                                {code}
                            </span>
                            <span className="text-xs font-semibold text-gray-600 leading-tight">
                                {desc}
                            </span>
                        </div>
                    ))}
                </div>
            </details>
        </div>
    );
}