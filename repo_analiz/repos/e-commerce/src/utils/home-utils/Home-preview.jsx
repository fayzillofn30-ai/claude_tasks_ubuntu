import React from 'react'
import discord from "../../assets/img/discord.png"

function HomePreview({ isDark = false }) {
  const features = [
    {
      title: "Trusted By Thousands",
      desc: `With over 1 million+ homes
        for sale available on the
        website, Trulia can match
        you with a house you will
        want to call home.`,
    },
    {
      title: "Wide Range Of Properties",
      desc: `Find apartments, houses,
        offices, and more that suit
        your needs across various
        categories.`,
    },
    {
      title: "Easy To Find",
      desc: `Our platform makes searching
        simple and efficient, helping
        you save time.`,
    },
    {
      title: "Verified Listings",
      desc: `Every listing is verified to
        ensure you get accurate and
        up-to-date information.`,
    },
  ]

  return (
    <section
      className={`w-full min-h-[400px] ${isDark ? "bg-violet-950" : "bg-gray-200"} mt-20 shadow-2xl`}
    >
      <div className="container mx-auto flex flex-col items-center space-y-6 px-4 py-8">
        <h1 className="text-3xl font-bold">Why Choose Us</h1>
        <p className="text-center max-w-xl">
          Nulla quis curabitur velit volutpat auctor bibendum consectetur sit.
        </p>

        {/* Grid responsiv */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center px-2">
              <img src={discord} alt="" className="w-16 h-16 mb-4" />
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="text-sm mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomePreview
