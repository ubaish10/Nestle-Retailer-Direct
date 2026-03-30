<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Features;
use App\Http\Controllers\Dashboard\AccountsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DistributorController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\QuickReorderController;
use App\Http\Controllers\RetailerInventoryController;
use App\Http\Controllers\PayPalController;
use App\Http\Controllers\UserApprovalsController;
use App\Http\Controllers\Settings\ProfileController;

// Home route - redirects based on user role
Route::get('/', function () {
    if (Auth::check()) {
        if (Auth::user()->isDistributor()) {
            return redirect()->route('distributor.home');
        }
        if (Auth::user()->isAdmin()) {
            return redirect()->route('dashboard');
        }
        // Retailers stay on the home page (nestle-system-analysis)
        return inertia('nestle-system-analysis', [
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
    // Redirect to login for unauthenticated users
    return redirect()->route('login');
})->name('home');

// Clear approval status session (used after admin approval)
Route::post('/clear-approval-status', function (\Illuminate\Http\Request $request) {
    $request->session()->forget(['status', 'email_for_approval_check']);
    return redirect()->route('login');
})->name('clear-approval-status');

// Distributor routes
Route::middleware(['auth', 'verified', 'distributor'])->group(function () {
    Route::get('/distributor/home', [DistributorController::class, 'home'])->name('distributor.home');
    Route::get('/distributor/orders', [DistributorController::class, 'orders'])->name('distributor.orders');
    Route::get('/distributor/retailer-orders', [DistributorController::class, 'retailerOrders'])->name('distributor.retailer-orders');
    Route::get('/distributor/incoming-orders', [DistributorController::class, 'incomingOrders'])->name('distributor.incoming-orders');
    Route::post('/distributor/orders/{order}/approve', [DistributorController::class, 'approveOrder'])->name('distributor.orders.approve');
    Route::post('/distributor/orders/{order}/reject', [DistributorController::class, 'rejectOrder'])->name('distributor.orders.reject');
    Route::post('/distributor/retailer-orders/{order}/approve', [DistributorController::class, 'approveRetailerOrder'])->name('distributor.retailer-orders.approve');
    Route::post('/distributor/retailer-orders/{order}/reject', [DistributorController::class, 'rejectRetailerOrder'])->name('distributor.retailer-orders.reject');
    Route::post('/distributor/incoming-orders/{order}/approve', [DistributorController::class, 'approveIncomingOrder'])->name('distributor.incoming-orders.approve');
    Route::post('/distributor/incoming-orders/{order}/reject', [DistributorController::class, 'rejectIncomingOrder'])->name('distributor.incoming-orders.reject');
    Route::post('/distributor/incoming-orders/delete-approved', [DistributorController::class, 'deleteApprovedOrders'])->name('distributor.incoming-orders.delete-approved');
    Route::post('/distributor/orders/{order}/status', [DistributorController::class, 'updateOrderStatus'])->name('distributor.orders.status');
    Route::get('/distributor/delivery', [DistributorController::class, 'delivery'])->name('distributor.delivery');
    Route::get('/distributor/statistics', [DistributorController::class, 'statistics'])->name('distributor.statistics');
    Route::get('/distributor/schedule', [DistributorController::class, 'schedule'])->name('distributor.schedule');
    Route::get('/distributor/retailers', [DistributorController::class, 'retailers'])->name('distributor.retailers');
    Route::get('/distributor/dashboard', [DistributorController::class, 'dashboard'])->name('distributor.dashboard');
    Route::get('/distributor/notifications', [DistributorController::class, 'notifications'])->name('distributor.notifications');
    Route::get('/distributor/warehouse-inventory', [DistributorController::class, 'warehouseInventory'])->name('distributor.warehouse-inventory');
    Route::post('/distributor/warehouse-inventory/{product}/restock', [DistributorController::class, 'restock'])->name('distributor.warehouse-inventory.restock');
});

// Retailer inventory routes
Route::middleware(['auth', 'verified', 'retailer'])->group(function () {
    Route::get('/retailer/inventory', [RetailerInventoryController::class, 'index'])->name('retailer.inventory');
});

Route::middleware(['auth'])->get('/quick-reorder', [QuickReorderController::class, 'index'])->name('quick-reorder');
Route::middleware(['auth'])->get('/api/distributor/{distributorId}/inventory', [QuickReorderController::class, 'getDistributorInventory']);

// Stock/Inventory routes (not related to dashboard)
Route::middleware(['auth'])->get('/stock', [StockController::class, 'index'])->name('stock.index');
Route::middleware(['auth'])->put('/stock/{product}', [StockController::class, 'update'])->name('stock.update');

// Logout route (GET for link, POST for form)
Route::get('/logout', function () {
    Auth::logout();
    return redirect()->route('home');
})->name('logout');

Route::post('/logout', function () {
    Auth::logout();
    return redirect()->route('home');
});

// Re-login page for non-admin users
Route::middleware(['auth'])->get('/re-login', function () {
    return inertia('re-login');
})->name('re-login');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/dashboard', function () {
        return inertia('dashboard');
    })->name('dashboard');
    Route::get('dashboard/accounts', [AccountsController::class, 'index'])->name('dashboard.accounts');
    Route::get('dashboard/orders', [OrderController::class, 'index'])->name('dashboard.orders');
    Route::post('dashboard/orders/{order}/approve', [OrderController::class, 'approve'])->name('dashboard.orders.approve');
    Route::post('dashboard/orders/{order}/reject', [OrderController::class, 'reject'])->name('dashboard.orders.reject');

    // User Approvals routes
    Route::get('dashboard/user-approvals', [UserApprovalsController::class, 'index'])->name('dashboard.user-approvals');
    Route::post('dashboard/user-approvals/{user}/approve', [UserApprovalsController::class, 'approve'])->name('dashboard.user-approvals.approve');
    Route::post('dashboard/user-approvals/{user}/reject', [UserApprovalsController::class, 'reject'])->name('dashboard.user-approvals.reject');

    // Products routes
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
});

Route::middleware(['auth'])->post('/orders', [OrderController::class, 'store'])->name('orders.store');
Route::middleware(['auth'])->get('/my-orders', [OrderController::class, 'myOrders'])->name('my-orders');
Route::middleware(['auth'])->get('/user/profile', [OrderController::class, 'userProfile'])->name('user.profile');
Route::middleware(['auth'])->put('/user/profile-information', [ProfileController::class, 'update'])->name('user.profile-information.update');

// PayPal payment routes
Route::middleware(['auth'])->group(function () {
    Route::match(['get', 'post'], '/paypal/process', [PayPalController::class, 'processPayment'])->name('paypal.process');
    Route::get('/paypal/success', [PayPalController::class, 'success'])->name('paypal.success');
    Route::get('/paypal/cancel', [PayPalController::class, 'cancel'])->name('paypal.cancel');
    Route::post('/paypal/notify', [PayPalController::class, 'notify'])->name('paypal.notify');
});

require __DIR__.'/settings.php';
