import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <Helmet>
        <title>Page Not Found | NIT KKR PYQs</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      <main className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <p className="text-gray-700 text-lg mb-6">
          We couldn't find the page you were looking for.
        </p>
        <Link
          to="/nit-kkr-pyqs"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all duration-300"
        >
          Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
