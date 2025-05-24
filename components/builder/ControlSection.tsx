"use client";
import React from "react";
import ControlFeature from "./ControlFeature";

const ControlSection: React.FC = () => {
  const features = [
    {
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/61c6487d198084e4bc56fb0e2592696962ec0f32?placeholderIfAbsent=true",
      imageAlt: "Chart",
      imageWidth: "300px",
      imageHeight: "200px",
      title: "Analysez l'impact de votre ambiance sonore",
      description:
        "Suivez en temps réel comment la musique influence l'atmosphère de votre lieu. Grâce à des graphiques clairs, Sonarmo vous montre les moments clés où la musique capte l'attention, renforce l'énergie ou détend l'ambiance.",
    },
    {
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/dc85e23fccda2552dc8a1fecc5e5f6d02f0c4cb7?placeholderIfAbsent=true",
      imageAlt: "Phone",
      imageWidth: "150px",
      imageHeight: "300px",
      title: "Contrôlez votre ambiance… depuis votre poche",
      description:
        "Changez de playlist, ajustez le volume ou l'énergie en un geste, où que vous soyez. Le player Sonarmo vous donne le pouvoir de gérer l'ambiance de votre lieu en temps réel, sur mobile, tablette ou desktop.",
    },
  ];

  return (
    <section className="px-0 py-16 text-center">
      <h2 className="mb-10 text-6xl">Un contrôle complet</h2>
      {features.map((feature, index) => (
        <ControlFeature
          key={index}
          imageSrc={feature.imageSrc}
          imageAlt={feature.imageAlt}
          imageWidth={feature.imageWidth}
          imageHeight={feature.imageHeight}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </section>
  );
};

export default ControlSection;
