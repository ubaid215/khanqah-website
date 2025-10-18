'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole } from '@/types'; // Import UserRole enum

// -------------------- TYPES --------------------
type SubLink = {
  name: string;
  href: string;
};

type NavLinkType = {
  name: string;
  href: string;
  submenu?: SubLink[];
};

// Props for desktop link
interface NavLinkProps {
  link: NavLinkType;
  pathname: string;
}

// Props for mobile link
interface MobileNavLinkProps {
  link: NavLinkType;
  pathname: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// -------------------- NAVBAR COMPONENT --------------------
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const navLinks: NavLinkType[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Articles', href: '/articles' },
    // {
    //   name: 'Courses',
    //   href: '/courses',
    //   submenu: [
    //     { name: 'Taleem ul Quran', href: '/courses' },
    //     { name: 'Hadith and Sunnah', href: '/courses' },
    //     { name: 'Basics of Islam', href: '/courses' },
    //   ],
    // },
    { name: 'Books', href: '/books' },
  ];

  // Handle dashboard navigation based on user role - FIXED: Use UserRole enum
  const handleDashboardClick = () => {
    setShowUserMenu(false);
    if (user?.role === UserRole.ADMIN) { // Use enum value instead of string literal
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  // Handle profile navigation based on user role - FIXED: Use UserRole enum
  const handleProfileClick = () => {
    setShowUserMenu(false);
    if (user?.role === UserRole.ADMIN) { // Use enum value instead of string literal
      router.push('/admin/profile');
    } else {
      router.push('/dashboard/profile');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setShowUserMenu(false);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Top Navbar - Logo and Search */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`bg-white/75 backdrop-blur-sm border-b border-gray-100 transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Khanqah Saifia
              </motion.span>
            </Link>

            {/* Search and Mobile Menu */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Navbar - Navigation Links (Desktop) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="hidden lg:block bg-[#e5eff6]/75 backdrop-blur-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            {/* Spacer for balance when user is logged in */}
            {isAuthenticated && <div className="w-20"></div>}
            
            {/* Centered Navigation Links */}
            <div className="flex items-center justify-center gap-1 flex-1">
              {navLinks.map((link) => (
                <NavLink key={link.name} link={link} pathname={pathname} />
              ))}
            </div>
            
            {/* User Avatar Dropdown */}
            {isAuthenticated && user && (
              <div className="relative user-menu-container w-20 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Avatar 
                    src={user.image || undefined} 
                    alt={user.name || 'User'}
                    fallback={user.name || 'U'}
                    className="w-8 h-8"
                  />
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      showUserMenu ? 'rotate-180' : ''
                    }`}
                  />
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                        {/* FIXED: Use UserRole enum for comparison */}
                        {user.role === UserRole.ADMIN && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      
                      <div className="py-1">
                        <button
                          onClick={handleDashboardClick}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          <span>Dashboard</span>
                        </button>
                        
                        <button
                          onClick={handleProfileClick}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        >
                          <User className="w-5 h-5" />
                          <span>Profile</span>
                        </button>
                      </div>
                      
                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-sm border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <MobileNavLink
                  key={link.name}
                  link={link}
                  pathname={pathname}
                  setIsOpen={setIsOpen}
                />
              ))}
              
              {/* Mobile User Menu */}
              {isAuthenticated && user && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                    <Avatar 
                      src={user.image || undefined} 
                      alt={user.name || 'User'}
                      fallback={user.name || 'U'}
                      className="w-10 h-10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      {/* FIXED: Use UserRole enum for comparison */}
                      {user.role === UserRole.ADMIN && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleDashboardClick();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleProfileClick();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// -------------------- DESKTOP LINK --------------------
const NavLink: React.FC<NavLinkProps> = ({ link, pathname }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={link.href}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'text-blue-600 bg-blue-50 border border-blue-200'
            : 'text-gray-700 hover:text-blue-600 hover:border hover:border-gray-300'
        }`}
      >
        {link.name}
        {link.submenu && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isHovered ? 'rotate-180' : ''
            }`}
          />
        )}
      </Link>

      {/* Dropdown Menu */}
      {link.submenu && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 overflow-hidden"
            >
              {link.submenu.map((item: SubLink, idx: number) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                >
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

// -------------------- MOBILE LINK --------------------
const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  link,
  pathname,
  setIsOpen,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href={link.href}
          onClick={() => !link.submenu && setIsOpen(false)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive
              ? 'text-blue-600 bg-blue-50 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {link.name}
        </Link>
        {link.submenu && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* Mobile Submenu */}
      <AnimatePresence>
        {link.submenu && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 mt-1 space-y-1 overflow-hidden"
          >
            {link.submenu.map((item: SubLink) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;