import { LockKeyhole } from "lucide-react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Button, Input } from "../components/ui";

function Login() {
  return (
    <>
      <Navbar />

      <main className="bg-slate-50 dark:bg-slate-950">
        <section className="mx-auto grid min-h-[70vh] max-w-7xl items-center px-4 py-14 sm:px-6">
          <div className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              <LockKeyhole className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
              Login
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Authentication UI is prepared for future backend auth support. It
              is intentionally disabled until real auth endpoints exist.
            </p>

            <form className="mt-6 grid gap-4">
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="name@example.com"
                disabled
              />
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="Password"
                disabled
              />
              <Button disabled className="w-full">
                Sign in unavailable
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
