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
        <main className="grid min-h-dvh place-items-center bg-paper py-12 text-ink">
          <section className="shell max-w-3xl!">
            <h1 className="text-display-s">Something went wrong</h1>
            <p className="lead mt-6 text-muted">
              The page could not be displayed. Please refresh the page or return
              home. Your saved crop records and account data are not changed by
              this display error.
            </p>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="key key--primary mt-10"
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
