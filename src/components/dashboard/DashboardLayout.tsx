"use client";

import { motion } from "framer-motion";
import { 
    LayoutDashboard, 
    BookOpen, 
    Award, 
    ClipboardList, 
    FolderKanban, 
    LineChart,
    LogOut,
    Menu,
    X,
    User,
    ChevronDown
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const sidebarLinks = [
    { title: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { title: "My Courses", icon: BookOpen, href: "/dashboard/courses" },
    { title: "Certificates", icon: Award, href: "/dashboard/certificates" },
    { title: "Assessments", icon: ClipboardList, href: "/dashboard/tests" },
    { title: "Projects", icon: FolderKanban, href: "/dashboard/projects" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token') || localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Cookies.remove('token');
        router.push('/login');
    };

    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0a0a0a] sticky top-0 h-screen">
                <div className="p-8">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-[#00875a]">
                        SPARKIIT<span className="text-white">.</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                    isActive 
                                    ? "bg-[#00875a] text-white font-bold" 
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <link.icon size={20} />
                                {link.title}
                            </Link>
                        );
                    })}
                </nav>

                {/* Profile Section */}
                {user && (
                    <div className="px-4 py-6 border-t border-white/5 space-y-2">
                        <button 
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-[#00875a]/30 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#00875a] flex items-center justify-center font-bold text-white shadow-lg shadow-[#00875a]/20 shrink-0 overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="min-w-0 text-left">
                                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                    <p className="text-[10px] text-gray-400 truncate uppercase tracking-widest">{user.role || 'Student'}</p>
                                </div>
                            </div>
                            <motion.div
                                animate={{ rotate: isProfileDropdownOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-gray-500 group-hover:text-[#00875a]"
                            >
                                <ChevronDown size={16} />
                            </motion.div>
                        </button>
                        
                        <AnimatePresence>
                            {isProfileDropdownOpen && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-1 gap-2 py-2">
                                        <Link 
                                            href="/dashboard/profile"
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00875a]/10 text-[#00875a] hover:bg-[#00875a] hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
                                        >
                                            <User size={14} />
                                            Update Profile
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider text-left"
                                        >
                                            <LogOut size={14} />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-6 z-50">
                <Link href="/" className="text-xl font-black tracking-tighter text-[#00875a]">
                    SPARKIIT
                </Link>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:hidden fixed inset-0 z-40 bg-[#0a0a0a] pt-20 px-6"
                >
                    <nav className="space-y-4">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-lg ${
                                        isActive 
                                        ? "bg-[#00875a] text-white font-bold" 
                                        : "text-gray-400"
                                    }`}
                                >
                                    <link.icon size={24} />
                                    {link.title}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile Profile Section */}
                    {user && (
                        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
                                <div className="w-14 h-14 rounded-full bg-[#00875a] flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-[#00875a]/20 overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-white">{user.name}</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest">{user.role || 'Student'}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3">
                                <Link 
                                    href="/dashboard/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#00875a] text-white font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#00875a]/20"
                                >
                                    <User size={20} />
                                    Update Profile
                                </Link>
                                <button 
                                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold uppercase tracking-widest text-sm border border-red-500/20"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-0 pt-20 lg:pt-0">
                <div className="p-6 md:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
