"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/app/lib/axios";
import {
  FiPlus,
  FiUsers,
  FiCalendar,
  FiActivity,
  FiArrowRight,
  FiLoader,
} from "react-icons/fi";
import Button from "@/components/Button"; // Import your existing Button component

interface Rule {
  field: string;
  operator: string;
  value: string;
}

interface Campaign {
  _id: string;
  segmentName: string;
  rules: Rule[];
  audienceSize: number;
  createdAt: string;
  status: "active" | "paused" | "draft";
}

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get("/campaigns");
        console.log("API response:", res.data); // Check this in browser console

        // Ensure it's always an array
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.campaigns || [];

        setCampaigns(data);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const formatRules = (rules: Rule[]) => {
  return rules
    .map((rule) => `${rule.field} ${rule.operator} ${rule.value}`)
    .join(" AND ");
};


  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.segmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatRules(campaign.rules).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-indigo-600 text-xl mr-3" />
        <span className="text-gray-600">Loading campaigns...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <FiUsers className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Marketing Campaigns
              </h1>
              <p className="text-sm text-gray-500">
                {campaigns.length} total campaigns
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiActivity className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search campaigns..."
                className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Link href="/campaigns/rules">
              <Button
                variant="primary"
                className="flex items-center justify-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                <span>New Campaign</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Targeting Logic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Audience Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {campaign.segmentName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatRules(campaign.rules)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {campaign.audienceSize.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.status === "active"
                          ? "bg-green-100 text-green-800"
                          : campaign.status === "paused"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FiCalendar className="mr-1 text-gray-400" />
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/campaigns/${campaign._id}`}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end"
                    >
                      View <FiArrowRight className="ml-1" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-3">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    {campaign.segmentName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{formatRules(campaign.rules)}</p>
                </div>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    campaign.status === "active"
                      ? "bg-green-100 text-green-800"
                      : campaign.status === "paused"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {campaign.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-gray-500">
                  <FiUsers className="mr-1.5 flex-shrink-0 text-gray-400" />
                  <span>
                    {campaign.audienceSize.toLocaleString()} customers
                  </span>
                </div>
                <div className="flex items-center text-gray-500">
                  <FiCalendar className="mr-1.5 flex-shrink-0 text-gray-400" />
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <Link
                  href={`/campaigns/${campaign._id}`}
                  className="text-sm text-indigo-600 hover:underline flex items-center"
                >
                  View campaign details <FiArrowRight className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            {searchTerm ? (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No campaigns match your search
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search term
                </p>
              </>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No campaigns yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Get started by creating a new campaign
                </p>
                <div className="mt-6">
                  <Link href="/campaigns/rules">
                    <Button
                      variant="primary"
                      className="flex items-center mx-auto"
                    >
                      <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                      New Campaign
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;
