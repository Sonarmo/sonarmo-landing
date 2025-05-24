"use client";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="px-10 py-16 border-t border-solid bg-neutral-900 border-t-white border-t-opacity-30">
      <div className="flex justify-between items-center mb-10 max-md:flex-col max-md:items-center max-sm:gap-5">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/9aefe62f19e80495cfe1f0243a353d67b0f25a7d?placeholderIfAbsent=true"
          className="w-10 h-10"
          alt="Instagram"
        />
        <div className="text-base text-white">
          <span>Sonarmo Team</span>
          <nav>
            <a href="#" className="block text-sm cursor-pointer text-stone-300">
              A propos de nous
            </a>
            <a href="#" className="block text-sm cursor-pointer text-stone-300">
              Nous contacter
            </a>
          </nav>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/5d7bbd0fc32a42a6945a3035ffd535dabd70b501?placeholderIfAbsent=true"
          className="h-[50px] w-[100px]"
          alt="Footer Logo"
        />
      </div>
      <div className="flex justify-between items-center max-md:flex-col max-md:items-center">
        <p className="text-sm text-stone-300">
          Terms of Use &amp; Privacy Policy
        </p>
        <p className="text-sm text-stone-300">
          ©2025 Sonarmo Team. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
