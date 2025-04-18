import React from "react";

interface ControlFeatureProps {
  imageSrc: string;
  imageAlt: string;
  imageWidth: string;
  imageHeight: string;
  title: string;
  description: string;
}

const ControlFeature: React.FC<ControlFeatureProps> = ({
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  title,
  description,
}) => {
  return (
    <div className="flex gap-10 justify-center items-center mb-10 max-md:flex-col max-sm:gap-5">
      <img
        src={imageSrc}
        className={`h-[${imageHeight}] w-[${imageWidth}]`}
        alt={imageAlt}
      />
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-xl max-w-[400px] text-neutral-200">{description}</p>
    </div>
  );
};

export default ControlFeature;
