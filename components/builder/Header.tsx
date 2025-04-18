"use client";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-10 py-5 max-sm:p-5">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c12d4f2807bd8d64d79e349fc135cd613ac8a95?placeholderIfAbsent=true"
        className="h-12 w-[188px]"
        alt="Logo"
      />
      <nav className="flex gap-10 items-center max-sm:hidden">
        <div className="relative text-base text-white uppercase cursor-pointer">
          <span>Notre Service</span>
          <div className="absolute top-2/4 border-b border-l border-solid -rotate-45 -translate-y-2/4 border-b-white border-l-white h-[11px] right-[-15px] w-[11px]" />
        </div>
        <div className="relative text-base text-white uppercase cursor-pointer">
          Contactez-nous
        </div>
        <button className="flex gap-2.5 items-center text-base text-white uppercase cursor-pointer max-sm:hidden">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9068033205b9ea5b09feaba98893f78f91729743?placeholderIfAbsent=true"
            className="w-5 h-5"
            alt="Icon"
          />
          <span>Se connecter</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
