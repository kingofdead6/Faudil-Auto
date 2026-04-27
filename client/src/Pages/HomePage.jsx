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
import HowItWorks from "../Components/Home/HowItWorks";
import CTA from "../Components/Home/CTA";



const HomePage = () => {
  return (
        <>
          <Hero />
          <WhyUs />
          <Showroom />
          <BrandsCarousel />
          <CTA />
          <Gallery />
        </>
  );
};

export default HomePage;