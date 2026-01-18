# 🏨 TouchMe+ | Modern Room & Hall Booking Platform

![TouchMe+ Banner](https://via.placeholder.com/1200x400?text=TouchMe%2B+Preview) 
*(Replace this link with a screenshot of your dashboard later)*

**TouchMe+** is a full-stack MERN application designed for seamless booking of halls, villas, and rooms. It features a robust multi-vendor system where Super Admins can manage property owners, and Owners can manage their own inventory and bookings.

## 🚀 Key Features

* **🎨 Dynamic Branding:** Custom "Black & Yellow" theme with full **Dark Mode** support.
* **👥 Role-Based Access Control (RBAC):**
    * **Super Admin:** View all properties, Create new Owners, Assign properties to Owners.
    * **Owner:** Manage only their own properties and view their specific bookings.
    * **User:** Browse venues, check availability, and book slots.
* **📅 Smart Booking Engine:** Prevents double bookings and handles different pricing models (Per Night vs. Per Slot).
* **⚡ Instant Admin Actions:** Create new Owner accounts instantly via a modal popup.
* **📱 Responsive Design:** Fully optimized for mobile and desktop using Tailwind CSS.

## 🛠️ Tech Stack

* **Frontend:** React (Vite), TypeScript, Tailwind CSS, Lucide Icons.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose).
* **Authentication:** Custom Role-Based Auth (Admin/Owner/User).

---

## 💻 Installation & Setup

### 1. Clone the Repo
```bash
git clone [https://github.com/YOUR_USERNAME/touchme-plus-booking.git](https://github.com/YOUR_USERNAME/touchme-plus-booking.git)
cd touchme-plus-booking
```

### 2. Backend Setup
```bash
cd server
npm install
node index.js
```
*Server runs on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
*Client runs on `http://localhost:5173`*

---

## 🔑 Login Credentials (Seed Data)

To populate the database with test users, visit: `http://localhost:5000/api/seed-users`

| Role | Username | Password | Access |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `admin123` | Full Access (Add Property, Create Owners) |
| **Owner (Ali)** | `ali` | `123` | Can manage "Ali's Grand Hall" |
| **Owner (Sara)** | `sara` | `123` | Can manage "Sara's Beach Villa" |

---

## 📸 Screenshots

| Dark Mode Dashboard | Booking Form |
| :---: | :---: |
| ![Dark Mode](LINK_TO_IMAGE_1) | ![Booking](LINK_TO_IMAGE_2) |

---

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request