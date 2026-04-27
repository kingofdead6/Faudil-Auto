"use client";

import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Send, User, Mail, Phone, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/contact`, form);
      
      toast.success("Message envoyé avec succès ! Nous vous répondrons bientôt.", {
        position: "top-center",
        autoClose: 4000,
      });

      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      toast.error("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 md:p-14"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-50 text-red-600 rounded-full text-sm font-bold tracking-widest mb-4">
            CONTACTEZ-NOUS
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
            Parlons de votre projet
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Notre équipe est à votre écoute pour répondre à toutes vos questions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Jean Dupont"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-red-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="jean.dupont@email.com"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-red-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+33 6 12 34 56 78"
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-red-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Votre message *</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-5 text-gray-400" size={20} />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={8}
                placeholder="Bonjour, je souhaiterais obtenir plus d'informations sur une voiture ou prendre rendez-vous..."
                className="w-full pl-11 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:border-red-500 outline-none resize-y min-h-[180px] transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full py-5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-lg font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-red-100"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                Envoyer le message
                <Send size={22} />
              </>
            )}
          </motion.button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Nous vous répondrons dans les plus brefs délais
          </p>
        </form>
      </motion.div>
    </div>
  );
}