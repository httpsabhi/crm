"use client";
import OrderForm from "@/components/OrderForm";
import OrderList from "@/components/OrderList";
import { FiPackage, FiPlus } from "react-icons/fi";
import { useState } from "react";
import Head from "next/head";

export default function OrdersPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Head>
        <title>Orders Management | CRM Platform</title>
        <meta name="description" content="Manage and create customer orders" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                <FiPackage className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Orders Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View and manage all customer orders
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>{showForm ? "Hide Form" : "Create Order"}</span>
            </button>
          </div>

          {/* Order Form (Conditional) */}
          {showForm && (
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="p-6">
                <OrderForm onSuccess={() => setShowForm(false)} />
              </div>
            </div>
          )}

          {/* Orders List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Orders
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing all orders
                </div>
              </div>
              <OrderList />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
