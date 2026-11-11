# Waste2Worth – Food Waste Management System

A full-stack, production-grade web application built strictly on the **MERN** stack (MongoDB, Express.js, React.js, Node.js) designed to eliminate urban food waste and hunger. Waste2Worth bridges the gap between surplus food generators (households, restaurants, banquets, supermarkets) and certified non-governmental organizations, shelters, orphanages, and community kitchens in real time.

---

## 1. Project Overview & Problem Statement

### The Food Paradox
Globally, over one-third of all food produced is discarded, while millions of individuals experience severe nutritional insecurity. In metropolitan urban centers, banquet halls, hotels, caterers, and residential societies generate hundreds of kilograms of high-quality cooked surplus food daily. Because food is perishable and logistics coordination is historically fragmented, excess food frequently ends up in municipal landfills—decomposing into harmful greenhouse gases such as methane.

### The Objective
Waste2Worth establishes a centralized, transparent digital ecosystem that:
- Enables donors to post surplus food details, images, portion estimates, and pickup timeframes in under two minutes.
- Uses **GPS-based geospatial intelligence** and the Google Maps API to discover nearby verified charities, NGOs, and municipal public distribution points.
- Delivers **real-time Socket.io notifications** to all stakeholders on donation lifecycle events.
- Employs an intelligent **Food Quantity Decision Engine** to calculate estimated servings and multi-center splitting suggestions.
- Enforces strict administrative verification of recipient organizations to maintain food safety and operational integrity.

---

## 2. Technology Stack

### Frontend
- **React.js 18** (ES6+ with Vite)
- **Tailwind CSS** (Custom food sustainability theme: Emerald, Forest Greens, Warm Earth)
- **React Router DOM v6** (Nested layouts, role-protected routes)
- **Axios** (Configured with request and response interceptors, bearer tokens)
- **Context API** (`AuthContext`, `SocketContext`, `NotificationContext`)
- **Socket.io-client** (Authenticated real-time WebSocket connection)
- **Lucide React** (Clean, modern SVG iconography)
- **Google Maps JavaScript API** (Interactive map, geocoding, proximity markers, and directions)

### Backend
- **Node.js** (v18+)
- **Express.js** (Modular REST API architecture)
- **MongoDB & Mongoose ODM** (Geospatial indexing `2dsphere`, schema validations)
- **JWT (JSON Web Tokens)** (Stateless authorization across REST & Socket.io)
- **bcryptjs** (Salted password hashing, minimum 10 rounds)
- **Socket.io** (Authenticated room-based pub/sub engine)
- **Multer** (Disk-storage image uploads with MIME validation and 5MB limits)
- **Morgan** (HTTP request logging)

---

## 3. System Architecture & Workflows

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Waste2Worth Architecture                         │
└────────────────────────────────────────────────────────────────────────┘

 [ React Frontend (Vite) ]                [ Express.js REST API ]
  ├── Public Pages                         ├── JWT & RBAC Middleware
  ├── Donor Dashboard                      ├── Controllers (Donation, User, Charity)
  ├── Charity Dashboard                    ├── Food Quantity Decision Engine
  ├── Admin Console                        ├── Geospatial Distance Engine (Haversine)
  └── Google Maps Radar View               └── Multer Image Upload Service
            │                                         │
            │ HTTP / WebSocket                        │
            ▼                                         ▼
   [ Socket.io Server ]                   [ MongoDB (Mongoose ODM) ]
    ├── Room: user:<id>                    ├── User & Charity Collections
    ├── Room: role:admin                   ├── Donation Collection (2dsphere)
    └── Room: role:charity                 ├── PublicPlace Collection (2dsphere)
                                           └── DonationActivity (Audit Trail)
