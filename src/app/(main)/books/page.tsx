'use client';

import { motion } from 'framer-motion';
import { Search, Download, BookOpen, Eye, Star, Filter, ChevronDown, FileText, Heart, Share2 } from 'lucide-react';
import { useState } from 'react';

const BooksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['All', 'Quran', 'Hadith', 'Fiqh', 'Aqeedah', 'Seerah', 'Spirituality', 'Arabic', 'History'];
  const languages = ['All', 'English', 'Arabic', 'Urdu', 'Turkish'];

  const books = [
    {
      id: 1,
      slug: 'revival-religious-sciences',
      title: 'Revival of Religious Sciences',
      subtitle: 'Ihya Ulum al-Din',
      author: 'Imam Al-Ghazali',
      description: 'A comprehensive guide to Islamic spirituality and practice, covering purification of the heart, worship, and spiritual development',
      cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
      category: 'Spirituality',
      language: 'English',
      pages: 1248,
      fileSize: '8.5 MB',
      format: 'PDF',
      downloads: 15420,
      rating: 4.9,
      reviews: 342,
      publishYear: '2020',
      featured: true,
    },
    {
      id: 2,
      slug: 'riyad-al-salihin',
      title: 'Riyad al-Salihin',
      subtitle: 'Gardens of the Righteous',
      author: 'Imam An-Nawawi',
      description: 'Collection of authentic hadiths for righteous living, organized by topics covering all aspects of Islamic life',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
      category: 'Hadith',
      language: 'English',
      pages: 892,
      fileSize: '5.2 MB',
      format: 'PDF',
      downloads: 23150,
      rating: 4.9,
      reviews: 567,
      publishYear: '2019',
      featured: true,
    },
    {
      id: 3,
      slug: 'book-of-wisdom',
      title: 'The Book of Wisdom',
      subtitle: 'Kitab al-Hikam',
      author: 'Ibn Ata Allah al-Iskandari',
      description: 'Spiritual aphorisms and divine wisdom, offering profound insights into the nature of spiritual journey',
      cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
      category: 'Spirituality',
      language: 'English',
      pages: 156,
      fileSize: '2.1 MB',
      format: 'PDF',
      downloads: 12890,
      rating: 4.8,
      reviews: 234,
      publishYear: '2021',
      featured: true,
    },
    {
      id: 4,
      slug: 'purification-of-heart',
      title: 'Purification of the Heart',
      subtitle: 'Signs, Symptoms and Cures',
      author: 'Hamza Yusuf',
      description: 'Exploration of spiritual diseases of the heart and their remedies according to Islamic tradition',
      cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
      category: 'Spirituality',
      language: 'English',
      pages: 312,
      fileSize: '3.8 MB',
      format: 'PDF',
      downloads: 18250,
      rating: 4.9,
      reviews: 445,
      publishYear: '2018',
      featured: false,
    },
    {
      id: 5,
      slug: 'understanding-quran',
      title: 'Understanding the Quran',
      subtitle: 'Themes and Style',
      author: 'Muhammad Abdel Haleem',
      description: 'An accessible introduction to the Quran\'s themes, style, and impact on Muslim life',
      cover: 'https://images.unsplash.com/photo-1585506019033-e6e14d8b0c70?w=400&h=600&fit=crop',
      category: 'Quran',
      language: 'English',
      pages: 256,
      fileSize: '4.2 MB',
      format: 'PDF',
      downloads: 9870,
      rating: 4.7,
      reviews: 189,
      publishYear: '2020',
      featured: false,
    },
    {
      id: 6,
      slug: 'fiqh-us-sunnah',
      title: 'Fiqh us-Sunnah',
      subtitle: 'Islamic Jurisprudence',
      author: 'Sayyid Sabiq',
      description: 'Comprehensive guide to Islamic jurisprudence based on Quran and Sunnah',
      cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop',
      category: 'Fiqh',
      language: 'English',
      pages: 1456,
      fileSize: '10.5 MB',
      format: 'PDF',
      downloads: 14320,
      rating: 4.8,
      reviews: 378,
      publishYear: '2017',
      featured: false,
    },
    {
      id: 7,
      slug: 'sealed-nectar',
      title: 'The Sealed Nectar',
      subtitle: 'Biography of Prophet Muhammad',
      author: 'Safi-ur-Rahman al-Mubarakpuri',
      description: 'Award-winning biography of Prophet Muhammad (PBUH) based on authentic sources',
      cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
      category: 'Seerah',
      language: 'English',
      pages: 592,
      fileSize: '6.8 MB',
      format: 'PDF',
      downloads: 28450,
      rating: 4.9,
      reviews: 892,
      publishYear: '2019',
      featured: false,
    },
    {
      id: 8,
      slug: 'arabic-grammar-beginners',
      title: 'Arabic Grammar for Beginners',
      subtitle: 'Essential Rules Made Easy',
      author: 'Dr. Abdullah Mahmood',
      description: 'Simplified approach to learning Arabic grammar fundamentals',
      cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=600&fit=crop',
      category: 'Arabic',
      language: 'English',
      pages: 284,
      fileSize: '3.5 MB',
      format: 'PDF',
      downloads: 11240,
      rating: 4.6,
      reviews: 156,
      publishYear: '2021',
      featured: false,
    },
    {
      id: 9,
      slug: 'tafsir-ibn-kathir',
      title: 'Tafsir Ibn Kathir',
      subtitle: 'Abridged Version',
      author: 'Ibn Kathir',
      description: 'Classic Quranic commentary providing historical context and scholarly interpretation',
      cover: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop',
      category: 'Quran',
      language: 'English',
      pages: 2156,
      fileSize: '15.2 MB',
      format: 'PDF',
      downloads: 19870,
      rating: 4.9,
      reviews: 623,
      publishYear: '2018',
      featured: false,
    },
    {
      id: 10,
      slug: 'fortress-of-muslim',
      title: 'Fortress of the Muslim',
      subtitle: 'Hisnul Muslim',
      author: 'Sa\'id bin Wahf Al-Qahtani',
      description: 'Collection of authentic supplications and remembrances from Quran and Sunnah',
      cover: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=400&h=600&fit=crop',
      category: 'Spirituality',
      language: 'English',
      pages: 128,
      fileSize: '1.8 MB',
      format: 'PDF',
      downloads: 31250,
      rating: 4.9,
      reviews: 734,
      publishYear: '2020',
      featured: false,
    },
    {
      id: 11,
      slug: 'islamic-history-brief',
      title: 'A Brief History of Islam',
      subtitle: 'From Prophet to Present',
      author: 'Prof. Aisha Rahman',
      description: 'Concise overview of Islamic civilization and its contributions to humanity',
      cover: 'https://images.unsplash.com/photo-1584286595398-a59f83aec53f?w=400&h=600&fit=crop',
      category: 'History',
      language: 'English',
      pages: 412,
      fileSize: '5.6 MB',
      format: 'PDF',
      downloads: 8650,
      rating: 4.7,
      reviews: 198,
      publishYear: '2021',
      featured: false,
    },
    {
      id: 12,
      slug: 'fundamentals-of-tawheed',
      title: 'Fundamentals of Tawheed',
      subtitle: 'Islamic Monotheism',
      author: 'Dr. Abu Ameenah Bilal Philips',
      description: 'Clear explanation of Islamic concept of monotheism and its implications',
      cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
      category: 'Aqeedah',
      language: 'English',
      pages: 168,
      fileSize: '2.4 MB',
      format: 'PDF',
      downloads: 13540,
      rating: 4.8,
      reviews: 267,
      publishYear: '2019',
      featured: false,
    },
  ];

  const stats = [
    { label: 'Total Books', value: '500+', icon: BookOpen },
    { label: 'Total Downloads', value: '250K+', icon: Download },
    { label: 'Active Readers', value: '50K+', icon: Eye },
    { label: 'Average Rating', value: '4.8/5', icon: Star },
  ];

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'All' || book.language === selectedLanguage;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLanguage && matchesSearch;
  });

  const featuredBooks = books.filter(b => b.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Islamic Digital Library
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto">
              Access our extensive collection of Islamic books - Free to download and share
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, author, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Language Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full sm:w-48 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
              >
                {languages.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-[42px] w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-48 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
              >
                <option value="popular">Most Downloaded</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="title">Title (A-Z)</option>
              </select>
              <ChevronDown className="absolute right-3 top-[42px] w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredBooks.length}</span> books
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured Books */}
        {selectedCategory === 'All' && (
          <section className="mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 sm:mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Featured Books</h2>
              <p className="text-sm sm:text-base text-gray-600">Most popular and highly recommended books</p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
              {featuredBooks.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} featured />
              ))}
            </div>
          </section>
        )}

        {/* All Books */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {selectedCategory === 'All' ? 'All Books' : `${selectedCategory} Books`}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredBooks.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const BookCard = ({ book, index, featured = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      {/* Book Cover */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {featured && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-current" />
            Featured
          </div>
        )}
        
        {/* Hover Overlay */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-3"
          >
            <div className="flex gap-2 mb-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex-1 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
              >
                <Download className="w-4 h-4 text-gray-900 mx-auto" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
              >
                <Heart className="w-4 h-4 text-gray-900" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
              >
                <Share2 className="w-4 h-4 text-gray-900" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-1">{book.author}</p>

        <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-500">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-gray-900">{book.rating}</span>
          <span>({book.reviews})</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{book.pages}p</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{(book.downloads / 1000).toFixed(1)}K</span>
          </div>
        </div>

        <motion.a
          href={`/books/${book.slug}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="block w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-center"
        >
          Downlaod Book
        </motion.a>
      </div>
    </motion.div>
  );
};

export default BooksPage;