import CropCard from "./CropCard";

function Card({ name, season, soil, water, footer, className }) {
  return <CropCard crop={{ name, season, soil, water }} footer={footer} className={className} />;
}

export default Card;
