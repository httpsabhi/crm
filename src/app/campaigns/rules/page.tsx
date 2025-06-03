"use client";
import dynamic from "next/dynamic";
import Head from "next/head";
import { FiUsers, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

const CampaignRuleBuilder = dynamic(() => import("@/components/CampaignRuleBuilder"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
      </div>
    </div>
  ),
});

export default function CampaignPage() {
  return (
    <>
      <Head>
        <title>Campaign Builder | CRM Platform</title>
        <meta name="description" content="Create targeted marketing campaigns" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <Link href="/campaigns" className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-4">
              <FiArrowLeft className="mr-2" />
              Back to Campaigns
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl">
                <FiUsers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Campaign Builder
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Define rules to target specific customer segments
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="p-6">
              <CampaignRuleBuilder />
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
              Need help building your campaign?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  Targeting Tips
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Combine rules with AND for stricter targeting</li>
                  <li>Use OR to reach a broader audience</li>
                  <li>Preview audience size before finalizing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  Best Practices
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Start with 2-3 simple rules</li>
                  <li>Test different combinations</li>
                  <li>Save successful rule sets as templates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}