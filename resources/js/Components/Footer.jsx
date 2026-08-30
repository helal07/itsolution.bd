import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Sparkles, Mail, Phone, MapPin, ShieldCheck, Globe } from 'lucide-react';

export default function Footer() {
    const { siteSettings = {} } = usePage().props;

    const brandName = siteSettings.site_name || 'IT SOLUTIONS';
    const brandTagline = siteSettings.site_tagline || 'Next-generation software engineering house creating high-impact mobile apps, conversion-driven websites, and high-performance enterprise systems.';
    const contactEmail = siteSettings.contact_email || 'contact@itsolutions.com';
    const contactPhone = siteSettings.contact_phone || '+880 1700-000000';
    const companyAddress = siteSettings.company_address || 'Level 8, Software Technology Park, Dhaka, Bangladesh';
    const githubUrl = siteSettings.github_url || 'https://github.com';
    const linkedinUrl = siteSettings.linkedin_url || 'https://linkedin.com';
    const facebookUrl = siteSettings.facebook_url || 'https://facebook.com';

    return (
        <footer className="bg-primary-dark text-white pt-16 pb-12 border-t border-blue-900/40">
            <div className="site-container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
                    
                    {/* Column 1: Brand & Overview (2 cols on lg) */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            {siteSettings.site_logo ? (
                                <img 
                                    src={siteSettings.site_logo} 
                                    alt={brandName} 
                                    className="w-10 h-10 object-contain rounded-xl p-0.5 border border-white/20 bg-white shadow-md flex-shrink-0"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <span className="font-heading font-extrabold text-xl tracking-tight text-white truncate">
                                {brandName}
                            </span>
                        </Link>
                        
                        <p className="text-neutral-300 text-sm leading-relaxed max-w-sm">
                            {brandTagline}
                        </p>

                        <div className="pt-2 flex items-center gap-3 text-neutral-300">
                            {githubUrl && (
                                <a href={githubUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                                </a>
                            )}
                            {facebookUrl && (
                                <a href={facebookUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                            )}
                            {linkedinUrl && (
                                <a href={linkedinUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Our Services */}
                    <div className="space-y-3">
                        <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-primary-light">
                            Our Services
                        </h4>
                        <ul className="space-y-2 text-sm text-neutral-300">
                            <li>
                                <Link href="/services/apps" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                                    Mobile Apps
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/website" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                                    Websites & eCommerce
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/software" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                                    Enterprise Software
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-white hover:translate-x-1 inline-block transition-all text-xs font-semibold text-primary-light">
                                    Browse All Categories →
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Quick Navigation */}
                    <div className="space-y-3">
                        <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-primary-light">
                            Explore
                        </h4>
                        <ul className="space-y-2 text-sm text-neutral-300">
                            <li>
                                <Link href="/portfolio" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                                    Portfolio Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/clients" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                                    Client Testimonials
                                </Link>
                            </li>
                            <li>
                                <Link href="/get-a-quote" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                                    Request a Quote
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                                    Client Portal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact & Location */}
                    <div className="space-y-3">
                        <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-primary-light">
                            Contact Us
                        </h4>
                        <ul className="space-y-2.5 text-xs text-neutral-300">
                            <li className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-primary-light flex-shrink-0 mt-0.5" />
                                <span dangerouslySetInnerHTML={{ __html: companyAddress }} />
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-primary-light flex-shrink-0" />
                                <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors truncate">
                                    {contactEmail}
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-primary-light flex-shrink-0" />
                                <a href={`tel:${contactPhone}`} className="hover:text-white transition-colors">
                                    {contactPhone}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
                    <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1 text-emerald-400">
                            <ShieldCheck className="w-4 h-4" /> 100% Secure Checkout & Privacy Guaranteed
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
