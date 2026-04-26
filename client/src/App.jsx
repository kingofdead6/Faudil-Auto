import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import Navbar from "./Components/Shared/NavBar";
import Footer from "./Components/Shared/Footer";

import ProductsPage from "./Components/Products/Products";   

import Login from "./Pages/Login";
import ProtectedRoute from "./Components/Shared/ProtectedRoute";

import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminUsers from "./Components/Admin/AdminUsers";

import NotFound from "./Pages/NotFound";
import ScrollToTop from "./Components/Shared/ScrollToTop";
import Aboutus from "./Pages/Aboutus";
import AdminGallery from "./Components/Admin/AdminGallery";
import ContactPage from "./Pages/Contact.tsx";
import AdminContactMessages from "./Components/Admin/AdminContactMessages.jsx";
import AdminCarNames from "./Components/Admin/AdminCarName.jsx";
import AdminCars from "./Components/Admin/AdminCars.jsx";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />           
        <Route path="/about" element={<Aboutus />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sell-us-something" element={<ContactPage />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/car-names" element={<AdminCarNames />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/cars" element={<AdminCars />} />
          <Route path="/admin/gallery" element={<AdminGallery />} /> 
          <Route path="/admin/contacts" element={<AdminContactMessages />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;