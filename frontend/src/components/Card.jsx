function Card({ title, description }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">{title}</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

export default Card;
