const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const PORT = process.env.PORT || 5001;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const request = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
};

const runIntegrationTests = async () => {
  console.log('🧪 Starting Waste2Worth End-to-End API Test Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, title) => {
    if (condition) {
      console.log(`  ✅ PASS: ${title}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${title}`);
      failed++;
    }
  };

  try {
    // Test 1: API Health Check
    const health = await request('/api/health');
    assert(health.status === 200 && health.data.status === 'online', 'API Health Check returns 200 and online status');

    // Test 2: Administrator Login
    const adminLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@waste2worth.org', password: 'Admin@1234' }
    });
    assert(adminLogin.status === 200 && adminLogin.data.token && adminLogin.data.user.role === 'admin', 'Admin Login returns JWT & admin role');
    const adminToken = adminLogin.data?.token;

    // Test 3: Donor Login
    const donorLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'donor@waste2worth.org', password: 'Donor@1234' }
    });
    assert(donorLogin.status === 200 && donorLogin.data.user.role === 'donor', 'Donor Login returns donor role');
    const donorToken = donorLogin.data?.token;

    // Test 4: Charity Login
    const charityLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'contact@hopeshelter.org', password: 'Charity@1234' }
    });
    assert(charityLogin.status === 200 && charityLogin.data.user.role === 'charity', 'Charity Login returns charity role');
    const charityToken = charityLogin.data?.token;

    // Test 5: Food Quantity Calculation (MODULE 1)
    const calculation = await request('/api/food-quantity/calculate', {
      method: 'POST',
      body: {
        quantity: 40,
        quantityUnit: 'kg',
        foodCategory: 'Cooked Meals',
        potentialBeneficiaries: 100
      }
    });
    assert(
      calculation.status === 200 &&
      calculation.data.data.estimatedServings === 100 &&
      calculation.data.data.splitSuggestions.length > 0,
      'Food Quantity Decision engine calculates estimated servings and multi-center split suggestions'
    );

    // Test 6: Public Place Recommendation (MODULE 2)
    const publicPlaces = await request('/api/recommendations/public-places?lat=12.9716&lng=77.5946&radius=25');
    assert(
      publicPlaces.status === 200 &&
      publicPlaces.data.count > 0 &&
      publicPlaces.data.data[0].distanceKm !== undefined &&
      publicPlaces.data.data[0].googleMapsDirectionsUrl,
      'Public Place Recommendations returns verified distribution points with distance and Google Maps directions'
    );

    // Test 7: Community Place Suggestion (MODULE 3)
    const communityPlaces = await request('/api/recommendations/community-places?lat=12.9716&lng=77.5946&radius=25');
    assert(
      communityPlaces.status === 200 &&
      communityPlaces.data.count > 0 &&
      communityPlaces.data.data[0].distanceKm !== undefined,
      'Community Place Suggestions returns verified charities and shelters with distance'
    );

    // Test 8: Create Food Donation (Donor)
    const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    const createDonation = await request('/api/donations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${donorToken}` },
      body: {
        foodName: 'Test 20 kg Vegetable Pulao & Raita',
        foodCategory: 'Cooked Meals',
        foodType: 'Vegetarian',
        quantity: 20,
        quantityUnit: 'kg',
        description: 'Automated test surplus food batch',
        expiryDate: tomorrow,
        pickupAddress: '7th Block, Koramangala, Bengaluru',
        pickupAvailability: 'Today 7:00 PM - 10:00 PM'
      }
    });
    assert(
      createDonation.status === 201 &&
      createDonation.data.data.donationStatus === 'Available' &&
      createDonation.data.data.estimatedServings === 50,
      'Donor creates new donation with auto-calculated 50 servings and Available status'
    );
    const newDonationId = createDonation.data?.data?._id;

    // Test 9: Charity Accepts Donation (Atomic Claim)
    const acceptDonation = await request(`/api/donations/${newDonationId}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${charityToken}` }
    });
    assert(
      acceptDonation.status === 200 &&
      acceptDonation.data.data.donationStatus === 'Accepted',
      'Charity successfully accepts donation and status changes to Accepted'
    );

    // Test 10: Prevent Duplicate Acceptance
    const duplicateAccept = await request(`/api/donations/${newDonationId}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${charityToken}` }
    });
    assert(
      duplicateAccept.status === 409,
      'Atomic prevention prevents duplicate acceptance of already claimed donation (returns 409 Conflict)'
    );

    // Test 11: Charity Marks as Collected
    const collectDonation = await request(`/api/donations/${newDonationId}/collect`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${charityToken}` }
    });
    assert(
      collectDonation.status === 200 &&
      collectDonation.data.data.donationStatus === 'Collected',
      'Charity updates donation status to Collected'
    );

    // Test 12: Charity Marks as Completed (Distributed)
    const completeDonation = await request(`/api/donations/${newDonationId}/complete`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${charityToken}` }
    });
    assert(
      completeDonation.status === 200 &&
      completeDonation.data.data.donationStatus === 'Completed',
      'Charity completes donation after distribution'
    );

    // Test 13: Activity History Trail Verification
    const donationDetails = await request(`/api/donations/${newDonationId}`);
    assert(
      donationDetails.status === 200 &&
      donationDetails.data.activities.length >= 4,
      'Donation activity history logs all transition events (CREATED, ACCEPTED, COLLECTED, COMPLETED)'
    );

    // Test 14: Role-Based Protection: Donor cannot access Admin Analytics
    const unauthorizedAdmin = await request('/api/analytics/admin', {
      headers: { Authorization: `Bearer ${donorToken}` }
    });
    assert(
      unauthorizedAdmin.status === 403,
      'Role-based access control blocks unauthorized donor from accessing administrative analytics (403 Forbidden)'
    );

    // Test 15: Admin Analytics returns live database metrics
    const adminAnalytics = await request('/api/analytics/admin', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(
      adminAnalytics.status === 200 &&
      adminAnalytics.data.data.totalUsers > 0 &&
      adminAnalytics.data.data.totalDonations > 0,
      'Admin analytics aggregates real database metrics and category distribution'
    );

    // Test 16: Notifications API
    const notifications = await request('/api/notifications', {
      headers: { Authorization: `Bearer ${donorToken}` }
    });
    assert(
      notifications.status === 200 &&
      Array.isArray(notifications.data.data),
      'Notifications API returns user notification stream'
    );

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
};

runIntegrationTests();
