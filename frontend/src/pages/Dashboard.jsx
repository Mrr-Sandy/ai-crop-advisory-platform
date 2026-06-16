import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-4">
          View crop insights, recommendations and analytics here.
        </p>
      </main>

      <Footer />
    </>
  );
}

export default Dashboard;