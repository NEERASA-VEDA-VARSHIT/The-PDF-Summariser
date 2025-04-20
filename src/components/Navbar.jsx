import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">PDF Summariser</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">
            Upload
          </Link>
          <Link to="/summary" className="hover:underline">
            Summary
          </Link>
          <Link to="/flashcards" className="hover:underline">
            Flashcards
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
