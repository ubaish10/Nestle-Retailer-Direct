# Loyalty Program Implementation

## Overview

A personalized loyalty-based system has been added on top of the existing promo codes. The system tracks each retailer's activity (total orders and amount spent), automatically assigns loyalty points when orders are approved, and places retailers into tiers (Bronze, Silver, Gold, Platinum). Each tier has a predefined reward (discount percentage) that is automatically applied to orders.

## Key Features

1. **Automatic Points Earning**: Retailers earn 1 point for every LKR 100 spent on approved orders
2. **Tier-Based Rewards**: Four tiers with increasing discount benefits
3. **Automatic Discount Application**: System automatically applies the best discount (loyalty or promo code)
4. **Personalized Experience**: Rewards are based on each retailer's behavior
5. **Simple Management**: Admin can view and manage loyalty program from dashboard

## Loyalty Tiers

| Tier | Points Required | Discount | Color |
|------|-----------------|----------|-------|
| Bronze | 0 - 4,999 | 2% | #CD7F32 |
| Silver | 5,000 - 14,999 | 3.5% | #C0C0C0 |
| Gold | 15,000 - 29,999 | 5% | #FFD700 |
| Platinum | 30,000+ | 7.5% | #E5E4E2 |

## How It Works

### For Retailers

1. **Earn Points**: Every time an order is approved, points are calculated based on the final amount paid
2. **Advance Tiers**: As points accumulate, retailers automatically advance to higher tiers
3. **Automatic Discounts**: The system automatically applies the best discount (loyalty or promo code) at checkout
4. **View Status**: Retailers can view their loyalty status on the Promotions & Rewards page

### For Admins

1. **View Statistics**: Admin dashboard shows loyalty program statistics
2. **Manage Tiers**: View and understand tier distribution across retailers
3. **Monitor Points**: Track total points issued across the platform

## Technical Implementation

### Database Changes

- `loyalty_tiers` table: Stores tier configurations
- `users.loyalty_points`: Tracks retailer's accumulated points
- `users.loyalty_tier_id`: References current tier
- `orders.loyalty_discount_amount`: Tracks loyalty discount applied
- `orders.used_loyalty_discount`: Boolean flag for loyalty discount usage

### New Files Created

#### Backend
- `app/Models/LoyaltyTier.php` - Loyalty tier model
- `app/Services/LoyaltyService.php` - Business logic for loyalty calculations
- `app/Http/Controllers/LoyaltyController.php` - API controller for loyalty
- `database/seeders/LoyaltyTierSeeder.php` - Seeds default tiers

#### Frontend
- `resources/js/components/loyalty-status.tsx` - Loyalty status display component
- `resources/js/components/ui/progress.tsx` - Progress bar component
- `resources/js/pages/admin/loyalty/index.tsx` - Admin loyalty management page

#### Migrations
- `database/migrations/2026_05_02_000001_create_loyalty_tiers_table.php`
- `database/migrations/2026_05_02_000002_add_loyalty_points_to_users_table.php`
- `database/migrations/2026_05_02_000003_add_loyalty_discount_to_orders_table.php`

### Modified Files

- `app/Models/User.php` - Added loyalty relationships and methods
- `app/Models/Order.php` - Added loyalty discount fields
- `app/Http/Controllers/OrderController.php` - Integrated loyalty discount calculation
- `app/Http/Controllers/PayPalController.php` - Added loyalty discount handling
- `app/Http/Controllers/DistributorController.php` - Award points on order approval
- `app/Http/Middleware/HandleInertiaRequests.php` - Share loyalty data with frontend
- `routes/web.php` - Added loyalty API routes
- `resources/js/pages/retailer/promotions.tsx` - Added loyalty status section

## API Endpoints

- `GET /api/loyalty/status` - Get current user's loyalty status
- `POST /api/loyalty/calculate-discount` - Calculate best discount for cart
- `GET /api/loyalty/tiers` - Get all loyalty tiers
- `GET /loyalty` - Admin loyalty management page (admin only)
- `GET /api/loyalty/stats` - Admin loyalty statistics (admin only)

## Setup Instructions

1. Run migrations:
   ```bash
   php artisan migrate
   ```

2. Seed loyalty tiers:
   ```bash
   php artisan db:seed --class=LoyaltyTierSeeder
   ```

3. Install frontend dependencies:
   ```bash
   npm install
   ```

## Usage

### Retailer View

1. Navigate to `/retailer/promotions` to see loyalty status and active promotions
2. Loyalty discount is automatically applied at checkout
3. Points are awarded when orders are approved

### Admin View

1. Navigate to `/loyalty` to view loyalty program management
2. View tier distribution and statistics
3. Monitor total points issued

## Discount Logic

When a retailer places an order:
1. System calculates loyalty discount based on tier
2. If promo code is provided, system calculates promo discount
3. System applies the higher of the two discounts (not both)
4. A message is shown indicating which discount was applied

## Points Calculation

- Points are calculated on the final amount paid (after discounts)
- 1 point = LKR 100 spent
- Points are awarded only when orders are approved
- Tier is automatically updated when points threshold is reached