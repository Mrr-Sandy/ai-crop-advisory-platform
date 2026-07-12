import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { clearToken, getProfile, getToken } from "../api/auth";
import { Loader } from "./ui";

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState(() => (getToken() ? "checking" : "anonymous"));

  useEffect(() => {
    if (!getToken()) {
      return undefined;
    }

    const controller = new AbortController();

    async function verifySession() {
      try {
        await getProfile({ signal: controller.signal });
        setStatus("authenticated");
      } catch (error) {
        if (error.name !== "AbortError") {
          clearToken();
          setStatus("anonymous");
        }
      }
    }

    verifySession();

    return () => controller.abort();
  }, []);

  if (status === "checking") {
    return <Loader text="Checking your session..." />;
  }

  if (status === "anonymous") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
