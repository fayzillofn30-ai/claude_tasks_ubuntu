import React, { useEffect, useState } from "react";
import Slide from "@mui/material/Slide";
import image from "../../assets/img/unsplash_.png";
import Carousel from "react-multi-carousel";
import { apiStore } from "../../service/api";
import { categoryStore } from "../../store/Category.store";
import { useLocation } from "react-router-dom";

const slides = [
    image, image, image, image, image
];

function Category() {
  const { categories, setCategories } = categoryStore()
  const { api } = apiStore()
  const url = useLocation()

  useEffect(() => {
    api.get("/categories/get-all").then(res => {
      const result = res.data
      setCategories(result.categories)
    })
  }, [url.pathname])

  return (
    <div className="h-max grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
      {categories.map(({ id, name, img }) => (
        <div
          key={id}
          className="relative flex justify-center items-center rounded-xl shadow-md overflow-hidden"
          style={{
            backgroundImage: `url(${img})`,
            height: "250px",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full h-full bg-black/60 flex flex-col items-center justify-center p-4">
            <img
              src={img}
              alt={name}
              className="w-16 h-16 object-cover rounded-full mb-2"
            />
            <h1 className="text-white text-lg font-semibold">{name}</h1>
          </div>
        </div>
      ))}
    </div>
  )
}


export default Category;
