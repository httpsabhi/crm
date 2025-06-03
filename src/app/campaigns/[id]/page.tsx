'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import api from '@/app/lib/axios';

interface CommunicationLog {
  _id: string;
  campaign: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
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
  const { id } = use(params); // ✅ unwrap the promise

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await api.get(`/campaigns/${id}`);
        console.log('Fetched campaign detail:', res.data);
        setCampaign(res.data);
      } catch (err) {
        console.error('Error fetching campaign detail', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) return <p className="p-4 text-lg">Loading campaign details...</p>;
  if (!campaign) return <p className="p-4 text-lg text-red-600">Campaign not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Campaign Details</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <p><strong>Segment Name:</strong> {campaign.segmentName}</p>
        <p><strong>Message:</strong> {campaign.message}</p>
        <p><strong>Created At:</strong> {new Date(campaign.createdAt).toLocaleString()}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Communication Logs</h2>

      {campaign.logs?.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaign.logs.map((log) => (
                <tr key={log._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No communication logs available for this campaign.</p>
      )}
    </div>
  );
}
