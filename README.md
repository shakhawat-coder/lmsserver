# BookNest API - Library Management System (Backend)

BookNest API is a robust, scalable backend solution for a comprehensive Library Management System. Built with Express.js and Prisma ORM, it provides a secure API for managing books, users, memberships, payments, and dynamic content.

## 🚀 Live Links

- **Live Server:** [https://booknestserver-xi.vercel.app/](https://booknestserver-xi.vercel.app/)
- **API Documentation:** [https://booknestserver-xi.vercel.app/api/v1](https://booknestserver-xi.vercel.app/api/v1)

## ✨ Key Features

- **Security & Authentication:**
  - Integrated Better-Auth for secure User Authentication (Email/Password & Google OAuth).
  - RBAC (Role-Based Access Control) for ADMIN, SUPERADMIN, and USER roles.
  - Automated Email Verification via SMTP.
- **Library Resource Management:**
  - Full CRUD operations for Books and Categories with real-time availability tracking.
  - Categorized catalog system for organized browsing.
- **Membership & Subscriptions:**
  - Dynamic Membership Plans (BASIC, SILVER, GOLD) with varying borrow limits and durations.
  - Subscription status tracking and expiration management.
- **Payment Verification:**
  - Integrated payment transaction tracking and status verification.
- **Media Management:**
  - Multer & Cloudinary integration for high-performance image uploads (Book covers, category icons, banners).
- **Banner Module:**
  - Dynamic promotional banner management for the frontend landing page.
- **Database Architecture:**
  - Prisma ORM with PostgreSQL (Neon DB) for reliable data persistence and advanced relations.

## 🛠️ Technologies Used

- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Hosted on Neon)
- **ORM:** Prisma
- **Authentication:** Better-Auth
- **Image Hosting:** Cloudinary
- **Email Service:** Nodemailer (SMTP)
- **File Upload:** Multer
- **Deployment:** Vercel (using tsup for edge-ready builds)

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL Database URL
- Cloudinary Account (for image uploads)
- SMTP Credentials (for email verification)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd bookNestBackend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=
   PORT=5000
   BETTER_AUTH_SECRET= Your secret
   BETTER_AUTH_URL=https://booknestserver-xi.vercel.app
   FRONTEND_URL=https://booknest-tau-virid.vercel.app
   APP_URL=https://booknest-tau-virid.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER= Yout gamil
   SMTP_PASS= Your app password
   EMAIL_FROM="LMS Admin" <youremail@gmail>
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   GOOGLE_CLIENT_ID=Your google clien id
   GOOGLE_CLIENT_SECRET=Your google secret
   GOOGLE_CALLBACK_URL=https://booknestserver-xi.vercel.app/api/auth/callback/google
   ```

````

4. Initialize Prisma:
```bash
npx prisma generate
npx prisma migrate dev --name init
````

5. (Optional) Seed Admin Account:

   ```bash
   npm run seed:admin
   ```

6. Run the development server:

   ```bash
   npm run dev
   ```

7. Build for production:
   ```bash
   npm run build
   ```

---

Developed as part of the Next Level Web Development Assignment.
