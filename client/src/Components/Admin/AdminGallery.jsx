"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Trash2, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/gallery`);
      setImages(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement de la galerie");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      await axios.post(`${API_BASE_URL}/gallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`${files.length} image(s) ajoutée(s) avec succès`);
      fetchGallery();
    } catch (err) {
      toast.error("Erreur lors de l'upload des images");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette image de la galerie ?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/gallery/${id}`);
      toast.success("Image supprimée avec succès");
      fetchGallery();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-semibold tracking-widest mb-4">
              <ImageIcon className="w-4 h-4" />
              GALERIE
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
              Galerie <span className="text-red-600">Photos</span>
            </h1>
            <p className="mt-3 text-gray-600 text-lg">
              Gérez les images de votre galerie
            </p>
          </div>

          {/* Upload Button */}
          <label className="cursor-pointer flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-red-100 transition-all active:scale-95">
            <Upload size={24} />
            <span>Ajouter des images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {/* Uploading Status */}
        {uploading && (
          <div className="flex items-center gap-3 text-red-600 mb-8">
            <Loader2 className="animate-spin w-5 h-5" />
            <span className="font-medium">Upload des images en cours...</span>
          </div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin w-12 h-12 text-red-600" />
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
              {images.map((img) => (
                <motion.div
                  key={img._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-white border border-gray-100 hover:border-red-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-square relative">
                    <img
                      src={img.image}
                      alt="Gallery"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                  </div>

                  <button
                    onClick={() => handleDelete(img._id)}
                    className="cursor-pointer absolute top-4 right-4 bg-white/90 hover:bg-red-600 hover:text-white text-red-600 p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-md"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-32 bg-white border border-dashed border-gray-200 rounded-[3rem]">
            <ImageIcon className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <p className="text-gray-500 text-xl font-medium">Aucune image dans la galerie</p>
            <p className="text-gray-400 mt-2">Ajoutez vos premières photos ci-dessus</p>
          </div>
        )}
      </div>
    </div>
  );
}