const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Charity = require('../models/Charity');
const Donation = require('../models/Donation');
const PublicPlace = require('../models/PublicPlace');
const Notification = require('../models/Notification');
const DonationActivity = require('../models/DonationActivity');

// Ensure sample images exist in uploads
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Write sample SVG images if they don't exist
const sampleImages = [
  {
    name: 'biryani.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#fef3c7"/><circle cx="300" cy="200" r="140" fill="#f59e0b"/><circle cx="300" cy="200" r="120" fill="#d97706"/><text x="50%" y="45%" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff">Fresh Veg Biryani</text><text x="50%" y="58%" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#fef3c7">Surplus Cooked Meals</text></svg>`
  },
  {
    name: 'bakery.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#ffedd5"/><rect x="150" y="120" width="300" height="160" rx="30" fill="#ea580c"/><text x="50%" y="48%" text-anchor="middle" font-family="sans-serif" font-size="26" font-weight="bold" fill="#ffffff">Artisan Breads &amp; Rolls</text><text x="50%" y="60%" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#fed7aa">Fresh Bakery Surplus</text></svg>`
  },
  {
    name: 'vegetables.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#dcfce7"/><circle cx="300" cy="200" r="130" fill="#16a34a"/><text x="50%" y="48%" text-anchor="middle" font-family="sans-serif" font-size="26" font-weight="bold" fill="#ffffff">Fresh Organic Produce</text><text x="50%" y="60%" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#bbf7d0">Vegetables &amp; Fruits</text></svg>`
  },
  {
    name: 'curry.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#fee2e2"/><circle cx="300" cy="200" r="130" fill="#dc2626"/><text x="50%" y="48%" text-anchor="middle" font-family="sans-serif" font-size="26" font-weight="bold" fill="#ffffff">Rice &amp; Lentil Curry</text><text x="50%" y="60%" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#fecaca">Nutritious Hot Meals</text></svg>`
  }
];

