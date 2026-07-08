import CropCard from "./CropCard";

function Card({ name, season, soil, water }) {
  return <CropCard crop={{ name, season, soil, water }} />;
}

export default Card;
