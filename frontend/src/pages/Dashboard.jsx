import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="mt-4 break-words">
          View crop insights, recommendations and analytics here.
        </p>
      </main>

      <Footer />
    </>
  );
}

export default Dashboard;
