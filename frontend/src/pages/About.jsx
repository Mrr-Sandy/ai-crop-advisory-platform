import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold">About</h1>
        <p className="mt-4">
          AI Crop Advisory Platform helps farmers make informed decisions using technology.
        </p>
      </main>

      <Footer />
    </>
  );
}

export default About;