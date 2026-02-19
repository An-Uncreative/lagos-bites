
Lagos Bites — Fullstack Restaurant Ordering System

A production-ready restaurant ordering system built with the MERN stack and integrated with Paystack for secure payment processing.

**Live Demo:**
https://gleeful-frangollo-b44b48.netlify.app

**Backend API:**
https://paystack-integration-goz9.onrender.com

## Overview

Lagos Bites is a fullstack web application that allows users to browse meals, add items to a cart, place orders, and complete payment securely using Paystack.

The system demonstrates:

- Frontend state management and routing
- Backend data validation and business logic enforcement
- Secure server-side payment verification
- Production deployment with CORS configuration
- Environment-based configuration management

This project was built to simulate a real-world restaurant ordering workflow with proper architectural and security considerations.

## Problem

Many small restaurants rely on manual order collection through WhatsApp or phone calls. This leads to:

- Order miscommunication
- Manual payment confirmation
- No centralized tracking
- Poor user experience

Lagos Bites provides a structured ordering system with secure online payments and server-side verification to eliminate these issues.

## Core Features
### Customer Experience

- Browse dynamic meal listings from MongoDB
- Add items to cart with local state persistence
- Checkout with delivery details
- Secure payment via Paystack inline integration
- Payment confirmation and order success flow

### Backend & Security

- Server-side price validation (prevents client-side tampering)
- Order creation with recalculated totals
- Secure Paystack verification on backend
- Idempotent payment verification logic
- Environment-based configuration
- CORS handling for production environments

## Architecture Decisions
### 1. Server-Side Price Validation

Meal prices are fetched directly from MongoDB during order creation.
The backend does not trust client-submitted prices.

### 2. Payment Verification on Backend

Even after successful Paystack popup payment, the transaction is verified server-side before marking the order as paid.

This prevents:

- Fake payment confirmations
- Client-side manipulation
- Reference tampering

### 3. Environment-Based Configuration

All secrets and URLs are managed using environment variables.
No API keys are exposed in version control.

### 4. Production Deployment Setup

- Backend deployed on Render
- Frontend deployed on Netlify
- CORS dynamically configured
- Preflight requests handled correctly

## Tech Stack
### Frontend

- React (Vite)
- React Router
- Fetch API
- LocalStorage for cart persistence

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Zod for request validation
- Paystack API

### Deployment

- Netlify (Frontend)
- Render (Backend)

## Folder Structure

```
/client   → React frontend (Vite)
/server   → Express backend API
```

## Local Development
### Backend
```
cd server
npm install
npm run dev
```

### Frontend
```
cd client
npm install
npm run dev
```

## Environment Variables
### Backend (.env)
```
PORT=5000
MONGO_URI=
PAYSTACK_SECRET_KEY=
CLIENT_ORIGIN=
```

### Frontend (.env)
```
VITE_API_BASE_URL=
VITE_PAYSTACK_PUBLIC_KEY=
```

## Future Improvements

- Admin dashboard for order management
- Order status tracking (pending, preparing, delivered)
- Sales analytics dashboard
- Authentication for restaurant staff
- Payment webhook enhancements

This project demonstrates fullstack engineering principles including API design, validation, security, third-party integrations, and production deployment.
