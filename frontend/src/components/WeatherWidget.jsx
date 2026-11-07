function WeatherWidget({ weather }) {
  if (!weather) {
    return null;
  }

  return (
    <section className="border-t border-ink pt-4">
      <h2 className="text-title">Weather insights</h2>
      <p className="mt-2 text-muted">{weather.summary}</p>
    </section>
  );
}

export default WeatherWidget;
