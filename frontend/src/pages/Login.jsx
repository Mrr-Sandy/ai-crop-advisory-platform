import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Button, Input } from "../components/ui";
import { getGoogleLoginUrl, loginUser, setToken } from "../api/auth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(location.state?.message || "");
  const [error, setError] = useState(searchParams.get("error") || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const oauthToken = searchParams.get("token");

    if (oauthToken) {
      setToken(oauthToken);
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setIsLoading(true);
      const data = await loginUser(formData);
      setToken(data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
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
              Login
            </h1>

            <p className="lead mt-6 text-muted">
              Login to continue using the AI Crop Advisory Platform.
            </p>

            </div>

            <form onSubmit={handleSubmit} className="panel grid gap-5 p-6 sm:p-10">
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
                autoComplete="current-password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />

              {message ? (
                <p className="rounded-card bg-olive-soft px-4 py-3 text-sm font-medium text-ink" role="status">
                  {message}
                </p>
              ) : null}

              {error ? (
                <p className="rounded-card bg-error-soft px-4 py-3 text-sm font-medium text-ink" role="alert">
                  {error}
                </p>
              ) : null}

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = getGoogleLoginUrl();
                }}
              >
                Continue with Google
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer compact />
    </>
  );
}

export default Login;
