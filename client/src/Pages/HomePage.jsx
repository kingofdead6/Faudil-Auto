import React, { useState, useEffect } from "react";

import Hero from "../Components/Home/Hero";
import Categories from "../Components/Home/Categories";
import FAQ from "../Components/Home/FAQ";
import WhyChooseUs from "../Components/Home/WhyUs";
import Gallery from "../Components/Home/Gallery";
import CTASection from "../Components/Home/CTA";
import WhyUs from "../Components/Home/WhyUs";
import Showroom from "../Components/Home/Showroom";
import BrandsCarousel from "../Components/Home/BrandsCarousel";



const HomePage = () => {
  return (
        <>
          <Hero />
          <WhyUs />
          <Showroom />
          <BrandsCarousel />
          <Categories />
          <Gallery />
          <FAQ />
        </>
  );
};

export default HomePage;