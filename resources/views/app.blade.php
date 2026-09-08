<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'IT SOLUTIONS') }}</title>

        @php
            $siteFavicon = \App\Models\SiteSetting::get('site_favicon');
        @endphp

        <!-- Favicons -->
        @if(!empty($siteFavicon))
            <link rel="icon" href="{{ $siteFavicon }}">
            <link rel="shortcut icon" href="{{ $siteFavicon }}">
            <link rel="apple-touch-icon" href="{{ $siteFavicon }}">
        @else
            <link rel="icon" type="image/svg+xml" href="/favicon.svg">
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
            <link rel="shortcut icon" href="/favicon.ico">
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        @endif

        <!-- PWA Meta & Manifest -->
        <meta name="theme-color" content="#4f46e5">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="ITSolution">
        <link rel="manifest" href="/manifest.json">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@600;700;800;900&family=Poppins:wght@500;600;700;800&family=Syne:wght@700;800;900&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans text-neutral-900 bg-neutral-50 antialiased selection:bg-primary selection:text-white">
        @inertia
    </body>
</html>
