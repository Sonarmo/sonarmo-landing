import React from "react";

interface ConceptItemProps {
  iconSrc: string;
  iconAlt: string;
  description: string;
}

const ConceptItem: React.FC<ConceptItemProps> = ({
  iconSrc,
  iconAlt,
  description,
}) => {
  return (
    <>
      <img src={iconSrc} className="h-[100px] w-[100px]" alt={iconAlt} />
      <p className="text-xl max-w-[300px] text-neutral-200">{description}</p>
    </>
  );
};

export default ConceptItem;
