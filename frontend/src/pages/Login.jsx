import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mt-4">
          Sign in to access your AI Crop Advisory dashboard.
        </p>
      </main>

      <Footer />
    </>
  );
}

export default Login;