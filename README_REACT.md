# ⚛️ ReferEarn - React Version

This is the **modern React version** of the ReferEarn application. It replicates all functionality of the original HTML prototype but with a scalable component-based architecture.

## 🚀 Quick Start

1.  **Install Dependencies** (if not already done)
    ```bash
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```

3.  **Open App**
    http://localhost:5173

## ✨ Key Features & Improvements

### 🏗️ Architecture
*   **Vite + React 18**: Blazing fast development server and optimized builds.
*   **Context API**: Global state management for User, Wallet, and Referral logic (`AppContext.jsx`).
*   **React Router v6**: Client-side routing with protected routes (`ProtectedRoute.jsx`).
*   **Component-Based**: Reusable `Button`, `Input`, and modal components.

### 📱 Enhanced UI/UX
*   **Dashboard Tabs**: Seamless switching between Home, Team, and Wallet views without page reloads.
*   **Interactive Games**: 
    *   🎰 **Spin the Wheel**: CSS animations and random outcomes.
    *   🧩 **Number Puzzle**: Interactive logic puzzle.
    *   🃏 **Memory Match**: Fully functional card flipping game.
*   **Toast Notifications**: Custom hook `useToast` for consistent feedback.
*   **Virtual Wallet**: Mock payment flow and withdrawal simulation.

### 🛠️ Developer Experience
*   **Hot Module Replacement (HMR)**: Instant updates as you code.
*   **Clean Code**: Separated concerns (Logic in Context, UI in Components).
*   **Easy Styling**: CSS modules and global variable system for the dark theme.

## 📂 Project Structure

```
src/
├── components/     # Reusable UI (Button, Input, ProtectedRoute)
├── context/        # Global State (AppContext)
├── hooks/          # Custom Hooks (useToast)
├── pages/          # Main Screens
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx (Home, Team, Wallet tabs)
│   ├── Games.jsx (Spin, Puzzle, Memory)
│   ├── Deposit.jsx
│   └── Payment.jsx
├── services/       # API integration (placeholder)
└── styles/         # Global styles
```

## 🧪 Testing Guide

1.  **Register**: Create a new account.
2.  **Deposit**: Choose a plan (e.g., ₹500) and complete the mock payment.
3.  **Refer**: On the Dashboard, press **Ctrl + R** to simulate a referral joining.
4.  **Earn**: Watch your wallet balance grow.
5.  **Play**: Click "Play Games" when enough referrals unlock the mission.
6.  **Withdraw**: Go to Wallet tab -> Withdraw to simulate cashing out.

## 🔮 Next Steps (Backend)

To make this production-ready:
1.  Connect `AppContext` to a real API (Node/Express).
2.  Replace `localStorage` with database calls.
3.  Integrate real Payment Gateway (Razorpay/Paytm) in `Payment.jsx`.
