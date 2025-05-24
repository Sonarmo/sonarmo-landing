"use client";
import React from "react";

const ContactSection: React.FC = () => {
  return (
    <section className="px-0 py-16 mt-2.5 text-center">
      <h2 className="mb-5 text-6xl font-medium">Nous contacter</h2>
      <p className="mb-10 text-lg text-neutral-200">
        Une question, une idée, ou juste envie d&apos;en parler ? Faites-nous
        signe, on adore discuter !
      </p>
      <button className="px-7 py-4 text-xl font-medium text-white rounded-xl cursor-pointer">
        On s&apos;appelle ?
      </button>
    </section>
  );
};

export default ContactSection;
