import { Button } from "@mui/material"
import PropertyRender from "./Home-recomendation-carusel"


function HomeRecomendation({ isDark = false ,propertyViewId,setView }) {

    return (
        <section className="relative overflow-hidden h-[800px]">
            <div className={`w-full${isDark ? " bg-zinc-800" : " bg-zinc-500"} h-[500px] mt-2 absolute`}>
            </div>
            <div className="container flex flex-col justify-between items-center p-10  relative mx-auto">
                <div className="relative z-[1000]">
                    <h1 className="text-3xl">Recomendation</h1>
                </div>
            </div>
            <div className="container mx-auto relative z-50 h-[600px] px-10 max-md:w-full max-md:px-6">
                <PropertyRender propertyViewId={propertyViewId} setView={setView} isDark={isDark} />
            </div>
        </section>
    )
}

export default HomeRecomendation