const axios = require('axios');

// Simulated Vendor API that hits your /delivery-receipt endpoint
exports.simulateVendorAPI = async (customer, message, campaignId) => {
  const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';

  setTimeout(async () => {
    try {
      await axios.post(`${process.env.BASE_API_URL}/api/campaigns/delivery-receipt`, {
        customerId: customer._id,
        campaignId,
        status
      });
      console.log(`[${status}] to ${customer.email}`);
    } catch (err) {
      console.error('Error simulating delivery:', err.message);
    }
  }, Math.random() * 3000);
};
