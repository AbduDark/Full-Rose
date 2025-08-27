import React from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="w-full min-h-screen bg-gradient-to-r from-secondary to-primary flex flex-col justify-center items-center text-white">
      <div className="container mx-auto px-6 text-center font-['Heebo']">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4">
          404 - <span className="text-yellow-300">Page Not Found</span>
        </h1>
        <p className="text-lg sm:text-xl font-medium mb-8 text-gray-200">
          Oops! It looks like this page doesn't exist. Let's get you back on
          track to explore our courses.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="relative inline-flex items-center z-50 cursor-pointer rounded-full border-2 border-yellow-300 text-yellow-300 px-8 py-3 text-lg font-medium shadow-md hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 ease-in-out"
          >
            <FaHome className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Wave SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="w-full absolute bottom-0"
      >
        <path
          fill="#FFFFFF"
          fillOpacity="1"
          d="M0,256L48,240C96,224,192,192,288,154.7C384,117,480,75,576,96C672,117,768,203,864,197.3C960,192,1056,96,1152,69.3C1248,43,1344,85,1392,106.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </section>
  );
}

export default NotFoundPage;
