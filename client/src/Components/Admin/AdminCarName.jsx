import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Plus, Trash2, Car, Loader2, Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCarNames() {
  const [names, setNames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchNames();
  }, []);

  const fetchNames = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/car-names`);
      setNames(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des marques");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Seules les images sont autorisées");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 8MB");
      return;
    }

    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImagePreview = () => {
    setNewImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setNewName("");
    setNewImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newImage) {
      toast.error("Le nom et l'image sont obligatoires");
      return;
    }

    const formData = new FormData();
    formData.append("name", newName.trim());
    formData.append("image", newImage);

    try {
      setIsSubmitting(true);
      await axios.post(`${API_BASE_URL}/car-names`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      closeModal();
      fetchNames();
      toast.success("Marque ajoutée avec succès");
    } catch (err) {
      const message = err.response?.data?.message || "Erreur lors de l'ajout";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette marque ?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/car-names/${id}`);
      setNames((prev) => prev.filter((n) => n._id !== id));
      toast.success("Marque supprimée");
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-semibold tracking-widest mb-4">
              <Car className="w-4 h-4" />
              CONFIGURATION
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
              Marques <span className="text-red-600">Automobiles</span>
            </h1>
            <p className="mt-3 text-gray-600 text-lg">
              Gérez les marques avec leurs logos officiels
            </p>
          </div>

          {/* Add Button */}
          <button
            onClick={openModal}
            className="cursor-pointer flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-red-100 transition-all active:scale-95"
          >
            <Plus className="w-6 h-6" />
            Ajouter une marque
          </button>
        </div>

        {/* Brands Grid */}
        {isLoading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin w-12 h-12 text-red-600" />
          </div>
        ) : names.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
              {names.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white border border-gray-100 hover:border-red-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-56 bg-gray-50 flex items-center justify-center p-10 border-b border-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-6 flex items-center justify-between">
                    <h3 className="font-bold text-2xl text-gray-900 tracking-tight">
                      {item.name}
                    </h3>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="cursor-pointer p-3 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-32 bg-white border border-dashed border-gray-200 rounded-[3rem]">
            <Car className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <p className="text-gray-500 text-xl font-medium">Aucune marque enregistrée pour le moment</p>
          </div>
        )}
      </div>

      {/* Add Brand Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Nouvelle marque</h2>
                    <p className="text-gray-500 text-sm">Ajoutez une marque avec son logo</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="cursor-pointer text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleAdd} className="p-8 space-y-8">
                {/* Name Field */}
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Nom de la marque
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Ferrari, Audi, Renault..."
                    className="w-full bg-white border border-gray-200 focus:border-red-500 rounded-2xl px-6 py-4 text-lg placeholder-gray-400 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Logo de la marque
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-red-400 bg-gray-50 hover:bg-white rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full p-8">
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImagePreview(); }}
                          className="absolute top-6 right-6 bg-white shadow hover:bg-red-50 p-3 rounded-full text-gray-600 hover:text-red-600 transition-all"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow mb-6 group-hover:scale-110 transition-transform">
                          <Upload className="w-10 h-10 text-gray-400 group-hover:text-red-500 transition-colors" />
                        </div>
                        <p className="text-gray-700 font-medium text-lg">Cliquez pour sélectionner une image</p>
                        <p className="text-gray-400 text-sm mt-2">PNG ou JPG • Maximum 8 Mo</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="cursor-pointer flex-1 py-4 text-gray-700 font-semibold border border-gray-200 hover:bg-gray-100 rounded-2xl transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newName.trim() || !newImage}
                    className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        Ajout en cours...
                      </>
                    ) : (
                      "Ajouter la marque"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}