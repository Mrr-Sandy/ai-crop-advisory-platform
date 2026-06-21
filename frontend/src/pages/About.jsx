import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-bold md:text-3xl">About</h1>
        <p className="mt-4 break-words">
          AI Crop Advisory Platform helps farmers make informed decisions using technology.
        </p>
      </main>

      <Footer />
    </>
  );
}

export default About;
