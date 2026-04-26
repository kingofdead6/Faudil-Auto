import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { Plus, Trash2, Car, Loader2, Upload, X, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AVAILABLE_COLORS = [
  { name: "Noir", hex: "#1a1a1a" },
  { name: "Blanc", hex: "#f8f9fa" },
  { name: "Gris", hex: "#6b7280" },
  { name: "Gris Anthracite", hex: "#374151" },
  { name: "Bleu", hex: "#3b82f6" },
  { name: "Bleu Nuit", hex: "#1e40af" },
  { name: "Rouge", hex: "#ef4444" },
  { name: "Rouge Passion", hex: "#b91c1c" },
  { name: "Vert", hex: "#22c55e" },
  { name: "Vert Émeraude", hex: "#10b981" },
  { name: "Jaune", hex: "#eab308" },
  { name: "Orange", hex: "#f97316" },
  { name: "Rose", hex: "#ec4899" },
  { name: "Violet", hex: "#8b5cf6" },
  { name: "Marron", hex: "#78350f" },
  { name: "Beige", hex: "#d2b48c" },
  { name: "Argent", hex: "#9ca3af" },
  { name: "Or", hex: "#d97706" },
];

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [carNames, setCarNames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCar, setEditingCar] = useState(null);   // null = add mode, object = edit mode

  // Form States
  const [selectedBrand, setSelectedBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [images, setImages] = useState([]);           // New files to upload
  const [imagePreviews, setImagePreviews] = useState([]); 
  const [existingImages, setExistingImages] = useState([]); // Current images (for edit)
  const [removeImages, setRemoveImages] = useState([]);     // URLs to remove

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCars();
    fetchCarNames();
  }, []);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/cars`);
      setCars(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des voitures");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCarNames = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/car-names`);
      setCarNames(res.data.map(item => item.name));
    } catch (err) {
      toast.error("Erreur lors du chargement des marques");
    }
  };

  // Open modal for Add
  const openAddModal = () => {
    resetForm();
    setEditingCar(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const openEditModal = (car) => {
    setEditingCar(car);
    
    setSelectedBrand(car.brand || "");
    setModel(car.model || "");
    setYear(car.year || "");
    setDescription(car.description || "");
    
    // Convert colors to our format with hex
    const initialColors = car.colors?.map(colorName => {
      const found = AVAILABLE_COLORS.find(c => c.name === colorName);
      return found || { name: colorName, hex: "#6b7280" };
    }) || [];
    setSelectedColors(initialColors);

    setExistingImages(car.images || []);
    setRemoveImages([]);
    setImages([]);
    setImagePreviews([]);
    
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast.error("Seules les images sont autorisées");
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Chaque image ne doit pas dépasser 10MB");
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (url) => {
    setRemoveImages(prev => [...prev, url]);
    setExistingImages(prev => prev.filter(img => img !== url));
  };

  const toggleColor = (color) => {
    const isSelected = selectedColors.some(c => c.name === color.name);
    if (isSelected) {
      setSelectedColors(prev => prev.filter(c => c.name !== color.name));
    } else {
      setSelectedColors(prev => [...prev, color]);
    }
  };

  const resetForm = () => {
    setSelectedBrand("");
    setModel("");
    setYear("");
    setDescription("");
    setSelectedColors([]);
    setImages([]);
    setImagePreviews([]);
    setExistingImages([]);
    setRemoveImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCar(null);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBrand || !model || !description || !year || selectedColors.length === 0) {
      toast.error("Tous les champs obligatoires doivent être remplis");
      return;
    }

    const formData = new FormData();
    formData.append("brand", selectedBrand);
    formData.append("model", model.trim());
    formData.append("description", description.trim());
    formData.append("year", year);
    formData.append("colors", JSON.stringify(selectedColors.map(c => c.name)));

    // For Edit: send images to remove
    if (editingCar && removeImages.length > 0) {
      formData.append("removeImages", JSON.stringify(removeImages));
    }

    // Append new images (both add and edit)
    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      setIsSubmitting(true);

      if (editingCar) {
        // UPDATE
        await axios.put(`${API_BASE_URL}/cars/${editingCar._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Voiture mise à jour avec succès");
      } else {
        // CREATE
        if (images.length === 0) {
          toast.error("Au moins une image est requise");
          setIsSubmitting(false);
          return;
        }
        await axios.post(`${API_BASE_URL}/cars`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Voiture ajoutée avec succès");
      }

      closeModal();
      fetchCars();
    } catch (err) {
      const message = err.response?.data?.message || "Une erreur est survenue";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette voiture ?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/cars/${id}`);
      setCars((prev) => prev.filter((c) => c._id !== id));
      toast.success("Voiture supprimée");
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
              <Car className="w-4 h-4" />
              CONFIGURATION
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
              Voitures <span className="text-red-600">Disponibles</span>
            </h1>
            <p className="mt-3 text-gray-600 text-lg">
              Gérez le catalogue complet de véhicules
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="cursor-pointer flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-red-100 transition-all active:scale-95"
          >
            <Plus className="w-6 h-6" />
            Ajouter une voiture
          </button>
        </div>

        {/* Cars Grid */}
        {isLoading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin w-12 h-12 text-red-600" />
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {cars.map((car) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white border border-gray-100 hover:border-red-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-56 bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100 relative">
                    {car.images?.length > 0 ? (
                      <img
                        src={car.images[0]}
                        alt={`${car.brand} ${car.model}`}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Car className="w-20 h-20 text-gray-300" />
                    )}
                    {car.images?.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full">
                        +{car.images.length - 1}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-2xl text-gray-900 tracking-tight">
                        {car.brand} {car.model}
                      </h3>
                      <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                        {car.year}
                      </span>
                    </div>

                    <p className="text-gray-600 line-clamp-2 text-sm mb-4 min-h-[42px]">
                      {car.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {car.colors?.map((colorName, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {colorName}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(car)}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-all"
                      >
                        <Edit3 size={18} />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={18} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-32 bg-white border border-dashed border-gray-200 rounded-[3rem]">
            <Car className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <p className="text-gray-500 text-xl font-medium">Aucune voiture enregistrée pour le moment</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingCar ? "Modifier la voiture" : "Nouvelle voiture"}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {editingCar ? "Mettez à jour les informations" : "Ajoutez un véhicule au catalogue"}
                    </p>
                  </div>
                </div>
                <button onClick={closeModal} className="cursor-pointer text-gray-400 hover:text-red-600">
                  <X size={28} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Brand, Model, Year - Same as before */}
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Marque</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-red-500 rounded-2xl px-6 py-4 outline-none text-lg"
                    required
                  >
                    <option value="">Sélectionnez une marque</option>
                    {carNames.map((name, idx) => (
                      <option key={idx} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Modèle</label>
                    <input type="text" value={model} onChange={(e) => setModel(e.target.value)}
                      placeholder="Ex: 911 GT3" className="w-full bg-white border border-gray-200 focus:border-red-500 rounded-2xl px-6 py-4 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Année</label>
                    <input type="number" value={year} onChange={(e) => setYear(e.target.value)}
                      placeholder="2025" min="1950" max="2030" className="w-full bg-white border border-gray-200 focus:border-red-500 rounded-2xl px-6 py-4 outline-none" required />
                  </div>
                </div>

                {/* Visual Color Picker */}
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-3">
                    Couleurs disponibles <span className="text-red-600">(cliquez pour sélectionner)</span>
                  </label>
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-4">
                    {AVAILABLE_COLORS.map((color) => {
                      const isSelected = selectedColors.some(c => c.name === color.name);
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => toggleColor(color)}
                          className={`group relative flex flex-col items-center transition-all ${isSelected ? 'scale-110' : 'hover:scale-110'}`}
                        >
                          <div
                            className={`w-12 h-12 rounded-2xl border-4 transition-all shadow-sm ${
                              isSelected ? 'border-red-600 scale-110 shadow-red-200' : 'border-white hover:border-gray-200'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-[10px] text-gray-600 mt-1.5 font-medium text-center leading-tight">
                            {color.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedColors.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                      <p className="text-sm text-gray-600 mb-2">Couleurs sélectionnées :</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedColors.map((color, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl text-sm border border-gray-100">
                            <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: color.hex }} />
                            {color.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez le véhicule..."
                    rows={4}
                    className="w-full bg-white border border-gray-200 focus:border-red-500 rounded-3xl px-6 py-4 outline-none resize-y"
                    required
                  />
                </div>

                {/* Images Section */}
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-3">
                    Photos du véhicule
                  </label>

                  {/* Existing Images (Edit mode only) */}
                  {existingImages.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-3">Images actuelles :</p>
                      <div className="grid grid-cols-3 gap-4">
                        {existingImages.map((url, idx) => (
                          <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-200">
                            <img src={url} alt="current" className="w-full h-28 object-cover" />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(url)}
                              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Upload */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-red-400 bg-gray-50 hover:bg-white rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden"
                  >
                    {imagePreviews.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4 p-6 w-full h-full overflow-auto">
                        {imagePreviews.map((src, idx) => (
                          <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                            <img src={src} alt={`preview-${idx}`} className="w-full h-28 object-cover" />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeNewImage(idx); }}
                              className="absolute top-2 right-2 bg-white shadow p-1.5 rounded-full text-red-600 hover:bg-red-50"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 group-hover:text-red-500 transition-colors mb-4" />
                        <p className="text-gray-700 font-medium text-lg">Cliquez pour ajouter de nouvelles photos</p>
                        <p className="text-gray-400 text-sm mt-1">PNG / JPG • Maximum 10 Mo par image</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="cursor-pointer flex-1 py-4 text-gray-700 font-semibold border border-gray-200 hover:bg-gray-100 rounded-2xl transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        {editingCar ? "Mise à jour..." : "Ajout en cours..."}
                      </>
                    ) : (
                      editingCar ? "Enregistrer les modifications" : "Ajouter la voiture"
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