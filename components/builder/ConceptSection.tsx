"use client";
import React from "react";
import ConceptItem from "./ConceptItem";

const ConceptSection: React.FC = () => {
  const conceptItems = [
    {
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/832120505ab490084267bdd7c70a28faae77d3fd?placeholderIfAbsent=true",
      iconAlt: "AI Icon",
      description:
        "Ambiance propulsée par IA : sélection musicale en fonction du lieu, de l'heure, du type de clientèle…",
    },
    {
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/32fe076db061fdf07d43caeb238aaaac97667c66?placeholderIfAbsent=true",
      iconAlt: "Target Icon",
      description:
        "Identité sonore sur mesure : la musique reflète la personnalité du lieu et son univers.",
    },
    {
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/2c35601f7d8dd65ba2d4af9d257129652051d186?placeholderIfAbsent=true",
      iconAlt: "Thumb Icon",
      description:
        "Facile à utiliser : Contrôles complet depuis un tableau de bord simple et intuitif.",
    },
  ];

  return (
    <section className="px-0 py-16 text-center">
      <h2 className="mb-10 text-6xl font-medium">Le concept</h2>
      <div className="flex gap-10 justify-center items-center max-md:flex-col max-sm:gap-5">
        {conceptItems.map((item, index) => (
          <ConceptItem
            key={index}
            iconSrc={item.iconSrc}
            iconAlt={item.iconAlt}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

export default ConceptSection;
