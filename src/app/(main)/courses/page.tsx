'use client';

import { motion } from 'framer-motion';
import { Search, Filter, Clock, Users, Star, BookOpen, Award, TrendingUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['All', 'Quran', 'Hadith', 'Fiqh', 'Aqeedah', 'Seerah', 'Arabic Language', 'Spirituality'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const courses = [
    {
      id: 1,
      slug: 'quran-recitation-tajweed',
      title: 'Quran Recitation & Tajweed Mastery',
      description: 'Master the art of Quranic recitation with proper pronunciation and beautiful tajweed rules',
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=500&fit=crop',
      category: 'Quran',
      level: 'Beginner',
      duration: '12 weeks',
      lessons: 48,
      students: 2458,
      rating: 4.9,
      reviews: 342,
      instructor: 'Qari Abdullah Rahman',
      price: 99,
      featured: true,
    },
    {
      id: 2,
      slug: 'islamic-jurisprudence',
      title: 'Islamic Jurisprudence (Fiqh) Fundamentals',
      description: 'Comprehensive study of Islamic law and its practical applications in daily life',
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=500&fit=crop',
      category: 'Fiqh',
      level: 'Intermediate',
      duration: '16 weeks',
      lessons: 64,
      students: 1832,
      rating: 4.8,
      reviews: 256,
      instructor: 'Sheikh Muhammad Hassan',
      price: 129,
      featured: true,
    },
    {
      id: 3,
      slug: 'hadith-studies',
      title: 'Hadith Studies & Sciences',
      description: 'Explore the sayings and traditions of Prophet Muhammad (PBUH) with authentic chains',
      image: 'https://images.unsplash.com/photo-1610728488568-88c9f634d4d9?w=800&h=500&fit=crop',
      category: 'Hadith',
      level: 'Advanced',
      duration: '20 weeks',
      lessons: 80,
      students: 1245,
      rating: 4.9,
      reviews: 198,
      instructor: 'Dr. Fatima Al-Zahrani',
      price: 149,
      featured: true,
    },
    {
      id: 4,
      slug: 'arabic-language-beginners',
      title: 'Arabic Language for Beginners',
      description: 'Start your journey in learning classical Arabic to understand the Quran',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop',
      category: 'Arabic Language',
      level: 'Beginner',
      duration: '10 weeks',
      lessons: 40,
      students: 3124,
      rating: 4.7,
      reviews: 428,
      instructor: 'Ustadh Ibrahim Malik',
      price: 89,
      featured: false,
    },
    {
      id: 5,
      slug: 'islamic-history',
      title: 'Islamic History & Civilization',
      description: 'Journey through the rich history of Islamic civilization and its contributions',
      image: 'https://images.unsplash.com/photo-1584286595398-a59f83aec53f?w=800&h=500&fit=crop',
      category: 'Seerah',
      level: 'Beginner',
      duration: '8 weeks',
      lessons: 32,
      students: 2876,
      rating: 4.8,
      reviews: 312,
      instructor: 'Prof. Aisha Rahman',
      price: 79,
      featured: false,
    },
    {
      id: 6,
      slug: 'islamic-creed',
      title: 'Islamic Creed (Aqeedah) Essentials',
      description: 'Understand the fundamental beliefs and pillars of Islamic faith',
      image: 'https://images.unsplash.com/photo-1585506019033-e6e14d8b0c70?w=800&h=500&fit=crop',
      category: 'Aqeedah',
      level: 'Beginner',
      duration: '6 weeks',
      lessons: 24,
      students: 1567,
      rating: 4.9,
      reviews: 189,
      instructor: 'Sheikh Omar Al-Farsi',
      price: 69,
      featured: false,
    },
    {
      id: 7,
      slug: 'spiritual-purification',
      title: 'Spiritual Purification & Tazkiyah',
      description: 'Purify your soul and develop spiritual excellence through guided practice',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=500&fit=crop',
      category: 'Spirituality',
      level: 'Intermediate',
      duration: '14 weeks',
      lessons: 56,
      students: 1998,
      rating: 4.9,
      reviews: 267,
      instructor: 'Shaykh Yusuf Ali',
      price: 119,
      featured: false,
    },
    {
      id: 8,
      slug: 'advanced-arabic-grammar',
      title: 'Advanced Arabic Grammar (Nahw)',
      description: 'Master complex Arabic grammar rules for deeper Quranic understanding',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=500&fit=crop',
      category: 'Arabic Language',
      level: 'Advanced',
      duration: '18 weeks',
      lessons: 72,
      students: 892,
      rating: 4.8,
      reviews: 134,
      instructor: 'Dr. Khalid Mahmoud',
      price: 159,
      featured: false,
    },
  ];

  const stats = [
    { label: 'Active Students', value: '15,000+', icon: Users },
    { label: 'Expert Instructors', value: '50+', icon: Award },
    { label: 'Course Completion', value: '95%', icon: TrendingUp },
    { label: 'Average Rating', value: '4.8/5', icon: Star },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const featuredCourses = courses.filter(c => c.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Explore Our Islamic Courses
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto">
              Learn from expert scholars and deepen your understanding of Islam through comprehensive courses
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
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
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-3">
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
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
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
            {/* Level Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full sm:w-48 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>{level}</option>
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
                className="w-full sm:w-48 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-[42px] w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredCourses.length}</span> courses
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured Courses */}
        {selectedCategory === 'All' && (
          <section className="mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 sm:mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Featured Courses</h2>
              <p className="text-sm sm:text-base text-gray-600">Start with our most popular and highly-rated courses</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} featured />
              ))}
            </div>
          </section>
        )}

        {/* All Courses */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {selectedCategory === 'All' ? 'All Courses' : `${selectedCategory} Courses`}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const CourseCard = ({ course, index, featured = false }) => (
  <motion.a
    href={`/courses/${course.slug}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -10 }}
    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
  >
    <div className="relative h-40 sm:h-48 overflow-hidden">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {featured && (
        <div className="absolute top-3 left-3 px-2 sm:px-3 py-1 bg-amber-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center gap-1">
          <Award className="w-3 h-3" />
          Featured
        </div>
      )}
      <div className="absolute top-3 right-3 px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] sm:text-xs font-semibold text-gray-700 rounded-full">
        {course.level}
      </div>
      <div className="absolute bottom-3 left-3 px-2 sm:px-3 py-1 bg-emerald-600 text-white text-[10px] sm:text-xs font-semibold rounded-full">
        {course.category}
      </div>
    </div>

    <div className="p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
        {course.title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

      <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-gray-900">{course.rating}</span>
          <span>({course.reviews})</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{course.students.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{course.lessons} lessons</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600">${course.price}</div>
          <div className="text-[10px] sm:text-xs text-gray-500">per course</div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 sm:px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm"
        >
          Enroll Now
        </motion.button>
      </div>
    </div>
  </motion.a>
);

export default CoursesPage;