```

### Complete Donation Lifecycle
1. **Creation**: Donor submits food name, category, quantity, consumption deadline, photos, and pickup coordinates. System automatically calculates estimated servings. Status: `Available`.
2. **Proximity Alert**: Nearby verified charities receive immediate Socket.io push notifications.
3. **Atomic Acceptance**: A verified charity accepts the donation. An atomic database update guarantees no duplicate claims. Status: `Accepted`.
4. **Collection**: Charity representative arrives at donor location and confirms physical handover. Status: `Collected`.
5. **Fulfillment**: Food is distributed to beneficiaries. Status: `Completed`.
6. **Audit Trail**: Every state transition logs an immutable entry in the `DonationActivity` collection.

---

## 4. Special Functional Modules

### MODULE 1: Food Quantity & Beneficiary Decision
- **API**: `POST /api/food-quantity/calculate`
- **Portion Guidelines**:
  - *Cooked Meals*: 400g per hearty plate
  - *Bakery & Bread*: 150g per portion
  - *Fresh Produce*: 250g per serving
  - *Dairy & Beverages*: 250ml per serving
  - *Packaged Goods*: 1 unit per portion
- **Features**: Live sufficiency alerts comparing available servings to target beneficiaries, transparent calculation step breakdowns, and automated splitting recommendations for large volumes (> 50 servings).

### MODULE 2: Public Place Recommendations
- **API**: `GET /api/recommendations/public-places`
- **Features**: Verified municipal shelters, community kitchens, transit distribution hubs, and public parks. Includes coordinates, operating hours, distance in km, and direct Google Maps navigation links. Admin CRUD enables verified civic locations management.

### MODULE 3: Community Place Suggestions
- **API**: `GET /api/recommendations/community-places`
- **Features**: Discovers nearby registered and verified charities, NGOs, shelters, and orphanages stored in MongoDB. Filters by operational radius (5km to 50km), food requirements, daily beneficiaries, and dietary categories.

---

## 5. Folder Structure

```
waste2worth/
├── client/                           # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/               # Pure SVG Trends & Category Breakdown
│   │   │   ├── common/               # Navbar, Footer, Modal, GoogleMapComponent, StatCard
│   │   │   └── forms/                # FoodQuantityCalculator
│   │   ├── context/                  # AuthContext, SocketContext, NotificationContext
│   │   ├── hooks/                    # useGeolocation, useAuth, useSocket
│   │   ├── layouts/                  # MainLayout, DashboardLayout
│   │   ├── pages/
│   │   │   ├── admin/                # AdminDashboard, UserManagement, CharityVerification, etc.
│   │   │   ├── auth/                 # Login, RegisterDonor, RegisterCharity
│   │   │   ├── charity/              # CharityDashboard, AvailableDonations, Collections, etc.
│   │   │   ├── donor/                # DonorDashboard, CreateDonation, MyDonations, History, etc.
│   │   │   └── public/               # Home, About, HowItWorks, Features, Contact, NotFound
│   │   ├── routes/                   # ProtectedRoute with RBAC
│   │   ├── services/                 # Axios API services for all backend endpoints
│   │   ├── utils/                    # Formatters, distance calculations
│   │   ├── App.jsx                   # Central Application Router
│   │   ├── main.jsx
│   │   └── index.css                 # Tailwind directives & styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                           # Node.js Express Backend
│   ├── config/                       # MongoDB database connection
│   ├── controllers/                  # Route handlers for auth, donations, charities, users, etc.
│   ├── middleware/                   # JWT auth, RBAC authorization, Multer uploads, error handling
│   ├── models/                       # Mongoose schemas (User, Charity, Donation, Notification, etc.)
│   ├── routes/                       # Express router modules
│   ├── scripts/                      # Database seed script & test suite
│   ├── services/                     # SocketService, CalculationService, DistanceService
│   ├── sockets/                      # Socket.io connection and authentication handler
│   ├── uploads/                      # Static storage directory for uploaded food images
│   ├── server.js                     # Main server entrypoint
│   └── package.json
├── .gitignore
└── README.md
```

---

## 6. Pre-Configured Demo Accounts

For immediate evaluation, the database seed script provides ready-to-use accounts across all user roles:

| Role | Email | Password | Details |
|---|---|---|---|
| **Administrator** | `admin@waste2worth.org` | `Admin@1234` | Full platform control, verification rights, audit logs |
| **Donor (Household)** | `donor@waste2worth.org` | `Donor@1234` | Individual household donor (Rahul Verma) |
| **Donor (Restaurant)** | `restaurant@greenleaf.com` | `Donor@1234` | Green Leaf Gourmet Bakery & Cafe |
| **Donor (Hotel)** | `catering@grandpalace.com` | `Donor@1234` | Grand Palace Hotel & Banquet Banquets |
| **Charity (Verified)** | `contact@hopeshelter.org` | `Charity@1234` | Hope Children Orphanage & Shelter (Approved) |
| **Charity (Verified)** | `seva@annapoornakitchen.org` | `Charity@1234` | Annapoorna Community Kitchen (Approved) |
| **Charity (Pending)** | `help@sunshinengo.org` | `Charity@1234` | Sunshine Care Relief NGO (Pending Review) |

*Single-click autofill buttons for these accounts are provided directly on the Login page (`/login`).*

---

## 7. Installation & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

### Step 1: Clone and Environment Setup

#### Backend Environment (`server/.env`):
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/waste2worth
JWT_SECRET=waste2worth_super_secure_jwt_secret_key_2026!
CLIENT_URL=http://localhost:5173
GOOGLE_MAPS_API_KEY=
```

