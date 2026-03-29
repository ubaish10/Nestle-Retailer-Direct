<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>PayPal Checkout</title>
    @viteReactRefresh
    @vite(['resources/js/app.tsx', 'resources/js/pages/mock-paypal-standalone.tsx'])
</head>
<body class="font-sans antialiased">
    <div id="app"></div>
    <script>
        window.mockPaypalData = {
            orderId: {{ $orderId }},
            amount: {{ $amount }},
            returnUrl: "{{ $returnUrl }}",
            cancelUrl: "{{ $cancelUrl }}"
        };
    </script>
</body>
</html>
