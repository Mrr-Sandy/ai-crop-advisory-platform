import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-green-700 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="font-bold text-xl">AI Crop Advisory</h1>

        <div className="flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Login</Link>
        </div>

        <span>👤</span>
      </div>
    </nav>
  );
}

export default Navbar;