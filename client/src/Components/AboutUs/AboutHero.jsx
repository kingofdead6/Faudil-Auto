"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative  py-28 px-6 bg-[#0B0B0B] text-white overflow-hidden">

      {/* subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_60%)]" />

      <div className="relative max-w-5xl mx-auto text-center pt-20">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-1.5 bg-red-600/10 border border-red-500/30 text-red-500 rounded-full text-sm font-semibold tracking-widest mb-6"
        >
          À PROPOS DE NOUS
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black leading-tight"
        >
          Un showroom automobile{" "}
          <span className="text-red-600">moderne et fiable</span>
        </motion.h1>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto"
        >
          Nous sommes spécialisés dans la sélection et la vente de véhicules
          soigneusement choisis pour leur performance, leur design et leur
          fiabilité. Notre objectif est simple : offrir une expérience
          automobile fluide, transparente et premium.
        </motion.p>

      </div>
    </section>
  );
}