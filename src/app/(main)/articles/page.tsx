'use client';

import { motion } from 'framer-motion';
import { Search, Calendar, Clock, User, TrendingUp, BookOpen, Download, ArrowRight, Tag } from 'lucide-react';
import { useState } from 'react';

const ArticlesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Spirituality', 'Fiqh', 'Hadith', 'Quran', 'History', 'Self-Development'];

  const articles = [
    {
      id: 1,
      slug: 'importance-of-daily-dhikr',
      title: 'The Importance of Daily Dhikr in Spiritual Growth',
      excerpt: 'Discover how regular remembrance of Allah transforms the heart and brings peace to the soul through consistent spiritual practice.',
      image: 'https://images.unsplash.com/photo-1610728488568-88c9f634d4d9?w=800&h=500&fit=crop',
      category: 'Spirituality',
      author: 'Sheikh Abdullah Ahmad',
      date: '2024-03-15',
      readTime: '8 min read',
      views: '2.4k',
      featured: true,
    },
    {
      id: 2,
      slug: 'understanding-tazkiyah',
      title: 'Understanding Tazkiyah: Purification of the Soul',
      excerpt: 'Learn the comprehensive approach to spiritual purification and self-development in Islamic tradition.',
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=500&fit=crop',
      category: 'Self-Development',
      author: 'Dr. Fatima Hassan',
      date: '2024-03-12',
      readTime: '12 min read',
      views: '3.1k',
      featured: true,
    },
    {
      id: 3,
      slug: 'path-of-sufism',
      title: 'The Path of Sufism: Inner Dimensions of Islam',
      excerpt: 'An introduction to the mystical and spiritual aspects of Islamic practice and devotion.',
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=500&fit=crop',
      category: 'Spirituality',
      author: 'Maulana Ibrahim Khan',
      date: '2024-03-10',
      readTime: '10 min read',
      views: '1.8k',
      featured: false,
    },
    {
      id: 4,
      slug: 'hadith-compilation-science',
      title: 'The Science of Hadith Compilation',
      excerpt: 'Understanding the rigorous methodology used by scholars to preserve authentic prophetic traditions.',
      image: 'https://images.unsplash.com/photo-1584286595398-a59f83aec53f?w=800&h=500&fit=crop',
      category: 'Hadith',
      author: 'Dr. Muhammad Iqbal',
      date: '2024-03-08',
      readTime: '15 min read',
      views: '2.2k',
      featured: false,
    },
    {
      id: 5,
      slug: 'quran-recitation-benefits',
      title: 'Spiritual Benefits of Quran Recitation',
      excerpt: 'Explore the profound effects of Quranic recitation on the heart, mind, and soul.',
      image: 'https://images.unsplash.com/photo-1585506019033-e6e14d8b0c70?w=800&h=500&fit=crop',
      category: 'Quran',
      author: 'Qari Yusuf Ali',
      date: '2024-03-05',
      readTime: '7 min read',
      views: '4.5k',
      featured: false,
    },
    {
      id: 6,
      slug: 'islamic-golden-age',
      title: 'The Islamic Golden Age: Legacy of Knowledge',
      excerpt: 'Journey through the remarkable contributions of Muslim scholars to science and philosophy.',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=500&fit=crop',
      category: 'History',
      author: 'Prof. Aisha Rahman',
      date: '2024-03-03',
      readTime: '20 min read',
      views: '3.7k',
      featured: false,
    },
  ];

  const ebooks = [
    {
      title: 'The Book of Remembrance',
      author: 'Imam Al-Nawawi',
      cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
      pages: '248',
      downloads: '12.5k',
    },
    {
      title: 'Purification of the Heart',
      author: 'Hamza Yusuf',
      cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop',
      pages: '312',
      downloads: '18.2k',
    },
    {
      title: 'The Path to Allah',
      author: 'Sheikh Abdul Qadir',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
      pages: '196',
      downloads: '9.8k',
    },
  ];

  const trendingTopics = [
    { name: 'Ramadan Preparation', count: '156' },
    { name: 'Daily Prayers Guide', count: '142' },
    { name: 'Islamic Ethics', count: '128' },
    { name: 'Spiritual Reflection', count: '115' },
    { name: 'Prophetic Medicine', count: '98' },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = articles.filter(article => article.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Mini Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-3 sm:py-4"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-center sm:text-left">
            <p className="text-white text-xs sm:text-sm md:text-base font-medium">
              📚 New Article Series: Understanding Islamic Spirituality - Read Now!
            </p>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-emerald-600 text-xs sm:text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              Learn More
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Islamic <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Articles</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore insightful articles on Islamic knowledge, spirituality, and guidance
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 sm:mb-12"
        >
          {/* Search Bar */}
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Featured Articles */}
            {selectedCategory === 'All' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  Featured Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {featuredArticles.map((article, index) => (
                    <motion.a
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      <div className="relative h-36 sm:h-48 overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3 px-2 sm:px-3 py-1 bg-emerald-600 text-white text-[10px] sm:text-xs font-semibold rounded-full">
                          Featured
                        </div>
                      </div>
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-2 text-[10px] sm:text-xs text-gray-500">
                          <Tag className="w-3 h-3" />
                          <span>{article.category}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* All Articles */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                {selectedCategory === 'All' ? 'All Articles' : `${selectedCategory} Articles`}
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {filteredArticles.map((article, index) => (
                  <motion.a
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ x: 8 }}
                    className="group flex flex-col sm:flex-row gap-4 p-3 sm:p-5 bg-white rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex-shrink-0 w-full sm:w-48 h-40 sm:h-32 rounded-lg overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 text-[10px] sm:text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-medium">
                          {article.category}
                        </span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <span>{article.views} views</span>
                      </div>
                      <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{article.author}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 sm:space-y-8">
            {/* Latest Ebooks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Latest Ebooks</h3>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {ebooks.map((ebook, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="group cursor-pointer"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-16 sm:w-20 h-24 sm:h-28 rounded-lg overflow-hidden shadow-md">
                        <img
                          src={ebook.cover}
                          alt={ebook.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-2 text-sm sm:text-base">
                          {ebook.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 mb-2">{ebook.author}</p>
                        <div className="flex items-center gap-3 text-[10px] sm:text-xs text-gray-400">
                          <span>{ebook.pages} pages</span>
                          <span>•</span>
                          <span>{ebook.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      Download Now
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Trending Topics</h3>
              <div className="space-y-3 sm:space-y-4">
                {trendingTopics.map((topic, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-sm sm:text-base text-gray-700 group-hover:text-emerald-600 transition-colors">
                      {topic.name}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-400">{topic.count}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-4 sm:p-6 text-white"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-xs sm:text-sm text-white/90 mb-4">
                Get weekly articles delivered to your inbox
              </p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2 sm:py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;