<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Client;
use App\Models\Employee;
use App\Models\Item;
use App\Models\ItemImage;
use App\Models\Order;
use App\Models\Portfolio;
use App\Models\PortfolioImage;
use App\Models\Quote;
use App\Models\Reorder;
use App\Models\Review;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $isMySQL = DB::getDriverName() === 'mysql';

        if ($isMySQL) {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }
        
        ItemImage::truncate();
        PortfolioImage::truncate();
        Order::truncate();
        Quote::truncate();
        Review::truncate();
        Reorder::truncate();
        Portfolio::truncate();
        Item::truncate();
        Client::truncate();
        Category::truncate();
        Employee::truncate();
        SiteSetting::truncate();
        \App\Models\ChatQuestion::truncate();

        if ($isMySQL) {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        // 1. Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@servicesite.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '+880 1700-000001',
                'email_verified_at' => now(),
            ]
        );

        $client = User::firstOrCreate(
            ['email' => 'client@servicesite.com'],
            [
                'name' => 'Tanvir Ahmed',
                'password' => Hash::make('password'),
                'role' => 'client',
                'phone' => '+880 1800-000002',
                'email_verified_at' => now(),
            ]
        );

        // 2. Categories
        $categoriesData = [
            [
                'name' => 'Apps',
                'slug' => 'apps',
                'icon' => 'Smartphone',
                'description' => 'Custom iOS, Android, and cross-platform Flutter/React Native mobile applications with real-time sync, push notifications, and intuitive UX.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Website',
                'slug' => 'website',
                'icon' => 'Globe',
                'description' => 'High-performance bespoke corporate portals, headless eCommerce storefronts, web applications, and landing pages built for peak conversion.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Software',
                'slug' => 'software',
                'icon' => 'Cpu',
                'description' => 'Cloud-native ERP systems, Point-of-Sale (POS) software, inventory automation, payroll management, and custom business workflow engines.',
                'sort_order' => 3,
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $c) {
            $categories[$c['slug']] = Category::create($c);
        }

        // 3. Items (Products / Systems)
        $itemsData = [
            // Apps Category
            [
                'category' => 'apps',
                'name' => 'SecureShield Endpoint Suite',
                'slug' => 'secureshield-endpoint-suite',
                'short_description' => 'Enterprise mobile security, biometric encrypted vault, and real-time device management.',
                'description' => "SecureShield delivers bank-grade endpoint protection for enterprise smartphones and tablets.\n\nKey Capabilities:\n• On-device biometric data encryption\n• Unauthorized SIM swap detection & instant sirens\n• Remote data wiping & lost device recovery\n• Front-camera intruder capture with GPS location logging\n• Centralized Mobile Device Management (MDM) web console",
                'thumbnail' => 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&auto=format&fit=crop&q=80',
                'price' => 35000.00,
                'is_purchasable' => true,
                'is_featured' => true,
                'status' => 'published',
            ],
            [
                'category' => 'apps',
                'name' => 'CarePulse Telemedicine App',
                'slug' => 'carepulse-telemedicine-app',
                'short_description' => 'Doctor video consultations, electronic health records (EHR), and prescription management.',
                'description' => "CarePulse connects patients directly with specialized doctors, clinics, and diagnostic labs.\n\nKey Capabilities:\n• HD encrypted WebRTC video & audio consultations\n• Digital prescription generator with QR verification\n• Electronic health records & lab report archive\n• Integrated bKash/Nagad/Card instant fee payments\n• Automated medicine reminder notifications",
                'thumbnail' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&auto=format&fit=crop&q=80',
                'price' => 45000.00,
                'is_purchasable' => true,
                'is_featured' => true,
                'status' => 'published',
            ],
            [
                'category' => 'apps',
                'name' => 'SwiftCourier On-Demand Delivery',
                'slug' => 'swiftcourier-delivery-app',
                'short_description' => 'Live GPS rider tracking, route optimization, automated dispatch, and proof of delivery.',
                'description' => "Complete logistics parcel delivery ecosystem with Customer, Driver, and Merchant applications.\n\nKey Capabilities:\n• Turn-by-turn navigation & route optimization\n• Live interactive Google Maps GPS tracking\n• Automated Cash on Delivery (COD) ledger & settlements\n• Digital signature & photo proof of delivery\n• Push notifications for parcel milestones",
                'thumbnail' => 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=900&auto=format&fit=crop&q=80',
                'price' => 40000.00,
                'is_purchasable' => true,
                'is_featured' => false,
                'status' => 'published',
            ],
            [
                'category' => 'apps',
                'name' => 'EduLearn Campus & LMS App',
                'slug' => 'edulearn-campus-lms',
                'short_description' => 'Interactive digital classroom, live video lectures, exam portals, and student attendance.',
                'description' => "Modern mobile learning management system designed for schools, colleges, and coaching institutes.\n\nKey Capabilities:\n• Live lecture streaming with interactive chat\n• Online MCQ exams with automated grading\n• Homework submission & teacher grading desk\n• Biometric/QR student attendance tracking\n• Tuition fee collection with instant receipts",
                'thumbnail' => 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=900&auto=format&fit=crop&q=80',
                'price' => 30000.00,
                'is_purchasable' => true,
                'is_featured' => false,
                'status' => 'published',
            ],

            // Website Category
            [
                'category' => 'website',
                'name' => 'ApexStore Headless eCommerce',
                'slug' => 'apexstore-ecommerce-platform',
                'short_description' => 'Ultra-fast Next.js & Laravel multi-vendor eCommerce with inventory automation.',
                'description' => "High-concurrency digital commerce platform engineered for retail brands and multi-vendor marketplaces.\n\nKey Capabilities:\n• Instant elastic product search & category filters\n• Multi-gateway checkout (bKash, Nagad, Rocket, Cards)\n• Dynamic discount coupons & loyalty rewards\n• Multi-warehouse inventory sync & stock alerts\n• Merchant vendor portal & commission payout engine",
                'thumbnail' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80',
                'price' => 60000.00,
                'is_purchasable' => true,
                'is_featured' => true,
                'status' => 'published',
            ],
            [
                'category' => 'website',
                'name' => 'Enterprise Corporate Portal',
                'slug' => 'enterprise-corporate-portal',
                'short_description' => 'Brand-defining corporate web portal with investor relations, career desk, and CRM integration.',
                'description' => "Bespoke corporate identity platform engineered to reflect enterprise authority.\n\nKey Capabilities:\n• Interactive service showcase with custom enquiry funnels\n• Executive board & management directory\n• Automated career applicant tracking & CV parsing\n• Investor relations, annual reports, & compliance downloads\n• HubSpot & Salesforce CRM lead pipeline sync",
                'thumbnail' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80',
                'price' => 45000.00,
                'is_purchasable' => true,
                'is_featured' => true,
                'status' => 'published',
            ],
            [
                'category' => 'website',
                'name' => 'TechPulse SaaS Marketing Hub',
                'slug' => 'techpulse-saas-hub',
                'short_description' => 'Conversion-focused SaaS website with interactive feature demos and self-serve onboarding.',
                'description' => "High-converting SaaS product website featuring modern interactive product tours.\n\nKey Capabilities:\n• Interactive dynamic pricing tiered calculators\n• Product feature breakdowns with animated previews\n• API documentation portal & developer sandbox\n• Customer case study carousels & video embeds\n• Self-serve free trial onboarding funnel",
                'thumbnail' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
                'price' => 38000.00,
                'is_purchasable' => true,
                'is_featured' => false,
                'status' => 'published',
            ],
            [
                'category' => 'website',
                'name' => 'MediaDaily Digital News Portal',
                'slug' => 'mediadaily-news-portal',
                'short_description' => 'Sub-second digital journalism platform with AMP support, paywalls, and breaking alerts.',
                'description' => "Publishing engine built for high-traffic media publications.\n\nKey Capabilities:\n• Categorized news feeds (Politics, Tech, Sports, Opinion)\n• Rich multimedia video and photo gallery stories\n• Breaking news live ticker and web push alerts\n• Reader subscription paywall and membership portal\n• Google AdSense and programmatic banner management",
                'thumbnail' => 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&auto=format&fit=crop&q=80',
                'price' => 35000.00,
                'is_purchasable' => true,
                'is_featured' => false,
                'status' => 'published',
            ],

            // Software Category
            [
                'category' => 'software',
                'name' => 'OmniPOS Retail & Supermarket Hub',
                'slug' => 'omnipos-retail-hub',
                'short_description' => 'Multi-branch point-of-sale system with barcode scanning, stock sync, and thermal printing.',
                'description' => "High-throughput retail POS software designed for supermarkets, department stores, and retail chains.\n\nKey Capabilities:\n• Offline-first checkout with zero downtime\n• Dual-screen customer display & thermal receipt printing\n• Barcode label generator & scanner integration\n• Supplier purchase orders & multi-branch stock transfers\n• Real-time gross profit, VAT, and sales analytics",
                'thumbnail' => 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=900&auto=format&fit=crop&q=80',
                'price' => 75000.00,
                'is_purchasable' => true,
                'is_featured' => true,
                'status' => 'published',
            ],
            [
                'category' => 'software',
                'name' => 'RestroSync Cloud Kitchen & POS',
                'slug' => 'restrosync-restaurant-pos',
                'short_description' => 'Table management, digital QR menu, Kitchen Display System (KDS), and waiter ordering.',
                'description' => "Complete hospitality operating system for dine-in restaurants, cafes, and cloud kitchens.\n\nKey Capabilities:\n• Interactive floor plan & live table booking\n• Waiter handheld tablet ordering\n• Real-time Kitchen Display System (KDS) routing\n• Recipe raw-ingredient inventory auto-deduction\n• Split billing & multi-payment checkout",
                'thumbnail' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80',
                'price' => 65000.00,
                'is_purchasable' => true,
                'is_featured' => true,
                'status' => 'published',
            ],
            [
                'category' => 'software',
                'name' => 'Enterprise Core ERP & HRM',
                'slug' => 'enterprise-core-erp-hrm',
                'short_description' => 'Complete human resource, payroll, biometric attendance, and operational accounting suite.',
                'description' => "Unified business operations ERP for manufacturing, trading, and corporate service firms.\n\nKey Capabilities:\n• Biometric punch-clock attendance & shift scheduling\n• Automated salary, tax, overtime, and bonus payroll calculation\n• Leave application & approval management\n• General ledger, vouchers, balance sheet & P&L reports\n• Role-based permission controls & audit logs",
                'thumbnail' => 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80',
                'price' => 85000.00,
                'is_purchasable' => true,
                'is_featured' => false,
                'status' => 'published',
            ],
            [
                'category' => 'software',
                'name' => 'PharmaCare Pharmacy & Inventory Engine',
                'slug' => 'pharmacare-inventory-engine',
                'short_description' => 'Batch & expiry tracking, generic drug lookup, and automated low-stock reorder alerts.',
                'description' => "Specialized pharmacy software ensuring 100% stock accuracy and statutory compliance.\n\nKey Capabilities:\n• Batch number and expiry date tracking with early warnings\n• Generic medicine substitute search\n• Doctor prescription attachment and customer history\n• Supplier purchase registers & returns management\n• Low-stock auto-replenishment alerts",
                'thumbnail' => 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=900&auto=format&fit=crop&q=80',
                'price' => 50000.00,
                'is_purchasable' => true,
                'is_featured' => false,
                'status' => 'published',
            ],
        ];

        $createdItems = [];
        foreach ($itemsData as $iData) {
            $catSlug = $iData['category'];
            unset($iData['category']);
            $iData['category_id'] = $categories[$catSlug]->id;
            $iData['published_at'] = now();

            $item = Item::create($iData);
            $createdItems[$item->slug] = $item;

            // Gallery images
            ItemImage::create([
                'item_id' => $item->id,
                'image_path' => $item->thumbnail,
                'sort_order' => 1,
            ]);
            ItemImage::create([
                'item_id' => $item->id,
                'image_path' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
                'sort_order' => 2,
            ]);
            ItemImage::create([
                'item_id' => $item->id,
                'image_path' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80',
                'sort_order' => 3,
            ]);
        }

        // 4. Clients
        $clientsData = [
            [
                'name' => 'Apex Retail Group',
                'logo' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
                'website_url' => 'https://apexretail.example.com',
                'testimonial' => 'The OmniPOS system transformed our 40-store retail chain across Bangladesh. Checkout speeds improved by 45% and inventory discrepancies dropped to near zero.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Horizon Healthcare Labs',
                'logo' => 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80',
                'website_url' => 'https://horizonlabs.example.com',
                'testimonial' => 'The telemedicine and electronic patient record system delivered by IT SOLUTIONS has handled over 50,000 patient consultations seamlessly with 99.99% uptime.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Urban Gourmet Hospitality',
                'logo' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
                'website_url' => 'https://urbangourmet.example.com',
                'testimonial' => 'From kitchen display automation to digital QR ordering, RestroSync boosted our table turnover by 35%. Exceptional architecture and 24/7 technical support.',
                'sort_order' => 3,
            ],
            [
                'name' => 'SwiftExpress Logistics',
                'logo' => 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80',
                'website_url' => 'https://swiftexpress.example.com',
                'testimonial' => 'The real-time rider tracking and automated Cash-on-Delivery reconciliation system reduced delivery turnaround times across nationwide hubs by 40%.',
                'sort_order' => 4,
            ],
            [
                'name' => 'Aurora Lifestyle BD',
                'logo' => 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=200&auto=format&fit=crop&q=80',
                'website_url' => 'https://auroralifestyle.example.com',
                'testimonial' => 'Our eCommerce platform generated 3x sales during peak festival campaigns without a single second of latency. Outstanding engineering work!',
                'sort_order' => 5,
            ],
            [
                'name' => 'Pacific Global Corporate',
                'logo' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80',
                'website_url' => 'https://pacificglobal.example.com',
                'testimonial' => 'Security and compliance were our top requirements. The enterprise portal and ERP systems built by IT SOLUTIONS exceeded all audit standards.',
                'sort_order' => 6,
            ],
        ];

        $createdClients = [];
        foreach ($clientsData as $cData) {
            $createdClients[] = Client::create($cData);
        }

        // 5. Portfolios (matching types: website, software, pos_software)
        $portfoliosData = [
            [
                'title' => 'Apex Supercenter Multi-Branch POS & Stock Sync',
                'slug' => 'apex-supercenter-pos-sync',
                'type' => 'pos_software',
                'item_slug' => 'omnipos-retail-hub',
                'client_index' => 0,
                'cover_image' => 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=900&auto=format&fit=crop&q=80',
                'description' => "Deployed a centralized Point-of-Sale network across 40 hypermarket branches.\n\nKey Highlights:\n• Real-time cloud synchronization with offline POS fallback\n• Sub-second barcode scanning and instant thermal printing\n• Centralized multi-warehouse stock replenishment",
                'project_url' => 'https://apexpos.example.com',
                'is_featured' => true,
                'completed_at' => '2026-01-15',
            ],
            [
                'title' => 'Horizon Healthcare Clinical EHR & Telemedicine',
                'slug' => 'horizon-healthcare-telemedicine',
                'type' => 'software',
                'item_slug' => 'carepulse-telemedicine-app',
                'client_index' => 1,
                'cover_image' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&auto=format&fit=crop&q=80',
                'description' => "Architected a HIPAA-compliant telemedicine platform supporting HD video appointments, digital prescriptions, and laboratory test archiving across 6 regional clinics.",
                'project_url' => 'https://horizonhealth.example.com',
                'is_featured' => true,
                'completed_at' => '2026-02-10',
            ],
            [
                'title' => 'Aurora Luxury Lifestyle eCommerce Megastore',
                'slug' => 'aurora-luxury-lifestyle-store',
                'type' => 'website',
                'item_slug' => 'apexstore-ecommerce-platform',
                'client_index' => 4,
                'cover_image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80',
                'description' => "Engineered a high-traffic luxury fashion eCommerce portal capable of serving 50,000+ concurrent shoppers during Flash Sale campaigns with instantaneous bKash/Card checkout.",
                'project_url' => 'https://aurorashop.example.com',
                'is_featured' => true,
                'completed_at' => '2025-11-20',
            ],
            [
                'title' => 'Gourmet Dine Cloud Kitchen POS & KDS Network',
                'slug' => 'gourmet-dine-kds-pos',
                'type' => 'pos_software',
                'item_slug' => 'restrosync-restaurant-pos',
                'client_index' => 2,
                'cover_image' => 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=900&auto=format&fit=crop&q=80',
                'description' => "Implemented smart waiter tablet ordering, color-coded Kitchen Display Screens (KDS), and dynamic recipe stock deduction across 5 restaurant locations.",
                'project_url' => 'https://gourmetpos.example.com',
                'is_featured' => true,
                'completed_at' => '2026-03-01',
            ],
            [
                'title' => 'Pacific Global Enterprise Investor Portal',
                'slug' => 'pacific-global-investor-portal',
                'type' => 'website',
                'item_slug' => 'enterprise-corporate-portal',
                'client_index' => 5,
                'cover_image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80',
                'description' => "Designed and deployed a modern financial advisory portal featuring encrypted stakeholder document vaults, executive leadership showcases, and real-time portfolio statistics.",
                'project_url' => 'https://pacificglobal.example.com',
                'is_featured' => false,
                'completed_at' => '2025-12-10',
            ],
            [
                'title' => 'SwiftFleet Dispatch & GPS Routing System',
                'slug' => 'swiftfleet-dispatch-routing',
                'type' => 'software',
                'item_slug' => 'swiftcourier-delivery-app',
                'client_index' => 3,
                'cover_image' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=80',
                'description' => "Built an enterprise dispatch command console tracking 200+ delivery vehicles with automated AI route assignment and instant digital proof of delivery.",
                'project_url' => 'https://swiftfleet.example.com',
                'is_featured' => false,
                'completed_at' => '2026-04-18',
            ],
        ];

        foreach ($portfoliosData as $pData) {
            $itemSlug = $pData['item_slug'];
            $clientIdx = $pData['client_index'];
            unset($pData['item_slug'], $pData['client_index']);

            $pData['item_id'] = isset($createdItems[$itemSlug]) ? $createdItems[$itemSlug]->id : null;
            $pData['client_id'] = isset($createdClients[$clientIdx]) ? $createdClients[$clientIdx]->id : null;

            $portfolio = Portfolio::create($pData);

            PortfolioImage::create([
                'portfolio_id' => $portfolio->id,
                'image_path' => $portfolio->cover_image,
                'sort_order' => 1,
            ]);
            PortfolioImage::create([
                'portfolio_id' => $portfolio->id,
                'image_path' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80',
                'sort_order' => 2,
            ]);
        }

        // 6. Verified Client Reviews
        $reviewsData = [
            [
                'user_id' => $client->id,
                'rating' => 5,
                'title' => 'Exceptional POS & Retail Software',
                'comment' => 'The software development speed and code quality from IT SOLUTIONS exceeded all expectations. Our retail branches are running smoothly with zero downtime.',
                'project_name' => 'OmniPOS Multi-Branch Hub',
                'is_approved' => true,
            ],
            [
                'user_id' => $admin->id,
                'rating' => 5,
                'title' => 'Top Tier Architecture & Execution',
                'comment' => 'Excellent communication and top-tier architecture. The mobile apps and ERP backend integrate seamlessly with our existing databases.',
                'project_name' => 'Enterprise Cloud ERP Suite',
                'is_approved' => true,
            ],
        ];

        foreach ($reviewsData as $r) {
            Review::create($r);
        }

        // 7. Sample Quotes
        Quote::create([
            'name' => 'Mahmudul Hasan',
            'email' => 'mahmud@retailgroupbd.com',
            'phone' => '+880 1711 223344',
            'item_id' => $createdItems['omnipos-retail-hub']->id,
            'message' => 'We operate 12 retail outlets and require a customized multi-branch POS software with cloud inventory synchronization and barcode generation.',
            'status' => 'new',
        ]);

        Quote::create([
            'name' => 'Farhana Islam',
            'email' => 'farhana@medicarebd.com',
            'phone' => '+880 1822 556677',
            'item_id' => $createdItems['carepulse-telemedicine-app']->id,
            'message' => 'Looking to launch a telemedicine mobile app for our specialized hospital and 50+ consultant doctors.',
            'status' => 'contacted',
        ]);

        // 8. Sample Orders
        Order::create([
            'user_id' => $client->id,
            'item_id' => $createdItems['secureshield-endpoint-suite']->id,
            'transaction_id' => 'TXN-202608-001',
            'amount' => 35000.00,
            'currency' => 'BDT',
            'status' => 'paid',
            'payment_method' => 'bKash/Nagad',
        ]);

        // 9. Employees & Team Members
        Employee::create([
            'name' => 'Tareq Rahman',
            'email' => 'tareq.rahman@itsolutions.com',
            'phone' => '+880 1711-234567',
            'designation' => 'Lead Mobile Engineer (iOS & Flutter)',
            'department' => 'Mobile Development',
            'status' => 'active',
            'salary' => 95000.00,
            'joined_date' => '2024-03-15',
            'user_id' => $admin->id,
        ]);

        Employee::create([
            'name' => 'Sarah Karim',
            'email' => 'sarah.k@itsolutions.com',
            'phone' => '+880 1822-345678',
            'designation' => 'Cyber Security & DevOps Architect',
            'department' => 'Cyber Security',
            'status' => 'active',
            'salary' => 110000.00,
            'joined_date' => '2024-06-01',
        ]);

        Employee::create([
            'name' => 'Arif Hasan',
            'email' => 'arif.hasan@itsolutions.com',
            'phone' => '+880 1933-456789',
            'designation' => 'Senior Full-Stack & POS Developer',
            'department' => 'Engineering',
            'status' => 'active',
            'salary' => 85000.00,
            'joined_date' => '2024-09-10',
        ]);

        // 10. Subscriptions & Reorders (Monthly & Yearly Packages)
        Reorder::create([
            'user_id' => $client->id,
            'item_id' => $createdItems['omnipos-retail-hub']->id,
            'client_name' => 'Apex Retail Group',
            'client_email' => 'accounts@apexretail.com',
            'client_phone' => '+880 1711 002233',
            'company_name' => 'Apex Group Ltd',
            'package_name' => 'OmniPOS Multi-Branch Cloud Maintenance (Yearly)',
            'billing_cycle' => 'yearly',
            'price' => 85000.00,
            'currency' => 'BDT',
            'start_date' => now()->subYear()->addDays(2)->toDateString(),
            'finish_date' => now()->addDays(2)->toDateString(), // Expiring in 2 days!
            'status' => 'active',
            'reminder_days_before' => 14,
            'reminder_count' => 1,
            'last_reminder_sent_at' => now()->subDay(),
            'notes' => 'Annual multi-branch cloud database synchronization and 24/7 POS technical standby SLA.',
        ]);

        Reorder::create([
            'user_id' => null,
            'item_id' => $createdItems['carepulse-telemedicine-app']->id,
            'client_name' => 'Horizon Healthcare Labs',
            'client_email' => 'admin@horizonhealth.com',
            'client_phone' => '+880 1819 887766',
            'company_name' => 'Horizon Medical Corp',
            'package_name' => 'CarePulse Telemedicine Cloud SLA (Monthly)',
            'billing_cycle' => 'monthly',
            'price' => 15000.00,
            'currency' => 'BDT',
            'start_date' => now()->subDays(28)->toDateString(),
            'finish_date' => now()->addDays(2)->toDateString(), // Expiring in 2 days!
            'status' => 'active',
            'reminder_days_before' => 7,
            'reminder_count' => 1,
            'last_reminder_sent_at' => now()->subDay(),
            'notes' => 'Monthly WebRTC video streaming server and encrypted health record backup maintenance.',
        ]);

        Reorder::create([
            'user_id' => null,
            'item_id' => $createdItems['apexstore-ecommerce-platform']->id,
            'client_name' => 'Aurora Lifestyle BD',
            'client_email' => 'contact@auroralifestyle.com',
            'client_phone' => '+880 1912 334455',
            'company_name' => 'Aurora Lifestyle Corp',
            'package_name' => 'Aurora MegaStore Dedicated Cloud Hosting (Monthly)',
            'billing_cycle' => 'monthly',
            'price' => 9500.00,
            'currency' => 'BDT',
            'start_date' => now()->subMonths(2)->toDateString(),
            'finish_date' => now()->subDays(3)->toDateString(), // EXPIRED 3 days ago!
            'status' => 'expired',
            'reminder_days_before' => 5,
            'reminder_count' => 3,
            'last_reminder_sent_at' => now()->subDays(2),
            'notes' => 'High speed NVMe SSD VPS hosting, Redis cache, and SSL certificate maintenance.',
        ]);

        // 11. Site Settings
        SiteSetting::set('hero_headline', 'We Engineer World-Class Apps, Websites & Enterprise Software');
        SiteSetting::set('hero_subheadline', 'Empowering ambitious businesses with high-impact mobile experiences, custom cloud software, and modern web engineering.');
        SiteSetting::set('hero_badge', 'PREMIUM IT SOLUTIONS, APPS & SOFTWARE ENGINEERING');
        SiteSetting::set('hero_image_1', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80');
        SiteSetting::set('hero_image_2', 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop&q=80');
        SiteSetting::set('hero_image_1_tag', 'Enterprise Cloud & POS Systems');
        SiteSetting::set('hero_image_2_tag', 'Mobile Apps & High-Scale Web');
        SiteSetting::set('hero_stat1_value', '100+');
        SiteSetting::set('hero_stat1_label', 'Projects Delivered');
        SiteSetting::set('hero_stat2_value', '99.9%');
        SiteSetting::set('hero_stat2_label', 'Uptime Guarantee');
        SiteSetting::set('hero_stat3_value', '5.0 ★');
        SiteSetting::set('hero_stat3_label', 'Client Rating');
        SiteSetting::set('contact_email', 'contact@itsolutions.com');
        SiteSetting::set('contact_phone', '+880 1700-000000');
        SiteSetting::set('company_address', 'Level 8, Software Technology Park, Dhaka, Bangladesh');

        // 12. Live Chat Questions & Selections
        $this->call(ChatQuestionSeeder::class);
    }
}
