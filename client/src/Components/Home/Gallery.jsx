"use client";

import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { Image as ImageIcon } from "lucide-react";

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

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const width = useWindowWidth();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/gallery`);
        setImages(res.data || []);
      } catch (err) {
        console.error("Gallery fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const getSlidesToShow = () => {
    if (width < 640) return 1;
    if (width < 1024) return 2;
    if (width < 1280) return 3;
    return 4;
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
    centerMode: false,
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full mb-4" />
          <p className="text-gray-500">Chargement de la galerie...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-500">Aucune image disponible</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="mx-auto px-6">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold tracking-widest mb-4">
            NOS RÉALISATIONS
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">
            Galerie <span className="text-red-600">Photos</span>
          </h2>
          <p className="mt-5 text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez nos plus belles installations et réalisations automobiles
          </p>
        </motion.div>

        {/* Continuous Moving Carousel */}
        <div className="relative">
          {/* Fade Edges */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <Slider ref={sliderRef} {...settings}>
            {images.map((item, index) => (
              <motion.div
                key={item._id || index}
                className="px-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <div className="relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title || `Réalisation ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-all duration-500" />

                  {/* Caption */}
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="text-xl md:text-2xl font-semibold tracking-tight drop-shadow-md">
                        {item.title}
                      </h3>
                    </div>
                  )}

                  {/* Subtle border glow */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-red-500/30 rounded-3xl transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}