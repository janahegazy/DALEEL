require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Location = require('../models/Location');
const Review = require('../models/Review');
const { CommunityPost, SupportTicket, Backup, Notification } = require('../models/Other');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/daleel';

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Location.deleteMany({}),
      Review.deleteMany({}),
      CommunityPost.deleteMany({}),
      SupportTicket.deleteMany({}),
      Backup.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // ── Create Users ─────────────────────────────
    const hashedPw = await bcrypt.hash('password123', 12);

    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@daleel.com',
        password: hashedPw,
        role: 'admin',
        isActive: true,
        isVerified: true,
        badges: ['Top Contributor', 'Admin']
      },
      {
        name: 'Alex Doe',
        email: 'alex@daleel.com',
        password: hashedPw,
        role: 'regular_user',
        isActive: true,
        isVerified: true,
        reviewCount: 128,
        photoCount: 256,
        contributionCount: 512,
        badges: ['Top Contributor', 'Photo Master', 'Review Guru'],
        emergencyContacts: [
          { name: 'Jane Doe', phone: '0501234567', relation: 'Spouse' },
          { name: 'John Smith', phone: '0509876543', relation: 'Friend' }
        ],
        savedLocations: []
      },
      {
        name: 'Business Owner',
        email: 'business@daleel.com',
        password: hashedPw,
        role: 'business_owner',
        isActive: true,
        isVerified: true
      },
      {
        name: 'Authority Rep',
        email: 'authority@daleel.com',
        password: hashedPw,
        role: 'authority_representative',
        isActive: true,
        isVerified: true
      },
      {
        name: 'Jordan Smith',
        email: 'jordan@daleel.com',
        password: hashedPw,
        role: 'regular_user',
        isActive: true,
        isVerified: true,
        badges: ['Rookie Mapper']
      }
    ]);
    console.log(`👥 Created ${users.length} users`);

    const [admin, alex, business, authority, jordan] = users;

    // ── Create Locations ─────────────────────────
    const locations = await Location.insertMany([
      {
        name: 'Central City Library',
        category: 'public_building',
        address: '456 Oak Ave, Anytown, USA',
        coordinates: { lat: 30.0444, lng: 31.2357 },
        accessibilityStatus: 'accessible',
        accessibilityScore: 5.0,
        features: {
          hasRamp: true, hasElevator: true, hasAccessibleRestroom: true,
          hasAutomaticDoors: true, hasDesignatedParking: true, hasStepFreeEntrance: true
        },
        description: 'Fully accessible library with all modern accessibility features.',
        averageRating: 4.8,
        totalReviews: 45,
        totalVisits: 320,
        submittedBy: alex._id,
        businessOwner: business._id,
        isVerified: true,
        photos: []
      },
      {
        name: 'Main Street Cafe',
        category: 'restaurant',
        address: '123 Main St, Anytown, USA',
        coordinates: { lat: 30.0500, lng: 31.2400 },
        accessibilityStatus: 'partially_accessible',
        accessibilityScore: 3.5,
        features: {
          hasRamp: true, hasElevator: false, hasAccessibleRestroom: false,
          hasAutomaticDoors: false, hasDesignatedParking: true, hasStepFreeEntrance: true
        },
        description: 'Nice cafe with ramp access but limited restroom accessibility.',
        averageRating: 4.2,
        totalReviews: 28,
        totalVisits: 180,
        submittedBy: alex._id,
        businessOwner: business._id,
        isVerified: true,
        photos: []
      },
      {
        name: 'Metro Station - Downtown',
        category: 'transport',
        address: 'Downtown Metro, Anytown, USA',
        coordinates: { lat: 30.0600, lng: 31.2200 },
        accessibilityStatus: 'accessible',
        accessibilityScore: 4.8,
        features: {
          hasRamp: true, hasElevator: true, hasAccessibleRestroom: true,
          hasAutomaticDoors: true, hasDesignatedParking: false, hasStepFreeEntrance: true
        },
        description: 'Metro station with full accessibility support.',
        averageRating: 4.8,
        totalReviews: 62,
        totalVisits: 890,
        submittedBy: jordan._id,
        isVerified: true,
        photos: []
      },
      {
        name: 'Riverside Shopping Mall',
        category: 'mall',
        address: '789 River Rd, Anytown, USA',
        coordinates: { lat: 30.0350, lng: 31.2500 },
        accessibilityStatus: 'partially_accessible',
        accessibilityScore: 3.2,
        features: {
          hasRamp: true, hasElevator: true, hasAccessibleRestroom: true,
          hasAutomaticDoors: true, hasDesignatedParking: true, hasStepFreeEntrance: false
        },
        description: 'Large mall with most accessibility features but some areas remain challenging.',
        averageRating: 3.5,
        totalReviews: 90,
        totalVisits: 560,
        submittedBy: jordan._id,
        isVerified: false,
        photos: []
      },
      {
        name: 'Greenwood Park',
        category: 'park',
        address: 'Greenwood Area, Anytown, USA',
        coordinates: { lat: 30.0700, lng: 31.2100 },
        accessibilityStatus: 'accessible',
        accessibilityScore: 4.5,
        features: {
          hasRamp: true, hasElevator: false, hasAccessibleRestroom: true,
          hasAutomaticDoors: false, hasDesignatedParking: true, hasStepFreeEntrance: true
        },
        description: 'Beautiful accessible park with paved pathways and 3 wheelchair-friendly entrances.',
        averageRating: 4.5,
        totalReviews: 38,
        totalVisits: 245,
        submittedBy: alex._id,
        isVerified: true,
        photos: []
      }
    ]);
    console.log(`📍 Created ${locations.length} locations`);

    // Update saved locations for alex
    await User.findByIdAndUpdate(alex._id, {
      savedLocations: [locations[0]._id, locations[2]._id]
    });

    // ── Create Reviews ───────────────────────────
    const reviews = await Review.insertMany([
      {
        location: locations[0]._id,
        user: alex._id,
        rating: 5,
        content: 'Fantastic accessibility! Automatic doors, spacious elevators, and accessible checkout counters. A model for other places!',
        status: 'approved',
        ownerResponse: {
          content: 'Thank you so much! We strive to be fully inclusive for everyone.',
          respondedAt: new Date(),
          respondedBy: business._id
        }
      },
      {
        location: locations[1]._id,
        user: jordan._id,
        rating: 4,
        content: 'Great ramp access, but the restroom was a bit tight to navigate. Staff were very helpful though!',
        status: 'approved'
      },
      {
        location: locations[2]._id,
        user: alex._id,
        rating: 5,
        content: 'Best transit accessibility I have seen! Elevators always working, clear signage everywhere.',
        status: 'approved'
      },
      {
        location: locations[3]._id,
        user: jordan._id,
        rating: 3,
        content: 'Some areas are hard to reach but the main floor is manageable.',
        status: 'pending'
      }
    ]);
    console.log(`⭐ Created ${reviews.length} reviews`);

    // ── Create Community Posts ───────────────────
    await CommunityPost.insertMany([
      {
        author: jordan._id,
        content: 'Huge success! The new cafe on Elm Street just installed a permanent ramp after our advocacy campaign! Highly recommend checking it out.',
        type: 'post',
        group: 'general',
        likes: [alex._id]
      },
      {
        author: alex._id,
        content: 'Downtown Accessibility Audit Walk - join us this weekend!',
        type: 'event',
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventLocation: 'City Hall Plaza',
        group: 'events'
      }
    ]);
    console.log('💬 Created community posts');

    // ── Create Support Tickets ───────────────────
    await SupportTicket.insertMany([
      {
        user: alex._id,
        name: 'Alex Doe',
        email: 'alex@daleel.com',
        subject: 'Ramp at City Hall is broken',
        message: 'The ramp at the main entrance of City Hall has been damaged and is unusable.',
        status: 'open'
      },
      {
        user: jordan._id,
        name: 'Jordan Smith',
        email: 'jordan@daleel.com',
        subject: 'Incorrect accessibility rating',
        message: 'The rating for Downtown Library seems wrong based on my visit.',
        status: 'resolved'
      }
    ]);
    console.log('🎫 Created support tickets');

    // ── Create Backup Records ────────────────────
    await Backup.insertMany([
      { version: 'v2.1.5', createdBy: admin._id, type: 'manual', status: 'success' },
      { version: 'v2.1.4', createdBy: admin._id, type: 'automatic', status: 'success' },
      { version: 'v2.1.3', createdBy: admin._id, type: 'automatic', status: 'success' }
    ]);
    console.log('💾 Created backup records');

    // ── Create Notifications ─────────────────────
    await Notification.insertMany([
      {
        user: alex._id,
        type: 'review_upvote',
        title: 'Your review got an upvote!',
        message: 'Someone upvoted your review of The Modernist Cafe.',
        isRead: false
      },
      {
        user: alex._id,
        type: 'badge_earned',
        title: 'New Badge Earned!',
        message: "You've unlocked the 'Explorer' badge! Keep contributing.",
        isRead: false
      },
      {
        user: alex._id,
        type: 'new_venue',
        title: 'New Accessible Venue Nearby',
        message: 'A new fully accessible restaurant opened near you.',
        isRead: true
      }
    ]);
    console.log('🔔 Created notifications');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('═══════════════════════════════════');
    console.log('📋 TEST ACCOUNTS:');
    console.log('───────────────────────────────────');
    console.log('🔑 Admin:     admin@daleel.com');
    console.log('🔑 User:      alex@daleel.com');
    console.log('🔑 Business:  business@daleel.com');
    console.log('🔑 Authority: authority@daleel.com');
    console.log('🔒 Password (all): password123');
    console.log('═══════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();