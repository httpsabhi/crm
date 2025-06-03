"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-indigo-900 shadow-lg"
          : "bg-indigo-900/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-wide text-white hover:text-indigo-300 transition-colors flex items-center"
          >
            <span className="bg-indigo-600 p-2 rounded-lg mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </span>
            CRM Platform
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/ingest"
              className="text-white hover:text-indigo-300 transition-colors font-medium flex items-center"
            >
              <span className="mr-1">+</span> Add Customers
            </Link>
            <Link
              href="/orders"
              className="text-white hover:text-indigo-300 transition-colors font-medium"
            >
              Orders
            </Link>
            <Link
              href="/campaigns"
              className="text-white hover:text-indigo-300 transition-colors font-medium"
            >
              Campaigns
            </Link>
            <Link
              href="/settings"
              className="text-white hover:text-indigo-300 transition-colors font-medium"
            >
              Settings
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-indigo-300 focus:outline-none transition-colors"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-2 sm:px-3 bg-indigo-800/95">
          <Link
            href="/ingest"
            className="block px-3 py-2 rounded-md text-white hover:bg-indigo-700 transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            <span className="mr-1">+</span> Add Customers
          </Link>
          <Link
            href="/customers"
            className="block px-3 py-2 rounded-md text-white hover:bg-indigo-700 transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            Customers
          </Link>
          <Link
            href="/analytics"
            className="block px-3 py-2 rounded-md text-white hover:bg-indigo-700 transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            Analytics
          </Link>
          <Link
            href="/settings"
            className="block px-3 py-2 rounded-md text-white hover:bg-indigo-700 transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
        </div>
      </div>
    </header>
  );
}