#### Frontend Environment (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
VITE_GOOGLE_MAPS_API_KEY=
```
*(Note: If `VITE_GOOGLE_MAPS_API_KEY` is not provided, the application automatically displays an interactive visual GIS Radar canvas with marker coordinates and direct links to Google Maps directions).*

---

### Step 2: Install Dependencies

```powershell
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

### Step 3: Seed Database with Initial Data

Populates the administrator, sample donors, verified and pending charities, donations across all stages, verified public distribution hubs, and initial notifications:

```powershell
cd server
node scripts/seed.js
```

---

### Step 4: Run the Application

#### Terminal 1 – Start Backend Server:
```powershell
cd server
npm start
# Server listens on port 5001
```

#### Terminal 2 – Start Frontend Client:
```powershell
cd client
npm run dev
# Vite development server runs at http://localhost:5173
```

Open `http://localhost:5173` in your web browser.

---

## 8. Automated Integration Testing

Run the automated 16-point integration test suite validating authentication, RBAC, donation atomic locking, quantity calculation, public places, and notifications:

```powershell
cd server
node scripts/testEndpoints.js
```

---

## 9. REST API Endpoint Reference

### Authentication
- `POST /api/auth/register` – Register as Donor or Charity (Creates linked Charity profile)
- `POST /api/auth/login` – Authenticate user and receive JWT token
- `GET /api/auth/me` – Retrieve currently logged in user profile & linked charity
- `POST /api/auth/logout` – Clear user session

### Donations
- `POST /api/donations` – Create new donation with Multer image upload (Donor/Admin)
- `GET /api/donations` – List donations with category, status, and search filters
- `GET /api/donations/:id` – Retrieve single donation details with activity audit trail
- `GET /api/donations/my-donations` – Retrieve logged-in donor's donations
- `GET /api/donations/available` – Retrieve available donations sorted by proximity
- `POST /api/donations/:id/accept` – Atomically accept available donation (Verified Charity)
- `POST /api/donations/:id/reject` – Decline donation with reason (Charity/Admin)
- `PUT /api/donations/:id/collect` – Mark food as collected (Accepted Charity/Admin)
- `PUT /api/donations/:id/complete` – Mark distribution complete (Accepted Charity/Admin)
- `DELETE /api/donations/:id` – Cancel uncollected donation (Donor/Admin)

### Decision & Recommendations
- `POST /api/food-quantity/calculate` – Calculate estimated servings, sufficiency, and multi-center split suggestions
- `GET /api/recommendations/public-places` – Retrieve nearby verified civic distribution points with distance
- `GET /api/recommendations/community-places` – Retrieve nearby verified charities with distance
- `GET /api/recommendations/nearby` – Combined proximity recommendations

### Administration
- `GET /api/users` – Admin user directory with role and status filters
- `PUT /api/users/:id/status` – Activate, suspend, or deactivate user account
- `GET /api/charities` – Charity directory with verification status filters
- `PUT /api/charities/:id/verify` – Approve or reject charity registration with reason
- `POST /api/public-places` – Create verified civic distribution point
- `PUT /api/public-places/:id` – Update distribution point
- `DELETE /api/public-places/:id` – Remove distribution point
- `GET /api/analytics/admin` – Platform-wide intelligence and impact metrics
- `GET /api/analytics/donor` – Donor-specific contribution analytics
- `GET /api/analytics/charity` – Charity-specific meal distribution analytics

### Real-time Notifications
- `GET /api/notifications` – Retrieve user notifications and unread count
- `PUT /api/notifications/:id/read` – Mark individual notification as read
- `PUT /api/notifications/read-all` – Mark all user notifications as read

---

## 10. Security & Standards Compliance
- **Zero Plain-Text Passwords**: Passwords hashed using bcryptjs with 10 salt rounds.
- **Atomic Operations**: `findOneAndUpdate` with status criteria prevents concurrent claim race conditions.
- **Role-Based Authorization**: Protected routes enforce strict access controls on both Express APIs and React frontend navigation.
- **Verification Gate**: Only charities verified by administrators (`verificationStatus === 'Approved'`) are permitted to accept donations.
- **Safe File Storage**: Multer verifies MIME types, limits file size to 5MB, and assigns random collision-resistant filenames.

---

## 11. License
This project is open-source under the MIT License. Developed for social good and zero food waste sustainability.
