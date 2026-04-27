"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, PhoneCall, Car } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-24 px-6 bg-[#0B0B0B] relative overflow-hidden">

      {/* subtle glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15),transparent_60%)]" />

      <div className="relative max-w-5xl mx-auto text-center text-white">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 border border-red-500/30 text-red-500 rounded-full text-sm font-semibold tracking-widest mb-6"
        >
          PRÊT À COMMENCER ?
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black leading-tight"
        >
          Trouvez votre voiture idéale dès maintenant
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto"
        >
          Explorez notre catalogue, découvrez des véhicules sélectionnés avec soin et passez à l’action en quelques clics.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >

          <Link
            to="/cars"
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl transition-all active:scale-95"
          >
            <Car className="w-5 h-5" />
            Voir les voitures
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            to="/contact"
            className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white hover:bg-white hover:text-black rounded-2xl transition-all"
          >
            <PhoneCall className="w-5 h-5" />
            Nous contacter
          </Link>

        </motion.div>

        {/* micro trust line */}
        <div className="mt-10 text-sm text-gray-500">
          Réponse rapide • Support client • Service professionnel
        </div>

      </div>
    </section>
  );
}