function WeatherWidget({ weather }) {
  if (!weather) {
    return null;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
        Weather insights
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {weather.summary}
      </p>
    </section>
  );
}

export default WeatherWidget;
