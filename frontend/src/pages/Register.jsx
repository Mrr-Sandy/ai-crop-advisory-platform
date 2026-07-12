import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Button, Input } from "../components/ui";
import { registerUser } from "../api/auth";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      await registerUser(formData);
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      navigate("/login", {
        replace: true,
        state: { message: "Registration successful. Please login." },
      });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 dark:bg-slate-950">
        <section className="mx-auto grid min-h-[70vh] max-w-7xl items-center px-4 py-14 sm:px-6">
          <div className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              <UserPlus className="h-6 w-6" aria-hidden="true" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
              Create Account
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Create your account to access the AI Crop Advisory Platform.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <Input
                id="name"
                name="name"
                label="Name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                required
              />

              <Input
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />

              <Input
                id="password"
                name="password"
                label="Password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />

              {error ? (
                <p className="text-sm font-medium text-red-700 dark:text-red-300" role="alert">
                  {error}
                </p>
              ) : null}

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Create Account
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Register;
