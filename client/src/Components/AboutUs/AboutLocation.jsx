"use client";

import React from "react";
import { MapPin } from "lucide-react";

export default function AboutLocation() {
  return (
    <section className="py-24 px-6 bg-white">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">
            Venez nous rendre visite
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Découvrez notre showroom et explorez nos véhicules directement sur place.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">

          {/* INFO CARD */}
          <div className="lg:col-span-4">
            <div className="h-full bg-[#0B0B0B] text-white rounded-3xl p-8 flex flex-col justify-center">

              <div className="flex items-center gap-2 text-red-500 mb-4">
                <MapPin className="w-5 h-5" />
                Localisation
              </div>

              <h3 className="text-2xl font-bold mb-4">
                FAUDIL Auto Showroom
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Venez découvrir notre sélection de véhicules directement dans notre showroom.
                Une équipe est disponible pour vous accueillir et vous accompagner.
              </p>

              <div className="space-y-2 text-sm text-gray-400">
                <p>📍 Staoueli, Alger</p>
                <p>🚗 Accès facile & parking disponible</p>
                <p>🕒 Ouvert tous les jours</p>
              </div>

              {/* CTA */}
              <a
                href="https://www.google.com/maps"
                target="_blank"
                className="mt-8 inline-block text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-2xl transition"
              >
                Ouvrir dans Google Maps
              </a>

            </div>
          </div>

          {/* MAP */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-[450px] lg:h-full">

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3629.2928119283065!2d2.8433363999999997!3d36.7599777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fbde35407c2bd%3A0x13ef6897bd56e58d!2sFAUDIL%20Auto!5e1!3m2!1sen!2sdz!4v1777254153970!5m2!1sen!2sdz"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="FAUDIL Auto Location"
              />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}