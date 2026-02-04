export default function Calendar(){
    return (
        <div className="flex flex-col w-[90%] rounded-xl border border-gray-100 shadow p-4 mb-4 gap-4">
            <h1 className="font-bold text-base md:text-xl lg:text-2xl text-black">
                Calendar of events
            </h1>
            <div className="w-full h-[450px] bg-gray-100 rounded border overflow-hidden">
                <iframe 
                    src="https://calendar.google.com/calendar/embed?src=en.philippines%23holiday%40group.v.calendar.google.com&ctz=Asia%2FManila"
                    style={{ border: 0 }}
                    width="100%"
                    height="100%"
                ></iframe>
            </div>
        </div>
    )
}