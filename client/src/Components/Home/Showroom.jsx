"use client";

import React from "react";
import { motion } from "framer-motion";
import ShowroomImg from "../../assets/Showroom.jpg"; // replace with your image

export default function Showroom() {
  return (
    <section className="py-24 px-6 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] overflow-hidden shadow-xl"
        >
          <img
            src={ShowroomImg}
            alt="Showroom automobile"
            className="w-full h-[500px] object-cover"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-semibold tracking-widest mb-6">
            EXPÉRIENCE
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">
            Une expérience showroom immersive
          </h2>

          {/* Description */}
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            Explorez nos véhicules comme si vous y étiez. Chaque modèle est
            présenté avec des images haute qualité, des détails précis et une
            interface fluide pour une expérience utilisateur exceptionnelle.
          </p>

          {/* Features list */}
          <div className="mt-8 space-y-4">
            {[
              "Galeries photos haute résolution",
              "Détails complets et transparents",
              "Navigation fluide et rapide",
              "Expérience optimisée mobile & desktop",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10">
            <a
              href="/cars"
              className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl shadow-lg shadow-red-200 transition-all active:scale-95"
            >
              Explorer les véhicules
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}