"use client";

import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SummaryCard from "../components/SummaryCard";
import Button from "../components/Button";
import { FiArrowRight, FiUsers, FiUserPlus, FiClock } from "react-icons/fi";
import { useEffect, useState } from "react";
import { fetchCustomerCount, fetchNewCustomersToday } from "./lib/api/customer";

const Home = () => {
  const router = useRouter();

  type SummaryCardProps = {
    title: string;
    value: string;
    icon: React.ReactElement;
    trend: "up" | "down" | "neutral";
    changePercentage?: number;
    period?: string;
  };

  const [count, setCount] = useState<number | null>(null);
  const [newCustCount, setNewCustCount] = useState<number | null>(null);

  useEffect(() => {
    const getCount = async () => {
      try {
        const total = await fetchCustomerCount();
        setCount(total);
      } catch (error) {
        console.error("Error fetching customer count:", error);
      }
    };

    getCount();
  }, []);

  useEffect(() => {
    const loadNewCustomers = async () => {
      try {
        const data = await fetchNewCustomersToday();
        setNewCustCount(data.count);
      } catch (err) {
        console.log("Failed to load new customer count", err);
      }
    };

    loadNewCustomers();
  }, []);

  const summaryStats: SummaryCardProps[] = [
    {
      title: "Total Customers",
      value: count?.toString() ?? "Loading...",
      icon: <FiUsers className="w-5 h-5" />,
      trend: "up",
      changePercentage: 5.2,
    },
    {
      title: "New Customers",
      value: newCustCount?.toString() ?? "Loading...",
      icon: <FiUserPlus className="w-5 h-5" />,
      trend: "down",
      changePercentage: 2.1,
      period: "this month",
    },
    {
      title: "Pending Ingestions",
      value: "7",
      icon: <FiClock className="w-5 h-5" />,
      trend: "neutral",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 font-sans">

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-30">
        {/* Hero Section */}
        <section className="text-center mb-12 sm:mb-16 md:mb-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-indigo-900 dark:text-indigo-200 mb-4 sm:mb-6 leading-tight">
            Transform Your Customer Relationships
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Streamline your customer management with our powerful CRM platform
            featuring intuitive tools for ingestion, analytics, and relationship
            building.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => router.push("/ingest")}
              className="px-6 py-3 sm:px-8 sm:py-3 text-base sm:text-lg font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              variant="primary"
            >
              Add New Customers
              <FiArrowRight className="ml-2" />
            </Button>
            <Button
              onClick={() => router.push("/customers")}
              className="px-6 py-3 sm:px-8 sm:py-3 text-base sm:text-lg font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              variant="secondary"
            >
              View All Customers
            </Button>
          </div>
        </section>

        {/* Summary Cards */}
        <section aria-labelledby="summary-heading" className="mb-12 sm:mb-16">
          <h2
            id="summary-heading"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Quick Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {summaryStats.map((stat) => (
              <SummaryCard key={stat.title} {...stat} />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="bg-indigo-100 dark:bg-indigo-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FiUserPlus className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Customer Onboarding
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Quickly add new customers with our streamlined ingestion
                process.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="bg-indigo-100 dark:bg-indigo-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-indigo-600 dark:text-indigo-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gain insights with powerful customer behavior analytics.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="bg-indigo-100 dark:bg-indigo-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-indigo-600 dark:text-indigo-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get instant notifications about important customer activities.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
