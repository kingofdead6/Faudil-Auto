import React, { useState, useEffect } from "react";

import Hero from "../Components/Home/Hero";
import Categories from "../Components/Home/Categories";
import FAQ from "../Components/Home/FAQ";
import WhyChooseUs from "../Components/Home/WhyUs";
import Gallery from "../Components/Home/Gallery";
import CTASection from "../Components/Home/CTA";



const HomePage = () => {
  return (
        <>
          <Hero />
          <Categories />
          <WhyChooseUs />
          <Gallery />
          <FAQ />
        </>
  );
};

export default HomePage;