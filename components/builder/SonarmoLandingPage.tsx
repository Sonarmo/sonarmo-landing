"use client";

import React from "react";
import Head from "next/head";
import Header from "./Header";
import HeroSection from "./HeroSection";
import ConceptSection from "./ConceptSection";
import ControlSection from "./ControlSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

const SonarmoLandingPage = () => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
      </Head>
      <div className="mx-auto w-full max-w-none text-white bg-neutral-900 max-md:max-w-[991px] max-sm:max-w-screen-sm">
        <Header />
        <HeroSection />
        <ConceptSection />
        <ControlSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
};

export default SonarmoLandingPage;