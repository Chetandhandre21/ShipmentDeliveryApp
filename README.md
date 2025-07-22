📦 Shipment Delivery Application
A modern and responsive web application that enables users to register, create shipments, make payments, and track delivery status. Admins can verify shipments, schedule warehouse storage, and assign delivery personnel.

🚀 Features
👥 User Features
User Registration & Login (via Firebase Authentication)

Create new shipment with details:

Sender, Receiver

Package size, Shipment Type

Address, Insurance, Delivery Speed

Razorpay Payment Integration

Track shipments using tracking ID

Responsive UI for mobile and desktop

🛠️ Admin Features
Verify and approve shipment details & payment

Schedule warehouse storage

Assign delivery personnel

Admin-only visibility and controls

🧱 Tech Stack
Layer	Technology
Frontend	React.js
Styling	CSS (custom)
Backend	Firebase Firestore & Authentication
Payment	Razorpay Integration


📁 Folder Structure
pgsql
Copy
Edit
shipment-delivery-app/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ShipmentForm.jsx
│   │   ├── ShipmentList.jsx
│   │   ├── TrackingPage.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── services/
│   │   ├── firebase.js
│   │   └── razorpay.js
│   │
│   ├── App.js
│   ├── index.js
│   └── index.css
│
├── .env
├── package.json
└── README.md

-Install dependencies
npm install
