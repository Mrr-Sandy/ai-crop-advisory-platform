function Card({ name, season, soil, water }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
        {name}
      </h2>

      <p className="mt-2 text-gray-600 dark:text-gray-300">
        <strong>Season:</strong> {season}
      </p>

      <p className="text-gray-600 dark:text-gray-300">
        <strong>Soil:</strong> {soil}
      </p>

      <p className="text-gray-600 dark:text-gray-300">
        <strong>Water Requirement:</strong> {water}
      </p>
    </div>
  );
}

export default Card;
