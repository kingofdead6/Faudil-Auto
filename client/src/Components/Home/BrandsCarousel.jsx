"use client";

import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { motion } from "framer-motion";

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default function BrandsCarousel() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const width = useWindowWidth();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/car-names`);
        setBrands(res.data);
      } catch (err) {
        console.error("Failed to load brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const getSlidesToShow = () => {
    if (width < 480) return 2;
    if (width < 640) return 2;
    if (width < 768) return 3;
    if (width < 1024) return 4;
    if (width < 1280) return 5;
    return 6;
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 6000,
    slidesToShow: getSlidesToShow(),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
  };

  const handleMouseEnter = () => {
    if (sliderRef.current) sliderRef.current.slickPause();
  };

  const handleMouseLeave = () => {
    if (sliderRef.current) sliderRef.current.slickPlay();
  };

  return (
    <section className="relative py-20 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold tracking-widest mb-4">
            NOS MARQUES
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">
            Marques <span className="text-red-600">Premium</span>
          </h2>
        </motion.div>

        {/* Carousel Container */}
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative"
        >
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full" />
            </div>
          ) : brands.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Aucune marque disponible</p>
          ) : (
            <Slider ref={sliderRef} {...settings}>
              {brands.map((brand) => (
                <div key={brand._id} className="px-6">
                  <div className="flex flex-col items-center justify-center h-36 group">
                    <div className="transition-all duration-500 group-hover:scale-110">
                      <img
                        src={brand.imageUrl}
                        alt={brand.name}
                        className="h-25 md:h-20 w-auto object-contain 
                                   opacity-70 group-hover:opacity-100 
                                   grayscale group-hover:grayscale-0 
                                   transition-all duration-500"
                      />
                    </div>
                    <p className="mt-4 text-sm font-medium text-gray-700 tracking-wide group-hover:text-red-600 transition-colors">
                      {brand.name}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </section>
  );
}