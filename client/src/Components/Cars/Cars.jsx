"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Search, X, Car as CarIcon, Palette, SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [carsRes, brandsRes, yearsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/cars`),
          axios.get(`${API_BASE_URL}/cars/brands`),
          axios.get(`${API_BASE_URL}/cars/years`),
        ]);
        setCars(carsRes.data);
        setBrands(brandsRes.data);
        setYears(yearsRes.data);
      } catch (err) {
        toast.error("Erreur lors du chargement des voitures");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.description && car.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBrand = !selectedBrand || car.brand === selectedBrand;
    const matchesYear = !selectedYear || car.year === Number(selectedYear);
    const matchesColor = !selectedColor || car.colors.includes(selectedColor);
    return matchesSearch && matchesBrand && matchesYear && matchesColor;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedBrand("");
    setSelectedYear("");
    setSelectedColor("");
  };

  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (selectedYear ? 1 : 0) +
    (selectedColor ? 1 : 0);

  const allColors = [...new Set(cars.flatMap((car) => car.colors))].sort();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 font-sans">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-4 sm:px-8 pt-12 pb-16 md:pt-20 md:pb-24 bg-white border-b border-gray-100">
        {/* Subtle red tint blob top-center */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse, #dc2626 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 opacity-[0.04]"
          style={{ background: "radial-gradient(circle at 100% 100%, #dc2626 0%, transparent 60%)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <span className="inline-block mb-5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase bg-red-50 text-red-600 border border-red-100">
            Notre Flotte Premium
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-gray-900">
            Voitures
            <br />
            <span className="text-red-600">d'Exception</span>
          </h1>

          <p className="mt-7 text-gray-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Une sélection de véhicules haut de gamme pour chaque occasion.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gray-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <div className="h-px w-16 bg-gray-200" />
          </div>
        </motion.div>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="sticky top-[64px] z-40 px-4 sm:px-8 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Top row */}
          <div className="flex items-center gap-3 px-4 sm:px-6 py-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Marque, modèle…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap ${
                filtersOpen || activeFiltersCount > 0
                  ? "bg-red-600 border-red-600 text-white shadow-sm shadow-red-100"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filtres</span>
              {activeFiltersCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-red-600 text-[10px] font-black">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Expandable filters */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-gray-100"
              >
                <div className="px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50/60">
                  {[
                    { value: selectedBrand, setter: setSelectedBrand, placeholder: "Toutes les marques", options: brands },
                    { value: selectedYear,  setter: setSelectedYear,  placeholder: "Toutes les années",  options: years  },
                    { value: selectedColor, setter: setSelectedColor, placeholder: "Toutes les couleurs", options: allColors },
                  ].map(({ value, setter, placeholder, options }, i) => (
                    <div key={i} className="relative">
                      <select
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-red-400 transition-colors cursor-pointer shadow-sm"
                      >
                        <option value="">{placeholder}</option>
                        {options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  ))}
                </div>

                {activeFiltersCount > 0 && (
                  <div className="px-4 sm:px-6 pb-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {filteredCars.length} résultat{filteredCars.length !== 1 ? "s" : ""}
                    </p>
                    <button
                      onClick={resetFilters}
                      className="text-xs text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors font-medium"
                    >
                      Réinitialiser tout
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── RESULTS COUNT ── */}
      {!filtersOpen && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-5 mb-1">
          <p className="text-xs text-gray-400">
            {filteredCars.length} voiture{filteredCars.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* ── GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-5">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-red-100" />
              <div className="absolute inset-0 rounded-full border-t-2 border-red-600 animate-spin" />
            </div>
            <p className="text-gray-400 text-sm tracking-widest uppercase animate-pulse">Chargement…</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-40 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-6">
              <CarIcon className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-xl font-semibold text-gray-700">Aucun résultat</p>
            <p className="text-gray-400 mt-2 text-sm">Modifiez vos filtres pour afficher des véhicules</p>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCars.map((car, index) => (
                <CarCard key={car._id} car={car} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Car Card
───────────────────────────────────────────── */
function CarCard({ car, index }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-red-200 hover:shadow-xl hover:shadow-red-50/60 transition-all duration-500 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 sm:h-56 overflow-hidden bg-gray-100">
        {car.images && car.images.length > 0 ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-t-2 border-red-500 animate-spin opacity-30" />
              </div>
            )}
            <img
              src={car.images[0]}
              alt={`${car.brand} ${car.model}`}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CarIcon className="w-16 h-16 text-gray-200" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

        {/* Year badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 text-xs font-bold tracking-wide shadow-sm">
          {car.year}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-gray-900 leading-tight tracking-tight">
          {car.brand} <span className="text-red-600">{car.model}</span>
        </h3>

        {car.colors?.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3">
            <Palette size={13} className="text-gray-400 shrink-0" />
            <div className="flex items-center gap-1 flex-wrap">
              {car.colors.slice(0, 5).map((color, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                  {color}
                </span>
              ))}
              {car.colors.length > 5 && (
                <span className="text-[10px] text-gray-400">+{car.colors.length - 5}</span>
              )}
            </div>
          </div>
        )}

        {car.description && (
          <p className="mt-3 text-gray-500 text-xs leading-relaxed line-clamp-2">{car.description}</p>
        )}

        <Link
          to={`/cars/${car._id}`}
          className="mt-5 block w-full py-3 text-center text-sm font-semibold rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300"
        >
          Voir les détails
        </Link>
      </div>
    </motion.div>
  );
}