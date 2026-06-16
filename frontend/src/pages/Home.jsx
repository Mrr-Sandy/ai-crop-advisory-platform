import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <section className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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