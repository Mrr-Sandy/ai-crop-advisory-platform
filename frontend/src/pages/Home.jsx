import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <Card
            title="Crop Prediction"
            description="AI-based recommendations for better crop selection."
          />

          <Card
            title="Weather Insights"
            description="Track weather conditions for smart farming decisions."
          />
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
