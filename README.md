# 🎁 Ethio Rewards — Merchant Loyalty & Cashback Platform (ኢትዮ ሪዋርድስ)

An enterprise-grade, full-stack merchant loyalty, rewards, and cashback platform designed specifically for the Ethiopian retail and service ecosystem (supermarkets, cafes, fuel stations, electronics, and pharmacies).

Built with **React (Vite) + Tailwind CSS** frontend, **Node.js (Express)** backend, and **MongoDB**.

---

## 🇪🇹 Bilingual Architecture (Amharic & English)
- **Default Language**: **አማርኛ (Amharic)**
- **One-Click Switcher**: Switch anytime between **🇪🇹 አማርኛ** and **🇬🇧 English** via the language selector in the top navigation bar.
- Fully localized dictionary (`frontend/src/utils/translations.js`) covering all customer, cashier, and admin interfaces, tier names (ነሐስ፣ ብር፣ ወርቅ፣ ፕላቲነም), currency formatting (ብር / ETB), and status alerts.

---

## 🌟 Key Features

### 1. 🛍️ For Shoppers & Customers (ለሸማቾች)
- **Instant Cashback & Points**: Earn points on retail purchases at registered Ethiopian partner stores (e.g. 5% cashback, where 10 ETB = 1 Point).
- **Dynamic Digital Loyalty Pass**: Interactive digital card with **live dynamic QR code** and barcode containing Member ID (`ETR-XXXXXX`) for checkout scanning.
- **Tier-Based Loyalty Perks**:
  - 🥉 **ነሐስ (Bronze)**: 1.0x standard points
  - 🥈 **ብር (Silver - 1,000+ Pts)**: 1.1x points boost
  - 🥇 **ወርቅ (Gold - 4,000+ Pts)**: 1.25x points boost
  - 💎 **ፕላቲነም (Platinum - 10,000+ Pts)**: 1.5x points boost + priority payouts
- **Dual Redemption Methods**:
  1. **Retail Discount Vouchers**: Claim vouchers (e.g. 50 ETB off at Kaldi's, 100 ETB off at Friendship Supermarket).
  2. **Direct Cashout**: Request points payouts directly to **Telebirr**, **Ethio Telecom Airtime**, or **CBE Birr**.
- **Referral Rewards**: Share personal referral code (`ABRHAM99`) to give 100 Welcome Points and earn 50 Points on every friend who signs up.

### 2. 🧾 For Merchant Cashiers (POS Terminal) (ለካሼሮች)
- **Live Customer Identification**: Real-time lookup by scanning customer QR or entering Ethiopian phone number (`+2519...`).
- **Instant Points & Cashback Issuance**: Enter bill subtotal in ETB and issue points with automatic tier multipliers.
- **Digital Receipt Generation**: Printable digital receipt with unique transaction numbers.
- **In-Store Voucher Redemption**: Validate and redeem customer discount vouchers directly at checkout.
- **Cashier Shift Overview**: Real-time tracking of today's sales volume, points awarded, and vouchers accepted.

### 3. 🛡️ For Platform Super Admin (ለአስተዳዳሪዎች)
- **Platform Analytics**: Gross Merchandise Value (GMV) in ETB, total points issued/redeemed, and circulating cash liability.
- **Telebirr & Airtime Payout Queue**: Review, approve, or reject customer cashout requests with automated points refund on rejection.
- **Partner Merchants Verification**: Onboard and manage retail merchants and their cashback rates.
- **Network Audit Log**: Immutable record of every transaction across the network.

---

## 🏛️ Seeded Partner Merchants

| Merchant | Category | Cashback Rate | Location |
|---|---|---|---|
| **Kaldi's Coffee** (*ካልዲስ ቡና*) | Cafe & Restaurant | 6% | Bole Medhanialem, Camrose Bldg |
| **Friendship Supermarket** (*ፍሬንድሺፕ ሱፐርማርኬት*) | Supermarket | 5% | Bole Road, Friendship City Center |
| **TotalEnergies Meskel** (*ቶታል ኤነርጂስ*) | Fuel Station | 3% | Meskel Square |
| **Snap Electronics & Gadgets** (*ስናፕ ኤሌክትሮኒክስ*) | Electronics | 4% | Bole Edna Mall |
| **Lions Pharmacy & Health** (*አንበሳ ፋርማሲ*) | Health & Pharmacy | 5% | Sarbet |

---

## ⚡ Quickstart Guide

### 1. Start the Backend API
```powershell
cd backend
npm install
npm run seed     # Seeds realistic Ethiopian demo data & merchants
npm run dev      # Runs Express server on http://localhost:5000
```
> **Zero-Config Database**: The backend automatically connects to MongoDB at `mongodb://127.0.0.1:27017/ethio_rewards`. If a local MongoDB daemon is not running, it automatically falls back to an embedded in-memory database instance!

### 2. Start the Frontend Application
```powershell
cd frontend
npm install
npm run dev      # Launches Vite dev server on http://localhost:5173
```

---

## 🔑 Demo Accounts for 1-Click Testing

All demo accounts use password: `password123`

| Role | Name | Phone Number | Features to Test |
|---|---|---|---|
| **Customer (ወርቅ - Gold)** | Abreham Tadesse | `+251911333333` | 4,250 Pts (425 ETB), Digital QR Card, Claim vouchers, Telebirr payout |
| **Customer (ብር - Silver)** | Selamawit Bekele | `+251911444444` | 1,450 Pts (145 ETB), Recent welcome bonus |
| **Merchant Cashier** | Dawit Haile | `+251911111111` | Kaldi's POS Terminal: Award points on bill, validate customer vouchers |
| **Super Admin** | Platform Admin | `+251911000000` | Full KPIs, Telebirr Payout Queue approval, partner stores |

---

## 📜 License
Developed for Ethiopian retail commerce and digital rewards innovation. ISC License.
