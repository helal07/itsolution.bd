<?php

namespace Database\Seeders;

use App\Models\ChatQuestion;
use Illuminate\Database\Seeder;

class ChatQuestionSeeder extends Seeder
{
    public function run(): void
    {
        ChatQuestion::truncate();

        $questions = [
            [
                'question' => '👨‍💻 Connect to Live Support Team',
                'keywords' => 'support, human, agent, representative, talk, call, helpdesk, lead',
                'answer' => 'Transferring your chat to our Technical Engineering & Support desk. You can chat live or reach us via WhatsApp and Email.',
                'category' => 'Live Support',
                'action_label' => 'WhatsApp Support',
                'action_url' => 'https://wa.me/8801800000000',
                'suggested_options' => [
                    '🛡️ Ready Security Apps & Software',
                    '💳 License & Payment Support',
                    '⚡ Custom Software & Quotes'
                ],
                'is_quick_option' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'question' => '🛡️ Ready Security Apps & Software',
                'keywords' => 'apps, software, ready, product, catalog, security, systems, tools, pos',
                'answer' => 'We engineer and sell ready-to-use high-security apps, inventory systems, POS software, and web tools with 256-bit encryption and instant license activation.',
                'category' => 'Apps & Systems',
                'action_label' => 'Browse Apps & Software',
                'action_url' => '/services',
                'suggested_options' => [
                    'How does license activation work?',
                    '👨‍💻 Connect to Live Support Team',
                    '⚡ Custom Software & Quotes'
                ],
                'is_quick_option' => true,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'question' => '💳 License & Payment Support',
                'keywords' => 'license, key, order, purchase, payment, bkash, nagad, card, invoice',
                'answer' => 'When you purchase any app or software, your license key (ITS-SEC-XXXX) and official invoice are instantly generated and accessible under your Profile Workspace. We accept bKash, Nagad, Visa/Mastercard, and Bank Wire transfers.',
                'category' => 'Licenses & Billing',
                'action_label' => 'View My Licenses & Pay',
                'action_url' => '/profile',
                'suggested_options' => [
                    'What payment gateways are supported?',
                    'How do I renew my subscription package?',
                    '👨‍💻 Connect to Live Support Team'
                ],
                'is_quick_option' => true,
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'question' => '⚡ Custom Software & Quotes',
                'keywords' => 'custom, quote, pricing, estimate, timeline, bespoke, tailored, build, proposal',
                'answer' => 'Need custom mobile apps, tailored SaaS engines, or enterprise systems? You can submit your requirements for an architectural review and receive a quote within 24 hours.',
                'category' => 'Custom Quotes',
                'action_label' => 'Request Instant Quote',
                'action_url' => '/get-a-quote',
                'suggested_options' => [
                    'What is the typical sprint delivery time?',
                    'Do you provide 24/7 technical maintenance SLA?',
                    '👨‍💻 Connect to Live Support Team'
                ],
                'is_quick_option' => true,
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'question' => 'How does license activation work?',
                'keywords' => 'activation, license activation, token, verify, key activation, register app',
                'answer' => 'After completing checkout, your unique License Key is generated automatically. Enter this key during initial app setup to activate your instance and unlock lifetime updates and API cloud sync.',
                'category' => 'Licenses & Billing',
                'action_label' => 'Go to Workspace',
                'action_url' => '/profile',
                'suggested_options' => [
                    '💳 License & Payment Support',
                    '👨‍💻 Connect to Live Support Team'
                ],
                'is_quick_option' => false,
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'question' => 'What payment gateways are supported?',
                'keywords' => 'payment method, bkash, nagad, rocket, credit card, mastercard, visa, bank wire',
                'answer' => 'We support instant mobile payments via bKash, Nagad, and Rocket, along with Visa/Mastercard credit/debit cards and official company Bank Wire transfers.',
                'category' => 'Licenses & Billing',
                'action_label' => 'Payment Options',
                'action_url' => '/profile',
                'suggested_options' => [
                    '💳 License & Payment Support',
                    'How do I renew my subscription package?'
                ],
                'is_quick_option' => false,
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'question' => 'What is the typical sprint delivery time?',
                'keywords' => 'delivery, timeline, sprint, speed, how fast, duration, launch',
                'answer' => 'Standard sprints range between 2 to 4 weeks depending on the architecture scope. For urgent launches, our Express Velocity track accelerates deployment in 7 to 10 business days.',
                'category' => 'Custom Quotes',
                'action_label' => 'Estimate Scope & Timeline',
                'action_url' => '/#estimator',
                'suggested_options' => [
                    '⚡ Custom Software & Quotes',
                    '👨‍💻 Connect to Live Support Team'
                ],
                'is_quick_option' => false,
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'question' => 'Do you provide 24/7 technical maintenance SLA?',
                'keywords' => 'sla, maintenance, server, uptime, support, warranty, 24/7',
                'answer' => 'Yes! All enterprise platforms and ready applications come with 99.99% uptime cloud SLAs, automated security patches, real-time database backups, and dedicated engineer standby.',
                'category' => 'Live Support',
                'action_label' => 'Explore SLA Services',
                'action_url' => '/services',
                'suggested_options' => [
                    '👨‍💻 Connect to Live Support Team',
                    '🛡️ Ready Security Apps & Software'
                ],
                'is_quick_option' => false,
                'sort_order' => 8,
                'is_active' => true,
            ],
        ];

        foreach ($questions as $q) {
            ChatQuestion::create($q);
        }
    }
}
