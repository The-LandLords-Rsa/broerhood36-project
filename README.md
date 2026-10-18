# BROERHOOD36 - South African E-Commerce Marketplace

South Africa's premier youth marketplace for authentic sneakers, flagship mobile technology, official football kits, and German precision shisha rentals.

## 🚀 How to Run Locally in VSCode

### 1. Requirements
- **Node.js**: v18.0.0 or higher
- **npm** (comes with Node.js) or **pnpm** / **yarn**

### 2. Setup Instructions
```bash
# 1. Open the project folder in VSCode
code .

# 2. Install all dependencies
npm install

# 3. Start the local development server
npm run dev
```

### 3. Open in Browser
Visit [http://localhost:3000](http://localhost:3000) or the port displayed in your terminal.

---

## 🛠️ Tech Stack & Features
- **Frontend**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL with Realtime & Auth)
- **Payment & Order Routing**:
  - Direct WhatsApp Dispatch to **both lines**:
    - **Line 1 (Sales & Kicks)**: `+27 64 901 3150`
    - **Line 2 (Rentals & Dispatch)**: `+27 69 978 1083`
  - Central Email Routing: `broer.hood.36@gmail.com`
  - PayFast sandbox checkout (test mode only; live payments are not configured)
- **Key Modules**:
  - Shopping Bag / Cart with promo codes & threshold tracking
  - Server-verified PayFast payment notifications before orders are marked paid
  - German Hubbly Rental Booking Engine with date picker & add-ons
  - Order status and courier tracking details stored in Supabase
  - Dedicated Multi-Channel Enquiry Portal
  - Admin Management Console with live order synchronization
