'use client';
import { use } from 'react';
import { useEffect, useState } from 'react';
import api from '@/app/lib/axios';
import { FiUsers, FiMail, FiClock, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';
import Head from 'next/head';

interface CommunicationLog {
  _id: string;
  campaign: {
    segmentName: string;
    message: string;
    rules: CampaignRule[];
  };
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'SENT' | 'delivered' | 'FAILED' | 'failed' | 'opened';
  timestamp: string;
}

interface CampaignRule {
  field: string;
  operator: string;
  value: string | number;
}

interface CampaignDetail {
  logs: CommunicationLog[];
  _id: string;
  segmentName: string;
  message: string;
  rules: CampaignRule[];
  createdAt: string;
  communicationLogs: CommunicationLog[];
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await api.get(`/campaigns/${id}`);
        setCampaign(res.data);
      } catch (err) {
        console.error('Error fetching campaign detail', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const filteredLogs = campaign?.logs?.filter(log =>
    log.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.status.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Campaign not found</h3>
        <p className="mt-1 text-gray-500">The requested campaign could not be loaded</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT':
        return <FiMail className="text-blue-500" />;
      case 'delivered':
        return <FiCheck className="text-green-500" />;
      case 'opened':
        return <FiCheck className="text-green-500" />;
      case 'FAILED':
        return <FiX className="text-red-500" />;
      default:
        return <FiAlertTriangle className="text-yellow-500" />;
    }
  };

  return (
    <>
      <Head>
        <title>{campaign.logs[0].campaign.segmentName} | Campaign Details</title>
        <meta name="description" content={`Details for ${campaign.segmentName} campaign`} />
      </Head>

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Campaign Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <FiUsers className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{campaign.segmentName}</h1>
              <p className="text-sm text-gray-500">Created {new Date(campaign.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Campaign Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Campaign Message</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{campaign.message}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Targeting Rules</h3>
                <div className="space-y-2">
                  {campaign.logs[0].campaign.rules.map((rule, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {rule.field} {rule.operator} {rule.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Communication Logs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FiMail className="text-indigo-600" />
                  Communication Logs
                </h2>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUsers className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search logs..."
                    className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredLogs.length > 0 ? (
                <>
                  {/* Desktop Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLogs.map((log) => (
                          <tr key={log._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{log.customer.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.customer.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(log.status)}
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  log.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                                  log.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {log.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <FiClock className="text-gray-400" />
                                {new Date(log.timestamp).toLocaleString()}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="sm:hidden space-y-3">
                    {filteredLogs.map((log) => (
                      <div key={log._id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{log.customer.name}</h3>
                            <p className="text-sm text-gray-500">{log.customer.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              log.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                              log.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              log.status === 'opened' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-500">
                          <FiClock className="text-gray-400" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    {searchTerm ? "No matching logs found" : "No communication logs available"}
                  </h3>
                  <p className="mt-1 text-gray-500">
                    {searchTerm ? "Try adjusting your search" : "This campaign hasn't been sent yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}