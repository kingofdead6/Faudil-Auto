"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Eye, Trophy, Users } from "lucide-react";

const items = [
  {
    icon: Shield,
    title: "Fiabilité",
    description:
      "Chaque véhicule est sélectionné et vérifié pour garantir une qualité irréprochable.",
  },
  {
    icon: Eye,
    title: "Transparence",
    description:
      "Nous affichons des informations claires et complètes sur chaque voiture.",
  },
  {
    icon: Trophy,
    title: "Excellence",
    description:
      "Nous visons une expérience premium à chaque étape du parcours client.",
  },
  {
    icon: Users,
    title: "Accompagnement",
    description:
      "Notre équipe vous guide du choix jusqu’à la livraison du véhicule.",
  },
];

export default function AboutMission() {
  return (
    <section className="py-24 px-6 bg-white">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">
            Notre mission
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Redéfinir l’expérience d’achat automobile avec transparence,
            simplicité et qualité.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {items.map((item, idx) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-100 hover:border-red-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
              >

                {/* Icon */}
                <div className="w-14 h-14 mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
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