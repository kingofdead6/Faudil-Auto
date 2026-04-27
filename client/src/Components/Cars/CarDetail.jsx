"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { ArrowLeft, Calendar, Palette, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Utility: derive a CSS color from a French color name ── */
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
  if (COLOR_MAP[key]) return COLOR_MAP[key];
  // Try partial match
  for (const [k, v] of Object.entries(COLOR_MAP)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return "#e5e7eb"; // fallback light gray
}

function isLight(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-red-100" />
            <div className="absolute inset-0 rounded-full border-t-2 border-red-600 animate-spin" />
          </div>
          <p className="text-gray-400 text-sm tracking-widest uppercase animate-pulse">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!car) return null;

  const images = car.images || [];
  const hasMultiple = images.length > 1;

  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* ── Back button ── */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/cars")}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 mb-8 text-sm font-medium transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Retour aux voitures
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14">

          {/* ── LEFT: Gallery ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main image */}
            <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={`${car.brand} ${car.model}`}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Prev / Next arrows */}
              {hasMultiple && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center text-gray-700 hover:bg-white hover:text-red-600 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center text-gray-700 hover:bg-white hover:text-red-600 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Image counter */}
              {hasMultiple && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {hasMultiple && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-[72px] h-[54px] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      idx === currentImageIndex
                        ? "border-red-500 shadow-sm shadow-red-100"
                        : "border-transparent opacity-60 hover:opacity-90 hover:border-gray-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── RIGHT: Details ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            {/* Title */}
            <div>
              <span className="inline-block mb-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-red-50 text-red-600 border border-red-100">
                Fiche Véhicule
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter leading-[1]">
                {car.brand}
                <br />
                <span className="text-red-600">{car.model}</span>
              </h1>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 shadow-sm">
                <Calendar size={15} className="text-red-500" />
                <span className="font-semibold text-gray-800">{car.year}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 shadow-sm">
                <Palette size={15} className="text-red-500" />
                <span>{car.colors.length} couleur{car.colors.length > 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="my-7 h-px bg-gray-100" />

            {/* Description */}
            {car.description && (
              <div>
                <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {car.description}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="my-7 h-px bg-gray-100" />

            {/* Colors */}
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">
                Couleurs disponibles
              </h3>
              <div className="flex flex-wrap gap-3">
                {car.colors.map((color, idx) => {
                  const swatch = getColorSwatch(color);
                  const light = isLight(swatch);
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`group flex flex-col items-center gap-1.5 transition-all`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 shadow-sm ${
                          isSelected
                            ? "border-red-500 scale-110 shadow-md shadow-red-100"
                            : "border-gray-200 hover:border-gray-400 hover:scale-105"
                        } ${swatch === "#FFFFFF" ? "ring-1 ring-gray-200" : ""}`}
                        style={{ backgroundColor: swatch }}
                      />
                      <span className={`text-[10px] font-medium transition-colors ${
                        isSelected ? "text-red-600" : "text-gray-500"
                      }`}>
                        {color}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedColor && (
                <motion.p
                  key={selectedColor}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-xs text-gray-400"
                >
                  Couleur sélectionnée :{" "}
                  <span className="text-gray-700 font-semibold">{selectedColor}</span>
                </motion.p>
              )}
            </div>        
          </motion.div>
        </div>
      </div>
    </div>
  );
}