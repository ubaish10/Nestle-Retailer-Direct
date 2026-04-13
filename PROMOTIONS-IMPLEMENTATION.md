# Retailer Promotion and Discount System - Implementation Guide

## Overview
This document describes the complete implementation of the Retailer Promotion and Discount System for the Nestle-Retailer-Direct application, as specified in Sprint 2.

## Features Implemented

### 1. Admin Promotion Management
- **Create Promotions**: Admins can create time-based promotions with:
  - Title and description
  - Unique promo code (auto-generated or manual)
  - Discount type (percentage or fixed amount)
  - Discount value
  - Minimum order amount (optional)
  - Maximum discount cap (for percentage discounts)
  - Start and expiry dates
  - Usage limits
  - Product-specific restrictions (optional)
  - QR code generation for each promo code

- **View Promotions**: Dashboard showing all promotions with:
  - Status badges (Active, Expired, Scheduled, Inactive)
  - Usage statistics
  - Days remaining for active promotions
  - QR code viewing capability

- **Edit/Delete Promotions**: Full CRUD operations

### 2. Retailer Experience
- **Active Promotions Display**: 
  - Shows on retailer homepage
  - Compact view with key information
  - Copy promo code to clipboard
  - View QR codes for promotions

- **Promo Code Application**:
  - Manual entry during checkout
  - QR code scanning support (UI ready)
  - Real-time validation
  - Instant discount application

### 3. System Validation
The system validates promotions by checking:
- Promo code exists
- Promotion is active
- Current date is within valid period (start_date <= now <= expiry_date)
- Usage limit not exceeded
- Minimum order amount met (if specified)
- Products in cart match promotion's applicable products (if restricted)

### 4. Discount Application
- Discounts applied to order total before payment
- Works with all payment methods (COD, PayPal, Credit Card)
- Shows original and discounted amounts
- Tracks promotion usage in orders

### 5. Automatic Expiration
- Scheduled command runs daily to deactivate expired promotions
- Automatically removes expired promotions from active lists

## Database Schema

### promotions table
```sql
- id (primary key)
- title
- description (nullable)
- promo_code (unique)
- discount_type (enum: 'percentage', 'fixed')
- discount_value
- minimum_order_amount (nullable)
- maximum_discount_amount (nullable)
- start_date
- expiry_date
- is_active (boolean)
- usage_limit (nullable)
- usage_count
- timestamps
- indexes on (is_active, start_date, expiry_date), promo_code
```

### promotion_products table (pivot)
```sql
- id (primary key)
- promotion_id (foreign key -> promotions)
- product_id (foreign key -> products)
- unique constraint on (promotion_id, product_id)
```

### orders table (updated)
```sql
Added fields:
- promotion_id (foreign key -> promotions, nullable)
- discount_amount
- promo_code
```

## File Structure

### Backend (PHP/Laravel)
```
database/migrations/
  ├── 2026_04_13_000000_create_promotions_table.php
  ├── 2026_04_13_000001_create_promotion_products_table.php
  └── 2026_04_13_000002_add_promotion_fields_to_orders_table.php

app/Models/
  └── Promotion.php

app/Http/Controllers/
  └── PromotionController.php

app/Console/Commands/
  └── DeactivateExpiredPromotions.php

database/seeders/
  └── PromotionSeeder.php
```

### Frontend (React/TypeScript)
```
resources/js/
  ├── pages/
  │   └── admin/
  │       └── promotions/
  │           ├── index.tsx (list view)
  │           ├── create.tsx
  │           ├── edit.tsx
  │           └── form.tsx (shared form)
  ├── components/
  │   ├── active-promotions.tsx
  │   └── promo-code-input.tsx
  └── types/
      └── promotions.ts
```

## API Endpoints

### Admin Routes (require admin authentication)
```
GET    /promotions                - List all promotions
GET    /promotions/create         - Create promotion form
POST   /promotions                - Store new promotion
GET    /promotions/{id}/edit      - Edit promotion form
PUT    /promotions/{id}           - Update promotion
DELETE /promotions/{id}           - Delete promotion
GET    /promotions/generate-code  - Generate unique promo code
```

### Public Routes (authenticated users)
```
POST   /api/promo-code/validate   - Validate and apply promo code
GET    /api/promotions/active     - Get active promotions
```

## Usage Flow

### Admin Creates Promotion
1. Admin logs into dashboard
2. Navigates to Promotions section
3. Clicks "Create Promotion"
4. Fills in promotion details
5. Optionally generates QR code
6. Publishes promotion

### Retailer Uses Promotion
1. Retailer logs in and sees active promotions on homepage
2. Copies promo code or scans QR code
3. Goes to quick-reorder page
4. Adds items to cart
5. Enters promo code in checkout
6. System validates and applies discount
7. Retailer completes order with discounted total

## Validation Rules

### Promotion Creation
- Title: required, max 255 chars
- Promo code: required, unique, auto-uppercased
- Discount type: required (percentage or fixed)
- Discount value: required, numeric, min 0
- Start date: required, valid date
- Expiry date: required, must be after start date

### Promo Code Validation
- Code must exist in database
- Must be active
- Must be within valid date range
- Usage count must be below limit (if set)
- Order total must meet minimum (if specified)
- Products must match (if promotion is product-specific)

## Security Features
- Admin-only access to promotion management
- CSRF protection on all endpoints
- Server-side validation (never trust client)
- Usage count tracking to prevent abuse
- Automatic expiration prevents stale promotions

## Sample Data
The PromotionSeeder creates 6 sample promotions:
1. **SPRING2026** - 15% off, min $100 order, max $200 discount
2. **WELCOME50** - $50 off for new retailers, min $200 order
3. **LOYALTY10** - 10% off, no restrictions
4. **FEATURED20** - 20% off specific products
5. **NEWYEAR2025** - Expired promotion (for testing)
6. **SUMMER25** - Future scheduled promotion

## Running the Feature

### Setup Commands
```bash
# Run migrations
php artisan migrate

# Seed sample promotions
php artisan db:seed --class=PromotionSeeder

# Manually run expiration check
php artisan promotions:deactivate-expired

# Start development server
npm run dev
php artisan serve
```

## Testing Checklist

- [x] Admin can create promotions with all fields
- [x] QR codes are generated for promo codes
- [x] Promotions appear on retailer homepage
- [x] Promo code validation works correctly
- [x] Discounts apply to order total
- [x] Expired promotions are rejected
- [x] Invalid promo codes show error messages
- [x] Usage limits are enforced
- [x] Product-specific promotions work
- [x] All payment methods support promotions
- [x] Scheduled command deactivates expired promotions
- [x] Order records include promotion data

## Future Enhancements
- QR code scanning using device camera
- Email notifications for new promotions
- Promotion usage analytics dashboard
- Bulk promotion creation
- Promotion templates
- A/B testing for promotions
- Retailer-specific targeted promotions
- Promotion sharing between retailers

## Notes
- The QR code scanning UI is prepared but requires a camera access library (e.g., `html5-qrcode`) for full functionality
- The promotion system integrates seamlessly with existing PayPal and credit card payment flows
- All promotion data is type-safe with TypeScript definitions
- The system is designed to be easily extended with additional promotion types and rules
