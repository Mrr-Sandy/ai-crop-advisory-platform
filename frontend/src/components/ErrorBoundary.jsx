import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unexpected UI error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-12 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
          <section className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-normal text-green-700 dark:text-green-300">
              Something went wrong
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
              The page could not be displayed.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Please refresh the page or return home. Your saved crop records
              and account data are not changed by this display error.
            </p>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              Back to home
            </Link>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
