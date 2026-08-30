import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    MessageSquare, 
    X, 
    Send, 
    Sparkles, 
    Bot, 
    User, 
    ArrowRight, 
    RotateCcw,
    Headphones,
    PhoneCall,
    Mail,
    CheckCircle2,
    ShieldCheck,
    MessageCircle,
    Clock
} from 'lucide-react';

export default function SupportChatBot() {
    const { auth, siteSettings = {}, chatQuestions = [] } = usePage().props;
    const user = auth?.user;

    // Check if live chat is enabled globally
    const isChatEnabled = siteSettings.chat_is_enabled !== '0';

    const botName = siteSettings.chat_bot_name || 'ITS AI Assistant';
    const agentName = siteSettings.chat_agent_name || 'Engr. Tanvir (Support Lead)';
    const welcomeGreeting = siteSettings.chat_welcome_message || "Hello! 👋 I'm your AI Solutions Assistant. You can ask me any question about our ready apps, licenses, or connect directly to our 24/7 Human Support Team.";
    const supportPhone = siteSettings.chat_support_phone || siteSettings.whatsapp_number || siteSettings.contact_phone || '+880 1800-000000';
    const supportEmail = siteSettings.chat_support_email || siteSettings.contact_email || 'support@itsolutions.com';

    // Compute starter quick options
    const starterOptions = useMemo(() => {
        const activeDbQuestions = (chatQuestions || []).filter(q => q.is_active);
        const quickDb = activeDbQuestions.filter(q => q.is_quick_option).map(q => q.question);

        if (quickDb.length > 0) {
            return quickDb;
        }

        if (activeDbQuestions.length > 0) {
            return activeDbQuestions.slice(0, 4).map(q => q.question);
        }

        return [
            "👨‍💻 Connect to Live Support Team",
            "🛡️ Ready Security Apps & Software",
            "💳 License & Payment Support",
            "⚡ Custom Software & Quotes"
        ];
    }, [chatQuestions]);

    const initialMessages = useMemo(() => [
        {
            id: 'welcome-1',
            sender: 'bot',
            text: welcomeGreeting,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            options: starterOptions
        }
    ], [welcomeGreeting, starterOptions]);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(initialMessages);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showBubblePrompt, setShowBubblePrompt] = useState(true);
    const [isLiveAgentMode, setIsLiveAgentMode] = useState(false);
    const [agentConnected, setAgentConnected] = useState(false);
    
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Sync initial messages when props update if chat hasn't started
    useEffect(() => {
        if (messages.length === 1 && messages[0].id === 'welcome-1') {
            setMessages(initialMessages);
        }
    }, [initialMessages]);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setShowBubblePrompt(false);
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isOpen, messages, isTyping, isLiveAgentMode]);

    if (!isChatEnabled) {
        return null;
    }

    // Switch to human support mode
    const connectToHumanSupport = () => {
        setIsLiveAgentMode(true);
        setIsTyping(true);

        const transferMsg = {
            id: `sys-${Date.now()}`,
            sender: 'system',
            text: "🔄 Forwarding conversation to the Support Team...",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, transferMsg]);

        setTimeout(() => {
            setAgentConnected(true);
            setIsTyping(false);

            const agentWelcome = {
                id: `agent-${Date.now()}`,
                sender: 'agent',
                agentName: agentName,
                text: `Hi ${user?.name || 'there'}! 👋 I am Tanvir from the Senior Support & Security Team. Your session is now connected live. How can we assist you with your app licenses, orders, or technical queries?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                supportHotlines: true
            };

            setMessages((prev) => [...prev, agentWelcome]);
        }, 1100);
    };

    // AI intelligent bot replies based on dynamic chatQuestions from DB
    const generateBotResponse = (userInput) => {
        const query = userInput.toLowerCase().trim();
        
        let response = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: '',
            links: [],
            options: []
        };

        if (query.includes('support') || query.includes('human') || query.includes('agent') || query.includes('team') || query.includes('call') || query.includes('forward') || query.includes('connect to live support team')) {
            connectToHumanSupport();
            return null;
        }

        const activeQuestions = (chatQuestions || []).filter(q => q.is_active);

        // 1. Check exact question match
        let matched = activeQuestions.find(q => q.question.toLowerCase().trim() === query);

        // 2. Check trigger keywords
        if (!matched) {
            matched = activeQuestions.find(q => {
                if (!q.keywords) return false;
                const kwList = q.keywords.toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
                return kwList.some(k => query.includes(k) || k.includes(query));
            });
        }

        // 3. Check partial question contains
        if (!matched) {
            matched = activeQuestions.find(q => {
                const qText = q.question.toLowerCase();
                return query.includes(qText) || qText.includes(query);
            });
        }

        if (matched) {
            response.text = matched.answer;
            if (matched.action_label && matched.action_url) {
                response.links = [
                    { label: matched.action_label, url: matched.action_url }
                ];
            }
            if (matched.suggested_options && Array.isArray(matched.suggested_options) && matched.suggested_options.length > 0) {
                response.options = matched.suggested_options;
            } else {
                response.options = ["👨‍💻 Connect to Live Support Team", ...starterOptions.slice(0, 2)];
            }
            return response;
        }

        // Fallback default response
        response.text = "Thank you for reaching out! You can explore our ready security apps and digital products, or connect directly with our Support Engineering Lead for instant assistance.";
        response.links = [
            { label: "Explore Apps Catalog", url: "/services" },
            { label: "Get a Free Quote", url: "/get-a-quote" }
        ];
        response.options = starterOptions;

        return response;
    };

    const handleSendMessage = (textToSend) => {
        const text = textToSend || inputText.trim();
        if (!text) return;

        // Check if user clicked Connect to Support
        if (text.includes("Connect to Live Support Team")) {
            connectToHumanSupport();
            setInputText('');
            return;
        }

        const userMsg = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        if (isLiveAgentMode) {
            // Live Agent response
            setTimeout(() => {
                const agentReply = {
                    id: `agent-${Date.now()}`,
                    sender: 'agent',
                    agentName: agentName,
                    text: `Thank you for your message! Our team has received your query: "${text}". An escalation ticket has been linked to your session. We are also available on WhatsApp and Phone for instant resolution.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    supportHotlines: true
                };
                setMessages((prev) => [...prev, agentReply]);
                setIsTyping(false);
            }, 1000);
        } else {
            // Bot response
            setTimeout(() => {
                const botResponse = generateBotResponse(text);
                if (botResponse) {
                    setMessages((prev) => [...prev, botResponse]);
                }
                setIsTyping(false);
            }, 600);
        }
    };

    const handleResetChat = () => {
        setIsLiveAgentMode(false);
        setAgentConnected(false);
        setMessages(initialMessages);
    };

    const cleanPhoneForWhatsApp = (supportPhone || '').replace(/[^0-9]/g, '');

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            
            {/* 1. Floating Welcome Bubble Prompt */}
            {!isOpen && showBubblePrompt && (
                <div className="mb-3 p-3.5 max-w-xs bg-white rounded-2xl shadow-xl border border-neutral-200 text-neutral-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                        <p className="leading-snug">Need help with apps or wish to talk to our Support Team?</p>
                    </div>
                    <button 
                        onClick={() => setShowBubblePrompt(false)} 
                        className="text-neutral-400 hover:text-neutral-600 p-1"
                        aria-label="Dismiss prompt"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* 2. Chat Window */}
            {isOpen && (
                <div className="w-[92vw] sm:w-[390px] h-[530px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-neutral-200/80 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 mb-3">
                    
                    {/* Header */}
                    <div className={`p-4 text-white flex items-center justify-between shadow-md transition-all ${
                        isLiveAgentMode 
                            ? 'bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 border-b border-emerald-500/30' 
                            : 'bg-gradient-to-r from-blue-950 via-primary to-slate-900'
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md ${
                                    isLiveAgentMode ? 'bg-emerald-600' : 'bg-gradient-to-tr from-primary via-blue-500 to-cyan-400'
                                }`}>
                                    {isLiveAgentMode ? <Headphones className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
                            </div>
                            <div>
                                <h3 className="font-heading font-black text-sm text-white flex items-center gap-1.5 leading-tight">
                                    <span>{isLiveAgentMode ? 'Live Support Team' : botName}</span>
                                    <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                                </h3>
                                <p className="text-[11px] text-cyan-200 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                    <span>{isLiveAgentMode ? 'Support Engineer Connected' : 'Online • 24/7 Instant Support'}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            {!isLiveAgentMode && (
                                <button
                                    onClick={connectToHumanSupport}
                                    className="px-2.5 py-1 rounded-xl bg-white/15 hover:bg-emerald-600 text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                    title="Transfer to Human Support Team"
                                >
                                    <Headphones className="w-3 h-3" />
                                    <span>Support</span>
                                </button>
                            )}

                            <button
                                onClick={handleResetChat}
                                className="p-1.5 rounded-xl hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                title="Restart Conversation"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-xl hover:bg-white/15 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                title="Close Chat"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'bot' && (
                                    <div className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center text-xs flex-shrink-0 shadow-sm mt-0.5">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                )}

                                {msg.sender === 'agent' && (
                                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs flex-shrink-0 shadow-sm mt-0.5">
                                        <Headphones className="w-4 h-4" />
                                    </div>
                                )}

                                <div className="space-y-2 max-w-[82%]">
                                    {msg.sender === 'system' ? (
                                        <div className="p-2 rounded-xl bg-blue-100/70 text-blue-950 text-xs font-semibold text-center">
                                            {msg.text}
                                        </div>
                                    ) : (
                                        <div
                                            className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                                msg.sender === 'user'
                                                    ? 'bg-primary text-white rounded-br-none shadow-md'
                                                    : msg.sender === 'agent'
                                                    ? 'bg-white text-neutral-900 border border-emerald-200 rounded-tl-none shadow-sm'
                                                    : 'bg-white text-neutral-800 rounded-tl-none border border-neutral-200/80 shadow-sm'
                                            }`}
                                        >
                                            {msg.agentName && (
                                                <span className="text-[10px] font-bold text-emerald-700 block mb-1">
                                                    👨‍💻 {msg.agentName}
                                                </span>
                                            )}
                                            <p className="whitespace-pre-line">{msg.text}</p>
                                        </div>
                                    )}

                                    {/* Support Hotlines & WhatsApp Connect Card */}
                                    {msg.supportHotlines && (
                                        <div className="p-3 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-2 text-xs">
                                            <span className="font-bold text-neutral-900 block">⚡ Instant Escalation Channels:</span>
                                            <div className="flex flex-col gap-1.5">
                                                <a 
                                                    href={`https://wa.me/${cleanPhoneForWhatsApp || '8801800000000'}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition-colors"
                                                >
                                                    <span className="flex items-center gap-1.5">
                                                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                                        WhatsApp Support Hotline
                                                    </span>
                                                    <span className="text-[10px] text-emerald-600">{supportPhone}</span>
                                                </a>

                                                <a 
                                                    href={`mailto:${supportEmail}`} 
                                                    className="flex items-center justify-between p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold transition-colors"
                                                >
                                                    <span className="flex items-center gap-1.5">
                                                        <Mail className="w-3.5 h-3.5 text-primary" />
                                                        Email Support Desk
                                                    </span>
                                                    <span className="text-[10px] text-primary">{supportEmail}</span>
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Links Pill Buttons */}
                                    {msg.links && msg.links.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {msg.links.map((link, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={link.url}
                                                    onClick={() => setIsOpen(false)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold shadow-sm transition-all"
                                                >
                                                    <span>{link.label}</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Follow-up Suggestion Chips */}
                                    {msg.options && msg.options.length > 0 && (
                                        <div className="flex flex-col gap-1.5 pt-1">
                                            {msg.options.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSendMessage(opt)}
                                                    className="text-left px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-neutral-700 hover:text-primary border border-neutral-200/80 hover:border-primary/40 text-xs font-medium transition-all shadow-2xs flex items-center justify-between group cursor-pointer"
                                                >
                                                    <span>{opt}</span>
                                                    <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <span className="text-[10px] text-neutral-400 block px-1">
                                        {msg.timestamp}
                                    </span>
                                </div>

                                {msg.sender === 'user' && (
                                    <div className="w-7 h-7 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-xs flex-shrink-0 shadow-sm mt-0.5">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Animation */}
                        {isTyping && (
                            <div className="flex gap-2.5 items-center">
                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 shadow-sm ${
                                    isLiveAgentMode ? 'bg-emerald-600 text-white' : 'bg-primary text-white'
                                }`}>
                                    {isLiveAgentMode ? <Headphones className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className="bg-white border border-neutral-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Bar */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={isLiveAgentMode ? "Message Support Team..." : "Ask AI or type 'support' to transfer..."}
                            className="flex-1 px-4 py-2.5 bg-neutral-100 focus:bg-white text-xs sm:text-sm rounded-xl border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-neutral-900 placeholder:text-neutral-400"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className={`w-10 h-10 rounded-xl text-white flex items-center justify-center transition-all flex-shrink-0 shadow-sm cursor-pointer ${
                                isLiveAgentMode 
                                    ? 'bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40' 
                                    : 'bg-primary hover:bg-primary-hover disabled:opacity-40'
                            }`}
                            aria-label="Send message"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* 3. Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-950 via-primary to-primary-hover text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 border border-white/20 cursor-pointer"
                aria-label="Toggle live technical support chat"
            >
                <div className="relative">
                    <MessageSquare className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-primary-dark animate-pulse"></span>
                </div>
                <span className="font-heading font-bold text-xs sm:text-sm tracking-wide hidden sm:inline-block">
                    {isOpen ? 'Close Chat' : 'Live Support'}
                </span>
            </button>
        </div>
    );
}
