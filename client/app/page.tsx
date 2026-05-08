import NavBar from "@/components/NavBar";
import Body from "@/components/Body";
import DashboardAccess from "@/components/DashboardAccess";
import Calendar from "@/components/Calendar";
import Prioritization from "@/components/Prioritization";
import Downloadables from "@/components/Downloadables";

export default function Home() {
    return (
        <Body>
            <NavBar/>
            <h1 className="flex text-black font-bold text-xl md:text-2xl lg:text-3xl w-[90%] border-l-4 border-black px-4 mb-4 mt-25">
                Welcome to the PMO Portal!
            </h1>
            <DashboardAccess/>
            <Calendar/>
            <section className="flex justify-center flex-col md:flex-row lg:flex-row w-[90%] gap-4 md:gap-8 lg:gap-8">
                <Prioritization/>
                <Downloadables/>
            </section>
        </Body>
    )
}