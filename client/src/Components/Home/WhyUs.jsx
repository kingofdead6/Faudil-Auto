"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Car, BadgeDollarSign, Headphones } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Qualité garantie",
    description:
      "Chaque véhicule est inspecté et validé pour garantir fiabilité et performance.",
  },
  {
    icon: Car,
    title: "Large choix",
    description:
      "Une sélection variée de modèles, marques et configurations adaptées à tous les besoins.",
  },
  {
    icon: BadgeDollarSign,
    title: "Prix compétitifs",
    description:
      "Des offres étudiées pour vous proposer le meilleur rapport qualité/prix.",
  },
  {
    icon: Headphones,
    title: "Service client",
    description:
      "Une équipe dédiée pour vous accompagner avant, pendant et après votre achat.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-semibold tracking-widest mb-4">
            POURQUOI NOUS
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
            Pourquoi choisir notre showroom ?
          </h2>

          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Nous mettons l’accent sur la qualité, la transparence et
            l’expérience client pour vous offrir le meilleur.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group bg-white border border-gray-100 hover:border-red-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 mb-6 rounded-2xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition">
                  <Icon className="w-7 h-7 text-red-600" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}