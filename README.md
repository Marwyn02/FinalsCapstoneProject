# Crisanto Transient House: A Staycation Booking Website

## 🚀 Introduction

**Crisanto Transient House** is a **staycation booking website** designed to provide a seamless and user-friendly experience for booking transient accommodations. The platform allows users to browse available rooms, make reservations, and complete payments online. It is built with modern web technologies to ensure efficiency, security, and scalability.

## 📌 Features

- **Room Availability & Booking System**
- **Secure Online Payments via PayMongo**
- **Image Upload & Management via Cloudinary**
- **Admin Dashboard for Reservation Management**
- **Email Notifications for Bookings & Payments via Nodemailer**
- **OTP Verification for Secure Login & Transactions**
- **Interactive Maps via Mapbox**
- **Global State Management using Zustand**
- **Responsive UI for Desktop & Mobile Users**

## 🛠 Technologies Used

- **Frontend:** Next.js
- **Backend & ORM:** Prisma
- **Database:** PostgreSQL
- **Image Hosting:** Cloudinary
- **Payment Processing:** PayMongo
- **Emailing & OTP Verification:** Nodemailer
- **Maps & Location Services:** Mapbox
- **State Management:** Zustand

## 📂 Project Structure

```
/my-app
│── /app
│   ├── /api
│   ├── /store      # Zustand Store
│   ├── /utils      # Utility Helper Functions
│   ├── /(routes)       # All Routings
│── /components         # Small Components Features (like map, and navigation)
│── /features
│   ├── (feature-folders)       # All Websites Features
│── /prisma
│   ├── schema.prisma      # Prisma Schema
│── .env.local             # Environment Variables
│── package.json           # Project Dependencies
│── README.md              # Documentation
```

## ⚙️ Installation

1. Clone this repository:

   ```sh
   git clone https://github.com/Marwyn02/FinalsCapstoneProject.git
   cd my-app
   ```

2. Install dependencies:

   ```sh
   npm install  # or yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add:

   ```env
   DATABASE_URL=your_postgresql_database_url
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PAYMONGO_SECRET_KEY=your_paymongo_secret_key
   PAYMONGO_PUBLIC_KEY=your_paymongo_public_key
   EMAIL_HOST=smtp.your-email-provider.com
   EMAIL_PORT=your_email_port
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

4. Set up the database:

   ```sh
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```sh
   npm run dev  # or yarn dev
   ```

**⚠️ Important:** The website must be **hosted online** for full functionality, including payments, image uploads, and email services.

## 🔧 Usage

1. Navigate to `http://localhost:3000`.
2. Browse available dates.
3. Complete the booking form and proceed to checkout.
4. Use OTP verification for secure login and transactions.
5. Make a secure payment using PayMongo.
6. Receive a booking confirmation via email.
7. Global state management is handled using **Zustand** for a seamless experience.

## 🔥 Future Improvements

- Implement **webhooks** for real-time payment status updates.
- Add **customer reviews & ratings**.
- Enhance **admin dashboard** for better reservation management.
- Optimize **SEO & performance** for better user reach.

## 🤝 Contributing

Feel free to **fork** this repo, improve it, and submit a **pull request**! 🚀

## 📝 License

This project is open-source and available under the **MIT License**.

---

💡 **Need help?** Contact me at jhunmarwynsumargo@gmail.com or open an issue on GitHub!
