import { isDarkStore } from "../store/Them.store"
import HomeRecomendation from "../utils/home-utils/Home-recomendation"
import PropertyRender from "../utils/home-utils/Home-recomendation-carusel"
import SearchSection from "../utils/home-utils/Home-search-section"
import HomePreview from "../utils/home-utils/Home-preview"
import Slide from '@mui/material/Slide';
import Category from "../utils/home-utils/Home-slide"

function Home({propertyViewId,setView}) {

    const { isDark } = isDarkStore()

    return (
        <main className="">
            <SearchSection isDark={isDark} />
            <section id="hero" className="w-full h-[500px] my-5 !shadow-[-1px_10px_10px_rgba(1,1,1,0.7)]">

            </section>

            <HomeRecomendation isDark={isDark} propertyViewId={propertyViewId} setView={setView}/>

            <HomePreview isDark={isDark} />

            <section className="w-full h-[500px] mb-1.5 pt-1.5 overflow-hidden max-md:h-max">
                <div className="container flex  flex-col items-center space-y-4 mx-auto max-md:w-full">
                    <h1 className="text-4xl">Category</h1>
                    <Category />
                </div>
            </section>
        </main>
    )
}

export default Home