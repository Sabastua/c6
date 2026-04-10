# DJ C6 - Official Portfolio & Booking Platform

A high-end, dynamic Web Application built for DJ C6 to manage bookings, merchandise, and live song requests. Designed with an Apple-inspired glassmorphic UI, the application leverages Next.js and integrates deeply with Safaricom Daraja API for frictionless M-Pesa payments and Meta's WhatsApp Cloud API for real-time notifications.

## 🚀 Features

- **Premium UI/UX:** Built with React & modern CSS featuring hardware-accelerated animations, ambient glowing backdrops, and a seamless light/dark mode switcher.
- **Live Song Request Engine (M-Pesa + WhatsApp):**
  - **M-Pesa STK Push:** Users submit a song request which directly prompts an M-Pesa PIN request via the Safaricom Daraja Sandbox API.
  - **Firebase Webhook Queue:** Securely caches pending transactions during the callback lifecycle.
  - **WhatsApp Alert Delivery:** Safaricom's webhook verifies the payment and instantly dispatches the Fan Name, Song, and Receipt directly to DJ C6's WhatsApp.
- **Booking & Merch Modules:** Smooth interfaces allowing fans to easily request event bookings or order DJ C6 merchandise.

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Custom CSS Variables for Theming
- **Database:** Firebase Firestore (M-Pesa Webhook Storage)
- **APIs:** Safaricom Daraja (M-Pesa), Meta Graphic API (WhatsApp Business)

## 💻 Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and populate it with your specific API credentials:
   ```ini
   # M-Pesa Daraja Sandbox
   MPESA_CONSUMER_KEY=your_key_here
   MPESA_CONSUMER_SECRET=your_secret_here
   MPESA_SHORTCODE=174379
   MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
   MPESA_CALLBACK_URL=https://your-domain.ngrok.io/api/mpesa-callback
   
   # WhatsApp Business Cloud
   WHATSAPP_PHONE_NUMBER_ID=your_id
   WHATSAPP_ACCESS_TOKEN=your_token
   DJ_WHATSAPP_NUMBER=254706404928
   
   # Firebase Database
   FIREBASE_API_KEY=your_key
   FIREBASE_AUTH_DOMAIN=your_domain
   FIREBASE_PROJECT_ID=your_project
   ```
   *(Note: To test M-Pesa callbacks on `localhost`, use `ngrok` or `localtunnel` to route Daraja webhooks to your local machine).*

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deploying to Vercel

The application is heavily optimized for zero-config Vercel deployment:
1. Push your repository to GitHub.
2. Link the repository to your Vercel Dashboard.
3. Completely copy the contents of your `.env.local` into the **Environment Variables** tab in your Vercel project settings.
4. **Important:** Update your `MPESA_CALLBACK_URL` in Vercel to match your new production Vercel domain (e.g., `https://djc6.vercel.app/api/mpesa-callback`).