sampleImages.forEach((img) => {
  const filePath = path.join(uploadsDir, img.name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, img.svg);
  }
});

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/waste2worth';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Charity.deleteMany({}),
      Donation.deleteMany({}),
      PublicPlace.deleteMany({}),
      Notification.deleteMany({}),
      DonationActivity.deleteMany({})
    ]);

    console.log('Cleared existing collections.');

    // 1. Create Administrator
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@waste2worth.org',
      phone: '+91 98888 00001',
      password: 'Admin@1234',
      role: 'admin',
      address: 'Vidhana Soudha Central Office, Bengaluru, Karnataka 560001',
      location: {
        type: 'Point',
        coordinates: [77.5906, 12.9796]
      },
      accountStatus: 'active'
    });

    // 2. Create Donors
    const donor1 = await User.create({
      name: 'Grand Palace Hotel & Banquets',
      email: 'catering@grandpalace.com',
      phone: '+91 98450 11223',
      password: 'Donor@1234',
      role: 'donor',
      donorCategory: 'Hotel',
      address: '42 MG Road, Ashok Nagar, Bengaluru 560001',
      location: {
        type: 'Point',
        coordinates: [77.6094, 12.9754]
      },
      accountStatus: 'active'
    });

    const donor2 = await User.create({
      name: 'Green Leaf Gourmet Bakery & Cafe',
      email: 'restaurant@greenleaf.com',
      phone: '+91 98450 33445',
      password: 'Donor@1234',
      role: 'donor',
      donorCategory: 'Restaurant',
      address: '100 Feet Road, Indiranagar, Bengaluru 560038',
      location: {
        type: 'Point',
        coordinates: [77.6413, 12.9719]
      },
      accountStatus: 'active'
    });

    const donor3 = await User.create({
      name: 'Rahul Verma (Household)',
      email: 'donor@waste2worth.org',
      phone: '+91 98450 55667',
      password: 'Donor@1234',
      role: 'donor',
      donorCategory: 'Individual / Household',
      address: '7th Block, Koramangala, Bengaluru 560095',
      location: {
        type: 'Point',
        coordinates: [77.6186, 12.9345]
      },
      accountStatus: 'active'
    });

    // 3. Create Charities
    // Charity 1: Hope Children Orphanage & Shelter (Verified)
    const charityUser1 = await User.create({
      name: 'Sister Mary Teresa (Hope Shelter)',
      email: 'contact@hopeshelter.org',
      phone: '+91 99000 11222',
      password: 'Charity@1234',
      role: 'charity',
      address: '14 Richmond Road, Bengaluru 560025',
      location: {
        type: 'Point',
        coordinates: [77.6033, 12.9667]
      },
      accountStatus: 'active'
    });

    const charity1 = await Charity.create({
      userId: charityUser1._id,
      organizationName: 'Hope Children Orphanage & Shelter',
      organizationType: 'Shelter',
      description: 'Dedicated shelter providing home, education, and nutrition for 80+ orphaned and destitute children.',
      verificationStatus: 'Approved',
      address: '14 Richmond Road, Bengaluru 560025',
      location: {
        type: 'Point',
        coordinates: [77.6033, 12.9667]
      },
      serviceCapacity: 150,
      peopleServed: 85,
      operatingHours: '7:00 AM - 9:00 PM',
      contactPhone: '+91 99000 11222'
    });

    // Charity 2: Annapoorna Community Kitchen (Verified)
    const charityUser2 = await User.create({
      name: 'Anand Kumar (Annapoorna Kitchen)',
      email: 'seva@annapoornakitchen.org',
      phone: '+91 99000 33444',
      password: 'Charity@1234',
      role: 'charity',
      address: '28 Rajajinagar 2nd Block, Bengaluru 560010',
      location: {
        type: 'Point',
        coordinates: [77.5552, 12.9982]
      },
      accountStatus: 'active'
    });

    const charity2 = await Charity.create({
      userId: charityUser2._id,
      organizationName: 'Annapoorna Community Kitchen',
      organizationType: 'Community Kitchen',
      description: 'Daily community meal distribution service serving migrant workers, daily wage laborers, and elderlies.',
      verificationStatus: 'Approved',
      address: '28 Rajajinagar 2nd Block, Bengaluru 560010',
      location: {
        type: 'Point',
        coordinates: [77.5552, 12.9982]
      },
      serviceCapacity: 300,
      peopleServed: 220,
      operatingHours: '8:00 AM - 8:00 PM',
      contactPhone: '+91 99000 33444'
    });

    // Charity 3: Sunshine Care NGO (Pending Verification)
    const charityUser3 = await User.create({
      name: 'Pooja Hegde (Sunshine Care)',
      email: 'help@sunshinengo.org',
      phone: '+91 99000 55666',
      password: 'Charity@1234',
      role: 'charity',
      address: '5th Cross, Malleshwaram, Bengaluru 560003',
      location: {
        type: 'Point',
        coordinates: [77.5714, 13.0031]
      },
      accountStatus: 'active'
    });

    const charity3 = await Charity.create({
      userId: charityUser3._id,
      organizationName: 'Sunshine Care Relief NGO',
      organizationType: 'NGO',
      description: 'Grassroots organization delivering food packets and emergency relief across northern Bengaluru suburbs.',
      verificationStatus: 'Pending',
      address: '5th Cross, Malleshwaram, Bengaluru 560003',
      location: {
        type: 'Point',
        coordinates: [77.5714, 13.0031]
      },
      serviceCapacity: 120,
      peopleServed: 60,
      operatingHours: '9:00 AM - 6:00 PM',
      contactPhone: '+91 99000 55666'
    });

    // 4. Create Public Places (Distribution Points)
    await PublicPlace.create([
      {
        name: 'Cubbon Park Public Food Point',
        placeType: 'Public Distribution Point',
        address: 'Kasturba Road Entrance, Cubbon Park, Bengaluru 560001',
        location: {
          type: 'Point',
          coordinates: [77.5929, 12.9763]
        },
        description: 'Designated hygienic civic shelter with drinking water and covered seating for food distribution.',
        operatingHours: '8:00 AM - 7:00 PM',
        contactPerson: 'Suresh Gowda (Park Officer)',
        contactPhone: '+91 98451 22334',
        verificationStatus: 'Verified'
      },
      {
        name: 'Shivajinagar Community Relief Center',
        placeType: 'Community Center',
        address: 'Russell Market Square, Shivajinagar, Bengaluru 560051',
        location: {
          type: 'Point',
          coordinates: [77.6042, 12.9863]
        },
        description: 'Civic facility managed in collaboration with local food welfare societies and volunteers.',
        operatingHours: '9:00 AM - 8:30 PM',
        contactPerson: 'Mohammed Farooq',
        contactPhone: '+91 98452 33445',
        verificationStatus: 'Verified'
      },
      {
        name: 'Indiranagar Civic Food Shelter',
        placeType: 'Municipal Shelter',
        address: 'Near Indiranagar Metro Station, CMH Road, Bengaluru 560038',
        location: {
          type: 'Point',
          coordinates: [77.6408, 12.9784]
        },
        description: 'Government approved night shelter and daytime community dining hall.',
        operatingHours: '24 Hours',
        contactPerson: 'Lakshmi Narayan',
        contactPhone: '+91 98453 44556',
        verificationStatus: 'Verified'
      },
      {
        name: 'Koramangala Municipal Community Kitchen',
        placeType: 'Community Kitchen',
        address: '8th Main Road, 4th Block, Koramangala, Bengaluru 560034',
        location: {
          type: 'Point',
          coordinates: [77.6245, 12.9352]
        },
        description: 'Equipped with cold storage and distribution counters for hot meals.',
        operatingHours: '7:30 AM - 8:00 PM',
        contactPerson: 'Deepak Reddy',
        contactPhone: '+91 98454 55667',
        verificationStatus: 'Verified'
      },
      {
        name: 'Majestic City Transit Distribution Hub',
        placeType: 'Transit Station Hub',
        address: 'KSRTC Bus Stand Outer Concourse, Majestic, Bengaluru 560009',
        location: {
          type: 'Point',
          coordinates: [77.5713, 12.9767]
        },
        description: 'Major pedestrian hub with dedicated volunteers assisting daily travelers and destitute individuals.',
        operatingHours: '6:00 AM - 10:00 PM',
        contactPerson: 'Ramesh Babu',
        contactPhone: '+91 98455 66778',
        verificationStatus: 'Verified'
      }
    ]);

    // 5. Create Donations in various stages
    // Donation 1: AVAILABLE - Grand Palace Hotel
    const donation1 = await Donation.create({
      donorId: donor1._id,
      foodName: '40 kg Royal Veg Dum Biryani & Raita',
      foodCategory: 'Cooked Meals',
      foodType: 'Vegetarian',
      quantity: 40,
      quantityUnit: 'kg',
      estimatedServings: 100,
      description: 'Freshly prepared evening banquet surplus. Hygenic stainless steel containers. Cooked at 6:30 PM.',
      foodImages: ['/uploads/biryani.svg'],
      preparationDate: new Date(Date.now() - 3 * 3600 * 1000), // 3 hours ago
      expiryDate: new Date(Date.now() + 18 * 3600 * 1000), // safe for next 18 hours
      pickupAddress: 'Grand Palace Hotel Banquet Gate 2, MG Road, Bengaluru',
      location: {
        type: 'Point',
        coordinates: [77.6094, 12.9754]
      },
      pickupAvailability: 'Today 9:00 PM - 11:30 PM',
      specialInstructions: 'Please bring food-grade insulated transit boxes or clean containers.',
      donationStatus: 'Available'
    });

    await DonationActivity.create({
      donationId: donation1._id,
      userId: donor1._id,
      activityType: 'CREATED',
      description: 'Donation created by Grand Palace Hotel.'
    });

    // Donation 2: AVAILABLE - Green Leaf Gourmet Bakery
    const donation2 = await Donation.create({
      donorId: donor2._id,
      foodName: 'Fresh Baked Artisan Loaves, Croissants & Buns',
      foodCategory: 'Bakery & Bread',
      foodType: 'Vegetarian',
      quantity: 25,
      quantityUnit: 'kg',
      estimatedServings: 160,
      description: 'Day-end fresh unconsumed bakery batches. Individually paper-wrapped and sealed.',
      foodImages: ['/uploads/bakery.svg'],
      preparationDate: new Date(Date.now() - 6 * 3600 * 1000),
      expiryDate: new Date(Date.now() + 36 * 3600 * 1000),
      pickupAddress: 'Green Leaf Bakery, 100ft Road, Indiranagar, Bengaluru',
      location: {
        type: 'Point',
        coordinates: [77.6413, 12.9719]
      },
      pickupAvailability: 'Anytime between 8:30 PM - 10:00 PM tonight',
      specialInstructions: 'Staff at counter will hand over the sealed boxes.',
      donationStatus: 'Available'
    });

    await DonationActivity.create({
      donationId: donation2._id,
      userId: donor2._id,
      activityType: 'CREATED',
      description: 'Donation created by Green Leaf Gourmet Bakery.'
    });

    // Donation 3: ACCEPTED - Rahul Verma -> Hope Children Orphanage
    const donation3 = await Donation.create({
      donorId: donor3._id,
      acceptedBy: charityUser1._id,
      charityId: charity1._id,
      foodName: 'Home Cooked Chapati, Yellow Dal & Paneer Curry',
      foodCategory: 'Cooked Meals',
      foodType: 'Vegetarian',
      quantity: 15,
      quantityUnit: 'kg',
      estimatedServings: 35,
      description: 'Family gathering surplus, prepared fresh at home. Packaged in large casserole pots.',
      foodImages: ['/uploads/curry.svg'],
      preparationDate: new Date(Date.now() - 4 * 3600 * 1000),
      expiryDate: new Date(Date.now() + 14 * 3600 * 1000),
      pickupAddress: 'Flat 302, Greenview Apartments, 7th Block Koramangala',
      location: {
        type: 'Point',
        coordinates: [77.6186, 12.9345]
      },
      pickupAvailability: 'Evening 7:00 PM - 9:30 PM',
      specialInstructions: 'Ring doorbell 302. Lift available.',
      donationStatus: 'Accepted',
      acceptedAt: new Date(Date.now() - 1 * 3600 * 1000)
    });

    await DonationActivity.create({
      donationId: donation3._id,
      userId: donor3._id,
      activityType: 'CREATED',
      description: 'Donation created by Rahul Verma.'
    });

    await DonationActivity.create({
      donationId: donation3._id,
      userId: charityUser1._id,
      activityType: 'ACCEPTED',
      description: 'Donation accepted by Hope Children Orphanage & Shelter.'
    });

    // Donation 4: COLLECTED - Grand Palace -> Annapoorna Kitchen
    const donation4 = await Donation.create({
      donorId: donor1._id,
      acceptedBy: charityUser2._id,
      charityId: charity2._id,
      foodName: 'Mixed Seasonal Vegetables (Potatoes, Carrots, Beans)',
      foodCategory: 'Fresh Produce (Fruits & Vegetables)',
      foodType: 'Vegan',
      quantity: 60,
      quantityUnit: 'kg',
      estimatedServings: 240,
      description: 'Pristine raw vegetable stock from morning bulk purchase.',
      foodImages: ['/uploads/vegetables.svg'],
      preparationDate: new Date(Date.now() - 12 * 3600 * 1000),
      expiryDate: new Date(Date.now() + 72 * 3600 * 1000),
      pickupAddress: 'Grand Palace Hotel Loading Bay, MG Road, Bengaluru',
      location: {
        type: 'Point',
        coordinates: [77.6094, 12.9754]
      },
      pickupAvailability: 'Morning 9:00 AM - 1:00 PM',
      specialInstructions: 'Vehicle can park right next to cold store ramp.',
      donationStatus: 'Collected',
      acceptedAt: new Date(Date.now() - 10 * 3600 * 1000),
      collectedAt: new Date(Date.now() - 2 * 3600 * 1000)
    });

    await DonationActivity.create({
      donationId: donation4._id,
      userId: donor1._id,
      activityType: 'CREATED',
      description: 'Donation created.'
    });
    await DonationActivity.create({
      donationId: donation4._id,
      userId: charityUser2._id,
      activityType: 'ACCEPTED',
      description: 'Accepted by Annapoorna Community Kitchen.'
    });
    await DonationActivity.create({
      donationId: donation4._id,
      userId: charityUser2._id,
      activityType: 'COLLECTED',
      description: 'Collected by Annapoorna Community Kitchen van.'
    });

    // Donation 5: COMPLETED - Green Leaf -> Hope Shelter
    const donation5 = await Donation.create({
      donorId: donor2._id,
      acceptedBy: charityUser1._id,
      charityId: charity1._id,
      foodName: '70 Packets Fresh Sandwiches & Apple Juice',
      foodCategory: 'Packaged & Canned Goods',
      foodType: 'Vegetarian',
      quantity: 70,
      quantityUnit: 'packets',
      estimatedServings: 70,
      description: 'Conference breakfast surplus boxes, neatly packed with cold fruit juice.',
      foodImages: ['/uploads/bakery.svg'],
      preparationDate: new Date(Date.now() - 28 * 3600 * 1000),
      expiryDate: new Date(Date.now() - 2 * 3600 * 1000),
      pickupAddress: 'Green Leaf Indiranagar, Bengaluru',
      location: {
        type: 'Point',
        coordinates: [77.6413, 12.9719]
      },
      pickupAvailability: 'Delivered yesterday afternoon',
      specialInstructions: 'Completed distribution.',
      donationStatus: 'Completed',
      acceptedAt: new Date(Date.now() - 26 * 3600 * 1000),
      collectedAt: new Date(Date.now() - 24 * 3600 * 1000),
      completedAt: new Date(Date.now() - 20 * 3600 * 1000)
    });

    await DonationActivity.create({
      donationId: donation5._id,
      userId: donor2._id,
      activityType: 'CREATED',
      description: 'Donation created.'
    });
    await DonationActivity.create({
      donationId: donation5._id,
      userId: charityUser1._id,
      activityType: 'ACCEPTED',
      description: 'Accepted by Hope Shelter.'
    });
    await DonationActivity.create({
      donationId: donation5._id,
      userId: charityUser1._id,
      activityType: 'COLLECTED',
      description: 'Collected.'
    });
    await DonationActivity.create({
      donationId: donation5._id,
      userId: charityUser1._id,
      activityType: 'COMPLETED',
      description: 'Successfully distributed to 70 children at Hope Shelter.'
    });

    // 6. Notifications for sample accounts
    await Notification.create([
      {
        userId: adminUser._id,
        title: 'New Charity Verification Request',
        message: 'Sunshine Care Relief NGO has submitted their registration documents for verification.',
        notificationType: 'charity_verification',
        isRead: false
      },
      {
        userId: adminUser._id,
        title: 'New Donation Activity',
        message: 'Grand Palace Hotel posted 40 kg Veg Dum Biryani.',
        notificationType: 'system',
        isRead: true
      },
      {
        userId: charityUser1._id,
        title: 'Donation Accepted Confirmation',
        message: 'You have accepted Rahul Verma\'s donation of Chapati & Paneer Curry.',
        notificationType: 'donation_accepted',
        relatedDonationId: donation3._id,
        isRead: false
      },
      {
        userId: donor3._id,
        title: 'Donation Accepted!',
        message: 'Hope Children Orphanage & Shelter has accepted your donation. Pickup scheduled for this evening.',
        notificationType: 'donation_accepted',
        relatedDonationId: donation3._id,
        isRead: false
      },
      {
        userId: donor2._id,
        title: 'Donation Complete! 🎉',
        message: 'Your 70 packets of sandwiches were successfully distributed to children.',
        notificationType: 'donation_completed',
        relatedDonationId: donation5._id,
        isRead: true
      }
    ]);

    console.log('Seeding completed successfully!');
    console.log('\n--- SAMPLE ACCOUNTS ---');
    console.log('Administrator: admin@waste2worth.org / Admin@1234');
    console.log('Donor:         donor@waste2worth.org / Donor@1234 (Rahul Verma)');
    console.log('Donor:         restaurant@greenleaf.com / Donor@1234 (Green Leaf)');
    console.log('Donor:         catering@grandpalace.com / Donor@1234 (Grand Palace)');
    console.log('Charity (Approved): contact@hopeshelter.org / Charity@1234');
    console.log('Charity (Approved): seva@annapoornakitchen.org / Charity@1234');
    console.log('Charity (Pending):  help@sunshinengo.org / Charity@1234');
    console.log('------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
