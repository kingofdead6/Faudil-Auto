"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Trash2, Eye, Mail, Phone, Calendar, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/contact`);
      setMessages(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce message de contact ?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/contact/${id}`);
      toast.success("Message supprimé avec succès");
      fetchMessages();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center mt-20">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-500">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-semibold tracking-widest mb-4">
            <Mail className="w-4 h-4" />
            CONTACT
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
            Messages de <span className="text-red-600">Contact</span>
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            Consultez et gérez les messages reçus via le formulaire de contact
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-32 bg-white border border-dashed border-gray-200 rounded-[3rem]">
            <Mail className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <p className="text-gray-500 text-xl font-medium">Aucun message de contact pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white border border-gray-100 hover:border-red-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <h3 className="font-bold text-xl text-gray-900 tracking-tight line-clamp-2">
                          {msg.name}
                        </h3>
                      
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-5">
                      <p className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        {msg.email}
                      </p>
                      {msg.phone && (
                        <p className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          {msg.phone}
                        </p>
                      )}
                    </div>

                    <p className="text-gray-700 line-clamp-4 leading-relaxed mb-6">
                      {msg.message}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-4 border-t border-gray-100">
                      <Calendar size={14} />
                      {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detailed Message Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedMessage.subject || "Message sans sujet"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">De {selectedMessage.name}</p>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{selectedMessage.email}</p>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <p className="text-gray-500 mb-1">Téléphone</p>
                      <p className="font-medium text-gray-900">{selectedMessage.phone}</p>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <p className="text-gray-500 mb-1">Date d'envoi</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Message reçu :</h3>
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 p-6">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="w-full py-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-2xl transition-all"
                >
                  Fermer le message
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}