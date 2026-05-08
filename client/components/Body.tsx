import { ReactNode } from "react"

type BodyProps = {
    children: ReactNode
}

export default function Body({children}:BodyProps) {
    return (
        <main className="flex flex-col items-center w-screen min-h-screen h-fit bg-white pb-8">
            {children}
        </main>
    )
}