"use client";

import { useState } from "react";
import CustomerForm from "@/components/CustomerForm";
import BulkUploadForm from "@/components/BulkUploadForm";
import { FiUploadCloud, FiUserPlus, FiUsers } from "react-icons/fi";
import Head from "next/head";
import { Tab } from "@headlessui/react";

export default function IngestPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Head>
        <title>Add Customers | CRM Platform</title>
        <meta name="description" content="Add single or multiple customers to your CRM system" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <div className="inline-flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-3 sm:mb-4">
              <FiUploadCloud className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900 dark:text-indigo-100 mb-2 sm:mb-3">
              Add Customers
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose your preferred method to add customers to your CRM system
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Gradient accent bar */}
            <div className="h-1 sm:h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            
            {/* Tabbed interface */}
            <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
              <Tab.List className="flex border-b border-gray-200 dark:border-gray-700">
                <Tab
                  className={({ selected }) =>
                    `flex-1 py-3 px-4 text-center font-medium text-sm sm:text-base transition-colors ${
                      selected
                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`
                  }
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiUserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Single Customer</span>
                  </div>
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `flex-1 py-3 px-4 text-center font-medium text-sm sm:text-base transition-colors ${
                      selected
                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`
                  }
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiUsers className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Bulk Upload</span>
                  </div>
                </Tab>
              </Tab.List>
              <Tab.Panels className="p-4 sm:p-6 md:p-8">
                <Tab.Panel>
                  <div className="space-y-1 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      Add Single Customer
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Fill out the form below to add one customer at a time
                    </p>
                  </div>
                  <CustomerForm />
                </Tab.Panel>
                <Tab.Panel>
                  <div className="space-y-1 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      Bulk Upload Customers
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Upload a CSV or JSON file to add multiple customers at once
                    </p>
                  </div>
                  <BulkUploadForm />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Need help?{" "}
              <a
                href="#"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Contact support
              </a>{" "}
              or{" "}
              <a
                href="/sample-customers.csv"
                download
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                download sample file
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}