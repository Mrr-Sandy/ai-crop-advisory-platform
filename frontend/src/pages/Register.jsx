import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

      <main>
        <section className="pt-16 pb-24">
          <div className="shell grid items-start gap-12 lg:grid-cols-[5fr_6fr] lg:gap-24">
            <div className="min-w-0">
              <h1 className="text-display-s">
              Create Account
            </h1>

            <p className="lead mt-6 text-muted">
              Create your account to access the AI Crop Advisory Platform.
            </p>

            </div>

            <form onSubmit={handleSubmit} className="panel grid gap-5 p-6 sm:p-10">
              <Input
                id="name"
                name="name"
                label="Name"
                autoComplete="name"
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
                autoComplete="email"
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
                autoComplete="new-password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />

              {error ? (
                <p className="rounded-card bg-error-soft px-4 py-3 text-sm font-medium text-ink" role="alert">
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

      <Footer compact />
    </>
  );
}

export default Register;
