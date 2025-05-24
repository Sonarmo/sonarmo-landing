"use client";
import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="flex justify-center items-center px-0 py-16 max-md:flex-col max-sm:px-0 max-sm:py-10">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/08f5a999d81236ce7ca113083d57768313c108c8?placeholderIfAbsent=true"
        className="mr-10 h-[188px] w-[149px] max-md:mb-5"
        alt="Main Logo"
      />
      <div className="mb-9 text-center">
        <h1 className="text-7xl italic font-semibold">Sonarmo</h1>
        <h2 className="mx-0 my-5 text-7xl font-medium max-sm:mr-0 max-sm:w-full max-sm:h-auto max-sm:grow-0 max-sm:max-w-[379px]">
          <p>
            <span className="ql-cursor">﻿</span>﻿Intelligence Atmosphérique
          </p>
        </h2>
        <p className="mb-10 text-lg text-neutral-200">
          Chaque lieu a une histoire, une identité unique. Sonarmo crée une
          ambiance sonore personnalisée, pensée spécialement pour refléter
          l&apos;âme de votre espace et offrir une expérience immersive
          incomparable.
        </p>
        <button className="px-7 py-4 text-xl font-medium text-white rounded-2xl cursor-pointer">
          Découvrir
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
