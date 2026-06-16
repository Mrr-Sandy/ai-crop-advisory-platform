function Card({ title, description }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-green-700">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}

export default Card;