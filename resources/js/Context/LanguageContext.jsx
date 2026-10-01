import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
    bn: {
        // Top Hotline Bar
        hotlineLabel: 'হটলাইন:',
        workingHours: 'শনি - বৃহস্পতি: সকাল ৯টা - রাত ৮টা',
        whatsappSupport: 'হোয়াটসঅ্যাপ সাপোর্ট',

        // Header Navigation
        navHome: 'হোম',
        navServices: 'সার্ভিস ও সলিউশন',
        navPackages: 'প্যাকেজ ও মূল্য তালিকা',
        navPortfolio: 'পোর্টফলিও',
        navClients: 'ক্লায়েন্টস',
        navQuote: 'কোটেশন নিন',
        navLogin: 'লগইন',
        navAdmin: 'অ্যাডমিন',
        allServicesLink: 'সকল সার্ভিস দেখুন →',

        // Hero Section
        heroBadge: '৫০০+ সফল ওয়েবসাইট ও সফটওয়্যার ডেলিভারি',
        heroHeadlineMain: 'আপনার অনলাইন ব্যবসার নির্ভরযোগ্য',
        heroHeadlineHighlight: 'প্রযুক্তি সহযোগী',
        heroDesc: 'আমরা দিচ্ছি প্রিমিয়াম কোয়ালিটির ই-কমার্স ওয়েবসাইট, কাস্টম সফটওয়্যার, পিওএস এবং মোবাইল অ্যাপ সলিউশন। আপনার ব্যবসায়িক ভাবনাকে বাস্তবায়নে আমরা সদা প্রস্তুত।',
        heroStat1Num: '৫০০+',
        heroStat1Label: 'ওয়েবসাইট ডেলিভারি',
        heroStat2Num: '১০০০+',
        heroStat2Label: 'সন্তুষ্ট ক্লায়েন্ট',
        heroStat3Num: '২৪/৭',
        heroStat3Label: 'সাপোর্ট সেবা',
        heroBtnPackages: 'প্যাকেজ দেখুন',
        heroBtnConsult: 'ফ্রি কনসালটেন্সি',
        heroFloatSecure: 'নিরাপদ পেমেন্ট (bKash ও কার্ড)',
        heroFloatDelivery: 'দ্রুত ডেলিভারি (৩-৭ দিন)',
        heroFloatTerms: '৫০% অগ্রিম ও ওয়ার্ক অর্ডার চুক্তি',
        browserSearchPlaceholder: 'প্রোডাক্ট খুঁজুন...',
        browserPromoBadge: '৫০% ছাড়',
        browserPromoTitle: 'রেডিমেড সফটওয়্যার প্যাকেজ',
        browserPromoBtn: 'অর্ডার করুন',
        browserCatAll: 'সকল',
        browserCatEcom: 'ই-কমার্স',
        browserCatWeb: 'ওয়েবসাইট',
        browserCatApp: 'মোবাইল অ্যাপ',
        browserProd1Name: 'স্মার্ট ই-কমার্স',
        browserProd2Name: 'পিওএস সফটওয়্যার',
        browserProd3Name: 'মোবাইল অ্যাপ',
        browserCartSummary: 'কার্ট: ৩টি আইটেম · ৳ ৪,৬৯৭',
        browserCheckoutBtn: 'চেকআউট →',

        // Brand Marquee
        marqueeHeading: 'বাংলাদেশে ও বিশ্বজুড়ে ৫০০+ সফল ব্যবসা ও ব্র্যান্ডের বিশ্বস্ত প্রযুক্তি অংশীদার',

        // Services Section
        servicesBadge: 'আমাদের সার্ভিসসমূহ',
        servicesHeading: 'আপনার ব্যবসার জন্য আধুনিক সফটওয়্যার ও ডিজিটাল সমাধান',
        servicesSubheading: 'ডাইনামিক অনলাইন স্টোর থেকে শুরু করে মাল্টি-ব্রাঞ্চ ইআরপি সিস্টেম—আমরা তৈরি করি দীর্ঘস্থায়ী আধুনিক প্রযুক্তি।',
        servicesAllBtn: 'সকল সার্ভিস ও প্যাকেজ',

        // Packages & Pricing Section
        pricingBadge: 'স্বচ্ছ ও সাশ্রয়ী ওয়েবসাইট প্যাকেজ',
        pricingHeading: 'আপনার ব্যবসার বৃদ্ধির জন্য সঠিক প্যাকেজ বেছে নিন',
        pricingSubheading: 'কোনো গোপন চার্জ নেই। প্রতিটি প্যাকেজে রয়েছে দ্রুতগতির এনভিএমই ক্লাউড হোস্টিং, এসএসএল, ডোমেন ও সার্বক্ষণিক টেকনিক্যাল সাপোর্ট।',
        priceOneTimeNote: '✓ ১ বছরের ফ্রি সাপোর্ট ও ব্যাকআপসহ এককালীন বিনিয়োগ',
        popularBadge: 'সর্বাধিক জনপ্রিয় ⭐',
        viewLiveDemos: 'লাইভ ডেমো ও প্রজেক্ট দেখুন',

        // Package 1
        pkg1Title: 'স্টার্টার ওয়েবসাইট প্যাকেজ',
        pkg1Tagline: 'ব্যক্তিগত ব্যবসা, পোর্টফোলিও ও প্রাতিষ্ঠানিক পরিচিতির জন্য আদর্শ',
        pkg1Price: '১২,০০০',
        pkg1Original: '১৬,০০০',
        pkg1F1: 'সর্বোচ্চ ৫ পৃষ্ঠার রেস্পন্সিভ ওয়েবসাইট',
        pkg1F2: 'ফ্রি .com / .xyz ডোমেন (১ বছর)',
        pkg1F3: '২ জিবি সুপার-ফাস্ট NVMe SSD হোস্টিং',
        pkg1F4: 'ফ্রি এসএসএল সিকিউরিটি সার্টিফিকেট',
        pkg1F5: 'কন্টাক্ট ফর্ম ও গুগল ম্যাপ ইন্টিগ্রেশন',
        pkg1F6: 'মোবাইল, ট্যাবলেট ও ডেক্সটপ অপ্টিমাইজড',
        pkg1F7: 'হোয়াটসঅ্যাপ সরাসরি চ্যাট বাটন',
        pkg1F8: '১ বছর ফ্রি টেকনিক্যাল সাপোর্ট ও ব্যাকআপ',
        pkg1Btn: 'স্টার্টার প্যাকেজ অর্ডার করুন',

        // Package 2
        pkg2Title: 'প্রফেশনাল ই-কমার্স প্যাকেজ',
        pkg2Tagline: 'পেমেন্ট গেটওয়ে ও অটোমেটেড ইনভয়েসিংসহ সম্পূর্ণ অনলাইন শপ',
        pkg2Price: '২৫,০০০',
        pkg2Original: '৩৫,০০০',
        pkg2F1: 'সম্পূর্ণ ডাইনামিক ই-কমার্স ওয়েব অ্যাপ্লিকেশন',
        pkg2F2: 'বিকাশ, নগদ, রকেট ও কার্ড পেমেন্ট গেটওয়ে',
        pkg2F3: '৫ জিবি হাই-স্পিড ক্লাউড NVMe হোস্টিং',
        pkg2F4: 'ফ্রি .com ডোমেন রেজিস্ট্রেশন (১ বছর)',
        pkg2F5: 'অটোমেটেড ইনভয়েস ও এসএমএস নোটিফিকেশন',
        pkg2F6: 'অ্যান্ড্রয়েড মোবাইল অ্যাপ (Webview APK)',
        pkg2F7: 'আনলিমিটেড প্রোডাক্ট ও ক্যাটাগরি আপলোড',
        pkg2F8: 'কুরিয়ার (Steadfast/Pathao) অটো ট্র্যাকিং হুক',
        pkg2F9: '১ বছর প্রায়োরিটি মেইনটেন্যান্স ও ২৪/৭ সাপোর্ট',
        pkg2Btn: 'ই-কমার্স প্যাকেজ অর্ডার করুন',

        // Package 3
        pkg3Title: 'কাস্টম এন্টারপ্রাইজ ইআরপি ও পিওএস',
        pkg3Tagline: 'মাল্টি-ব্রাঞ্চ স্টক, একাউন্টস, বিলিং ও স্টাফ ম্যানেজমেন্ট সফটওয়্যার',
        pkg3Price: '৫০,০০০',
        pkg3Original: '৭০,০০০',
        pkg3F1: 'কাস্টম আর্কিটেকচার ও ডাটাবেস ইঞ্জিনিয়ারিং',
        pkg3F2: 'মাল্টি-ব্রাঞ্চ ইনভেন্টরি ও স্টক ট্র্যাকিং',
        pkg3F3: 'লেজার, লাভ-ক্ষতি হিসাব ও ব্যালেন্স শিট',
        pkg3F4: 'এইচআরএম, স্টাফ হাজিরা ও বেতন মডিউল',
        pkg3F5: 'রোল-ভিত্তিক সিকিউর ইউজার পারমিশন',
        pkg3F6: 'বারকোড স্ক্যানার ও থার্মাল রিসিপ্ট প্রিন্টিং',
        pkg3F7: 'ডেডিকেটেড ক্লাউড ভিপিএস সার্ভার সেটআপ',
        pkg3F8: 'সরাসরি স্টাফ ট্রেনিং ও সোর্স কোড হ্যান্ডওভার',
        pkg3Btn: 'কাস্টম ইআরপির জন্য যোগাযোগ করুন',

        // 24/7 Helpline Banner
        supportBadge: '২৪/৭ ক্লায়েন্ট সাপোর্ট',
        supportHeading: 'কাস্টম কোনো সফটওয়্যার বা ওয়েবসাইটের প্রয়োজন?',
        supportDesc: 'বিনামূল্যে আর্কিটেকচার ও কোটেশন পরামর্শের জন্য আমাদের সিনিয়র সফটওয়্যার ইঞ্জিনিয়ারদের সাথে সরাসরি কথা বলুন।',
        supportWhatsappBtn: 'হোয়াটসঅ্যাপ কনসালটেন্সি',
        supportCallBtn: 'সরাসরি কল করুন:',

        // Portfolio Section
        portfolioBadge: 'পোর্টফোলিও ও ডেমো',
        portfolioHeading: 'সাম্প্রতিক সম্পন্ন হওয়া ক্লায়েন্ট প্রজেক্ট',
        portfolioDesc: 'আমাদের টিমের তৈরি করা লাইভ ই-কমার্স শপ, নিউজ পোর্টাল ও এন্টারপ্রাইজ সফটওয়্যারগুলো একনজরে দেখুন।',
        portfolioAllBtn: 'সকল প্রজেক্ট দেখুন',

        // Reviews Section
        reviewsBadge: 'ক্লায়েন্ট মতামত ও রিভিউ',
        reviewsHeading: 'আমাদের ক্লায়েন্টরা আমাদের সম্পর্কে কী বলেন',

        // Final CTA
        ctaBadge: 'আপনার ডিজিটাল যাত্রা শুরু করুন আজই',
        ctaHeading: 'আপনার স্বপ্নের প্রজেক্ট শুরু করতে প্রস্তুত?',
        ctaDesc: 'আমাদের টেকনিক্যাল অ্যাডভাইজরদের সাথে কথা বলুন, কাস্টমাইজড কোটেশন নিন এবং কাজের অগ্রগতি ট্র্যাক করুন সহজে।',
        ctaBtnQuote: 'ফ্রি কোটেশন নিন',
        ctaBtnServices: 'সকল সার্ভিস এক্সপ্লোর করুন',

        // Floating WhatsApp Widget
        floatingTitle: 'আইটি সেবা কনসালট্যান্ট',
        floatingOnline: 'অনলাইনে আছেন (Online)',
        floatingGreeting: 'আসসালামু আলাইকুম! আপনার ওয়েবসাইট বা সফটওয়্যার সম্পর্কে কোনো জিজ্ঞাসা আছে কি? সরাসরি কথা বলুন আমাদের সাথে।',
        floatingBtn: 'হোয়াটসঅ্যাপে চ্যাট শুরু করুন',
        floatingTooltip: 'হোয়াটসঅ্যাপে যোগাযোগ করুন',

        // Currency
        currencySymbol: '৳',
        currencyCode: 'BDT',
    },

    en: {
        // Top Hotline Bar
        hotlineLabel: 'Hotline:',
        workingHours: 'Sat - Thu: 9:00 AM - 8:00 PM',
        whatsappSupport: 'WhatsApp Support',

        // Header Navigation
        navHome: 'Home',
        navServices: 'Services & Solutions',
        navPackages: 'Packages & Pricing',
        navPortfolio: 'Portfolio',
        navClients: 'Clients',
        navQuote: 'Get a Quote',
        navLogin: 'Login',
        navAdmin: 'Admin',
        allServicesLink: 'View All Services →',

        // Hero Section
        heroBadge: '500+ Delivered Websites & Custom Software',
        heroHeadlineMain: 'Your Trusted Technology &',
        heroHeadlineHighlight: 'Web Solutions Partner',
        heroDesc: 'We build high-performance e-commerce websites, custom software, POS systems, and mobile applications. Turn your business vision into a scalable digital reality.',
        heroStat1Num: '500+',
        heroStat1Label: 'Projects Delivered',
        heroStat2Num: '1000+',
        heroStat2Label: 'Happy Clients',
        heroStat3Num: '24/7',
        heroStat3Label: 'Live Support',
        heroBtnPackages: 'View Packages',
        heroBtnConsult: 'Free Consultation',
        heroFloatSecure: 'Secure Payment (bKash & Cards)',
        heroFloatDelivery: 'Fast Delivery (3-7 Days)',
        heroFloatTerms: '50% Advance & Work Order Terms',
        browserSearchPlaceholder: 'Search products...',
        browserPromoBadge: '50% OFF',
        browserPromoTitle: 'Ready Software Package',
        browserPromoBtn: 'Order Now',
        browserCatAll: 'All',
        browserCatEcom: 'E-Commerce',
        browserCatWeb: 'Websites',
        browserCatApp: 'Mobile Apps',
        browserProd1Name: 'Smart E-Commerce',
        browserProd2Name: 'POS Software',
        browserProd3Name: 'Mobile App',
        browserCartSummary: 'Cart: 3 Items · ৳ 4,697',
        browserCheckoutBtn: 'Checkout →',

        // Brand Marquee
        marqueeHeading: 'Trusted by 500+ Ambitious Businesses, Startups & Brands in Bangladesh & Worldwide',

        // Services Section
        servicesBadge: 'Our Services',
        servicesHeading: 'Tailored Software & Digital Solutions',
        servicesSubheading: 'From high-converting dynamic online stores to enterprise multi-branch ERP systems, we engineer scalable technology for your business.',
        servicesAllBtn: 'View All Services & Packages',

        // Packages & Pricing Section
        pricingBadge: 'Transparent & Affordable Packages',
        pricingHeading: 'Choose the Right Package for Your Business Growth',
        pricingSubheading: 'No hidden fees. Every package includes high-speed NVMe cloud hosting, SSL, domain registration, and dedicated post-launch support.',
        priceOneTimeNote: '✓ One-time investment with 1-Year free support & backup',
        popularBadge: 'Most Popular ⭐',
        viewLiveDemos: 'View Live Demos & Examples',

        // Package 1
        pkg1Title: 'Starter Web Package',
        pkg1Tagline: 'Ideal for local businesses, portfolios & corporate profiles',
        pkg1Price: '12,000',
        pkg1Original: '16,000',
        pkg1F1: 'Up to 5 Pages Responsive Website',
        pkg1F2: 'Free .com / .xyz Domain (1 Year)',
        pkg1F3: '2 GB Ultra-Fast NVMe SSD Hosting',
        pkg1F4: 'Free SSL Security Certificate',
        pkg1F5: 'Lead Generation Contact Form & Maps',
        pkg1F6: 'Mobile, Tablet & Desktop Optimized',
        pkg1F7: 'WhatsApp Direct Chat Button',
        pkg1F8: '1 Year Free Technical Support & Backup',
        pkg1Btn: 'Order Starter Package',

        // Package 2
        pkg2Title: 'Professional E-Commerce',
        pkg2Tagline: 'Complete online shop with payment gateway & automated invoicing',
        pkg2Price: '25,000',
        pkg2Original: '35,000',
        pkg2F1: 'Full E-Commerce Web Application',
        pkg2F2: 'bKash, Nagad, Rocket & Card Payment Gateway',
        pkg2F3: '5 GB High-Speed Cloud NVMe Hosting',
        pkg2F4: 'Free .com Domain Name (1 Year)',
        pkg2F5: 'Automated Invoicing & SMS Notifications',
        pkg2F6: 'Android Mobile App (Webview APK)',
        pkg2F7: 'Unlimited Product Uploads & Categories',
        pkg2F8: 'Courier (Steadfast/Pathao) API Hook',
        pkg2F9: '1 Year Priority Maintenance & 24/7 Support',
        pkg2Btn: 'Order E-Commerce Package',

        // Package 3
        pkg3Title: 'Custom Enterprise ERP / POS',
        pkg3Tagline: 'Tailored software for multi-branch inventory, accounts & staff management',
        pkg3Price: '50,000',
        pkg3Original: '70,000',
        pkg3F1: 'Custom Architecture & Database Engineering',
        pkg3F2: 'Multi-Branch Inventory & Stock Management',
        pkg3F3: 'Accounts, Ledger, Profit/Loss & Balance Sheet',
        pkg3F4: 'HRM, Staff Attendance & Payroll Module',
        pkg3F5: 'Role-Based Granular Access Permissions',
        pkg3F6: 'Barcode Scanner & Thermal POS Receipt Printing',
        pkg3F7: 'Dedicated Cloud VPS Server Deployment',
        pkg3F8: 'On-Site / Zoom Staff Training & Source Code Handover',
        pkg3Btn: 'Consult for Custom ERP',

        // 24/7 Helpline Banner
        supportBadge: '24/7 Client Support',
        supportHeading: 'Need a custom website or software solution?',
        supportDesc: 'Talk directly with our senior software engineers for free architecture and pricing advice.',
        supportWhatsappBtn: 'WhatsApp Consultation',
        supportCallBtn: 'Direct Hotline:',

        // Portfolio Section
        portfolioBadge: 'Portfolio Showcase',
        portfolioHeading: 'Recent Delivered Client Projects',
        portfolioDesc: 'Explore live e-commerce shops, news portals, and enterprise software designed and built by our team.',
        portfolioAllBtn: 'View All Projects',

        // Reviews Section
        reviewsBadge: 'Client Reviews & Ratings',
        reviewsHeading: 'What Our Clients Say About Us',

        // Final CTA
        ctaBadge: 'Start Your Digital Journey Today',
        ctaHeading: 'Ready to Build Your Dream Project?',
        ctaDesc: 'Speak directly with our technical advisors, get a customized quotation proposal, and execute your project with transparent milestones.',
        ctaBtnQuote: 'Get Free Quote',
        ctaBtnServices: 'Explore All Services',

        // Floating WhatsApp Widget
        floatingTitle: 'IT Solution Consultant',
        floatingOnline: 'Active Online',
        floatingGreeting: 'Hello! Do you have any questions regarding your website or software project? Chat directly with our engineering team.',
        floatingBtn: 'Start WhatsApp Chat',
        floatingTooltip: 'Chat with us on WhatsApp',

        // Currency
        currencySymbol: '৳',
        currencyCode: 'BDT',
    }
};

export function LanguageProvider({ children }) {
    const [locale, setLocale] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('app_locale') || 'bn';
        }
        return 'bn';
    });

    const switchLanguage = (newLocale) => {
        setLocale(newLocale);
        if (typeof window !== 'undefined') {
            localStorage.setItem('app_locale', newLocale);
            document.documentElement.lang = newLocale;

            // Trigger Google Translate cookie bridge if present on page
            try {
                const domain = window.location.hostname;
                document.cookie = `googtrans=/auto/${newLocale}; path=/; domain=${domain}`;
                document.cookie = `googtrans=/auto/${newLocale}; path=/;`;
            } catch (e) {
                // Ignore cookie errors
            }
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.lang = locale;
        }
    }, [locale]);

    const t = (key) => {
        return translations[locale]?.[key] || translations['bn']?.[key] || key;
    };

    const isBn = locale === 'bn';
    const isEn = locale === 'en';

    return (
        <LanguageContext.Provider value={{ locale, switchLanguage, t, isBn, isEn }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        // Fallback if rendered outside provider
        return {
            locale: 'bn',
            isBn: true,
            isEn: false,
            switchLanguage: () => {},
            t: (key) => translations['bn'][key] || key,
        };
    }
    return context;
}
