"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Car, CreditCard, Truck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Explorez",
    description:
      "Parcourez notre catalogue et trouvez le véhicule qui correspond à vos besoins.",
  },
  {
    icon: Car,
    title: "Sélectionnez",
    description:
      "Choisissez votre voiture et consultez tous les détails, options et couleurs.",
  },
  {
    icon: CreditCard,
    title: "Confirmez",
    description:
      "Validez votre choix et échangez avec notre équipe pour finaliser l’achat.",
  },
  {
    icon: Truck,
    title: "Livraison",
    description:
      "Recevez votre véhicule rapidement avec un suivi complet jusqu’à la livraison.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-widest text-red-600 font-semibold mb-3">
            PROCESSUS
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900">
            Comment ça fonctionne ?
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Un processus simple, rapide et transparent pour acquérir votre véhicule en toute sérénité.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative">

          {/* connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-px bg-gray-200 z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative z-10 text-center"
              >
                {/* Icon */}
                <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100 mb-6">
                  <Icon className="w-7 h-7 text-red-600" />
                </div>

                {/* Step number */}
                <div className="text-sm text-gray-400 mb-2">
                  Étape {index + 1}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}