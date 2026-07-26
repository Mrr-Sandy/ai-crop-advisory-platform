import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LockKeyhole } from "lucide-react";

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

      <main className="bg-slate-50 dark:bg-slate-950">
        <section className="mx-auto grid min-h-[64vh] max-w-7xl items-center px-4 py-10 sm:min-h-[70vh] sm:px-6 sm:py-14">
          <div className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              <LockKeyhole className="h-6 w-6" aria-hidden="true" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
              Login
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Login to continue using the AI Crop Advisory Platform.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
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

              {message ? (
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  {message}
                </p>
              ) : null}

              {error ? (
                <p className="text-sm font-medium text-red-700 dark:text-red-300" role="alert">
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

      <Footer />
    </>
  );
}

export default Login;
