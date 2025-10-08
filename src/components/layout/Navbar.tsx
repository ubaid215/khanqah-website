'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    {
      name: 'Articles',
      href: '/articles',
      submenu: [
        { name: 'Tech Articles', href: '/articles/tech' },
        { name: 'Design Articles', href: '/articles/design' },
        { name: 'Business Articles', href: '/articles/business' },
      ],
    },
    {
      name: 'Courses',
      href: '/courses',
      submenu: [
        { name: 'Web Development', href: '/courses/web-dev' },
        { name: 'Mobile Development', href: '/courses/mobile-dev' },
        { name: 'Data Science', href: '/courses/data-science' },
      ],
    },
    { name: 'Books', href: '/books' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Top Navbar - Logo and Search */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-shadow duration-300 ${
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

            {/* Search Icon */}
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
        className="hidden lg:block bg-gray-50/95 backdrop-blur-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-12 gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.name} link={link} pathname={pathname} />
            ))}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ link, pathname }) => {
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
              {link.submenu.map((item, idx) => (
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

const MobileNavLink = ({ link, pathname, setIsOpen }) => {
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
            {link.submenu.map((item) => (
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