"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Phone, Instagram, Facebook, Music } from "lucide-react";
import Logo from "../../assets/Logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0B] text-white pt-20 pb-10 px-6">

      <div className="max-w-7xl mx-auto">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* BRAND */}
          <div className="space-y-5">

            <img
              src={Logo}
              alt="Showroom"
              className="h-32 object-contain rounded-full"
            />
          
            <p className="text-gray-400 text-sm leading-relaxed">
              Découvrez un showroom automobile moderne spécialisé dans la vente
              de véhicules sélectionnés pour leur performance, design et fiabilité.
            </p>

          </div>

          {/* NAVIGATION */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Navigation</h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Accueil
                </Link>
              </li>

              <li>
                <Link to="/cars" className="hover:text-white transition">
                  Voitures
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:text-white transition">
                  À propos
                </Link>
              </li>

              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Contact</h3>

            <div className="space-y-4 text-gray-400 text-sm">

              {/* PHONE (important conversion element) */}
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-red-500" />
                <a
                  href="tel:+213552240944"
                  className="hover:text-white transition"
                >
                  +213 552 24 09 44
                </a>
              </div>

              <p className="text-xs text-gray-500">
                Disponible tous les jours pour vos demandes
              </p>

            </div>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Suivez-nous</h3>

            <div className="space-y-4">

              <a
                href="https://www.instagram.com/fodilautomobile/"
                target="_blank"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition"
              >
                <Instagram size={18} />
                Instagram
              </a>

              <a
                href="https://web.facebook.com/p/Fodil-Automobile-100057527526063/?_rdc=1&_rdr#"
                target="_blank"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition"
              >
                <Facebook size={18} />
                Facebook
              </a>

              <a
                href="https://www.tiktok.com/@fares16sidifredj"
                target="_blank"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition"
              >
                <Music size={18} />
                TikTok
              </a>

            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">

          <p>
            © {new Date().getFullYear()} Faudil Auto. Tous droits réservés.
          </p>

          <p>
            Designed & developed with precision
          </p>

        </div>

      </div>
    </footer>
  );
}