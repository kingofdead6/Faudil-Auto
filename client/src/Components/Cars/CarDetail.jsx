"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { ArrowLeft, Calendar, Palette, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR_MAP = {
  blanc: "#FFFFFF", white: "#FFFFFF",
  noir: "#1a1a1a", black: "#1a1a1a",
  gris: "#9ca3af", grey: "#9ca3af", gray: "#9ca3af", argent: "#c0c0c0", silver: "#c0c0c0",
  rouge: "#dc2626", red: "#dc2626",
  bleu: "#3b82f6", blue: "#3b82f6", "bleu marine": "#1e3a5f", navy: "#1e3a5f",
  vert: "#22c55e", green: "#22c55e",
  jaune: "#facc15", yellow: "#facc15",
  orange: "#f97316",
  violet: "#a855f7", purple: "#a855f7",
  marron: "#92400e", brown: "#92400e", beige: "#d4b896",
  rose: "#ec4899", pink: "#ec4899",
  or: "#d4a017", gold: "#d4a017",
};

function getColorSwatch(name = "") {
  const key = name.toLowerCase().trim();
  return COLOR_MAP[key] || "#e5e7eb";
}

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/cars/${id}`);
        setCar(res.data);
        if (res.data.colors?.length) setSelectedColor(res.data.colors[0]);
      } catch (err) {
        toast.error("Voiture non trouvée");
        navigate("/cars");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!car) return null;

  const images = car.images || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/cars")}
          className="flex items-center gap-3 text-gray-600 hover:text-red-600 mb-10 transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Retour aux voitures</span>
        </motion.button>

        <div className="space-y-16">

          {/* ── INFORMATION SECTION (Top) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-bold tracking-widest rounded-full">
                VÉHICULE PREMIUM
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={18} />
                <span className="font-semibold text-gray-800">{car.year}</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">
              {car.brand} <span className="text-red-600">{car.model}</span>
            </h1>

            {/* Colors */}
            <div className="mt-10">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-4">
                Couleurs disponibles
              </p>
              <div className="flex flex-wrap gap-4">
                {car.colors.map((color, idx) => {
                  const swatch = getColorSwatch(color);
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`group flex flex-col items-center transition-all`}
                    >
                      <div
                        className={`w-11 h-11 rounded-2xl border-2 shadow-sm transition-all duration-300 ${
                          isSelected 
                            ? "border-red-600 scale-110 shadow-red-200" 
                            : "border-gray-200 hover:border-gray-400 hover:scale-105"
                        }`}
                        style={{ backgroundColor: swatch }}
                      />
                      <span className={`mt-2 text-xs font-medium transition-colors ${
                        isSelected ? "text-red-600" : "text-gray-600"
                      }`}>
                        {color}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="mt-12">
                <h3 className="text-sm uppercase tracking-widest text-gray-500 font-medium mb-3">
                  À PROPOS DE CE VÉHICULE
                </h3>
                <p className="text-gray-700 leading-relaxed text-[17px]">
                  {car.description}
                </p>
              </div>
            )}
          </motion.div>

          {/* ── IMAGES SECTION (Below) ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gray-100 aspect-[16/10]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={`${car.brand} ${car.model}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    <ChevronLeft size={28} className="text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    <ChevronRight size={28} className="text-gray-800" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {hasMultipleImages && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm font-medium px-5 py-2 rounded-full backdrop-blur">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {hasMultipleImages && (
              <div className="flex gap-4 mt-6 overflow-x-auto pb-4 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-28 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      idx === currentImageIndex 
                        ? "border-red-600 scale-105 shadow-md" 
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}