import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroBgPc from "../../assets/HeroBgMobile.mp4";
import HeroBgMobile from "../../assets/HeroBgMobile.mp4";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source media="(max-width: 768px)" src={HeroBgMobile} type="video/mp4" />
          <source src={HeroBgPc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl text-center text-white">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 border border-red-500/30 text-red-500 rounded-full text-sm font-semibold tracking-widest mb-6"
          >
            SHOWROOM PREMIUM
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
          >
            Trouvez votre{" "}
            <span className="text-red-600">voiture idéale</span>
            <br />
            sans compromis
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
          >
            Explorez une sélection exclusive de véhicules alliant performance,
            design et fiabilité. Chaque modèle est soigneusement sélectionné
            pour offrir une expérience premium.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/cars"
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              Explorer les voitures
            </Link>

            <Link
              to="/brands"
              className="px-8 py-4 border border-white/30 text-white rounded-2xl hover:bg-white hover:text-black transition-all"
            >
              Voir les marques
            </Link>
          </motion.div>

          {/* Stats / Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-400"
          >
            <span>+200 véhicules</span>
            <span>Qualité vérifiée</span>
            <span>Livraison rapide</span>
          </motion.div>

        </div>
      </div>
    </section>
  );
}