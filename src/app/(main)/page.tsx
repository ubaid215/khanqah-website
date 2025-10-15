'use client';

import { motion } from 'framer-motion';
import HeroSlider from '@/components/shared/HeroSlider';
import { BookOpen, Users, Heart, Sparkles, ArrowRight, Book, FileText, Star, Mosque, Scale, Gem, Calendar, Building } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useEffect, useState } from 'react';

// Define types for our data
interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  slug?: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  image: string;
  slug?: string;
}

const Homepage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState({
    articles: true,
    books: true
  });
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  // Five Pillars of Islam data
  const pillars = [
    {
      title: 'Shahada',
      description: 'Declaration of Faith',
      arabic: 'الشهادة',
      meaning: 'Belief in the oneness of Allah and the prophethood of Muhammad (PBUH)',
      icon: Star,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Salah',
      description: 'Prayer',
      arabic: 'الصلاة',
      meaning: 'Performing the five daily prayers facing the Kaaba in Mecca',
      icon: Building,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Zakat',
      description: 'Charity',
      arabic: 'الزكاة',
      meaning: 'Giving a portion of wealth to those in need and for community welfare',
      icon: Scale,
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Sawm',
      description: 'Fasting',
      arabic: 'الصوم',
      meaning: 'Fasting during the month of Ramadan from dawn until sunset',
      icon: Gem,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Hajj',
      description: 'Pilgrimage',
      arabic: 'الحج',
      meaning: 'Pilgrimage to Mecca at least once in lifetime for those who are able',
      icon: Calendar,
      color: 'from-red-500 to-rose-500'
    }
  ];

  // Programs data
  const programs = [
    {
      title: 'Qur\'anic Studies',
      description: 'Deepen your understanding of Allah\'s words through guided tafsir and tajweed.',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Hadith & Fiqh',
      description: 'Learn the authentic teachings and rulings that shape a Muslim\'s daily life.',
      icon: Book,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Arabic Language',
      description: 'Build a strong foundation in the language of the Qur\'an.',
      icon: FileText,
      color: 'from-amber-500 to-orange-600'
    },
    {
      title: 'Tasawwuf & Spiritual Development',
      description: 'Purify the heart and strengthen your connection with Allah.',
      icon: Heart,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Youth & Family Tarbiyat Programs',
      description: 'Practical guidance for families, youth, and spiritual growth.',
      icon: Users,
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  // Gallery images (placeholder - replace with actual images)
  const galleryImages = [
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764',
    'https://images.unsplash.com/photo-1744264362119-bd94511b0597?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1156',
    'https://images.unsplash.com/photo-1743427053878-1fedee64e2db?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'https://images.unsplash.com/photo-1566346289693-a555ded1b37d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1612466163276-93e41076dcf0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=677',
    'https://plus.unsplash.com/premium_photo-1678483063222-b9cbc116b371?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=715'
  ];

  // About section image
  const aboutImage = '/images/astana.jpg';

  // Gallery animation variants
  const galleryVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      rotate: 2,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Debug function to log API responses
  const debugResponse = (type: string, response: any) => {
    console.log(`🔍 ${type} API Response:`, {
      success: response.success,
      data: response.data,
      hasData: !!response.data,
      dataStructure: response.data ? Object.keys(response.data) : 'no data',
      fullResponse: response
    });
  };

  // Fetch data sequentially with delays
  const fetchAllData = async () => {
    if (isFetching) return;
    
    setIsFetching(true);
    setError(null);

    try {
      console.log('🚀 Starting sequential data fetching...');
      
      // Wait 500ms before fetching articles
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchArticles();
      
      // Wait 500ms before fetching books
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchBooks();
      
      console.log('✅ All data fetched successfully');
    } catch (err) {
      console.error('❌ Error in sequential fetching:', err);
      setError('Failed to load some content. Please refresh the page.');
    } finally {
      setIsFetching(false);
    }
  };

  // Fetch articles from API
  const fetchArticles = async () => {
    try {
      setLoading(prev => ({ ...prev, articles: true }));
      console.log('📝 Fetching articles...');
      
      const response = await apiClient.getPublicArticles({
        page: 1,
        limit: 3,
        status: 'PUBLISHED'
      });

      debugResponse('Articles', response);

      if (response.success && response.data) {
        let articlesData: any[] = [];
        
        if (response.data.articles && Array.isArray(response.data.articles)) {
          articlesData = response.data.articles;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          articlesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          articlesData = response.data;
        }

        console.log('📝 Extracted articles data:', articlesData);

        if (articlesData && articlesData.length > 0) {
          const mappedArticles = articlesData.map((article: any) => ({
            id: article.id,
            title: article.title || 'Untitled Article',
            excerpt: article.excerpt || article.description || (article.content ? article.content.substring(0, 100) + '...' : 'Read this insightful article'),
            category: article.category?.name || article.category || 'Spirituality',
            readTime: article.readTime || article.duration || '5 min read',
            image: article.image || article.thumbnail || article.coverImage || getDefaultArticleImage(article.title),
            slug: article.slug
          }));
          console.log('📝 Mapped articles:', mappedArticles);
          setArticles(mappedArticles);
        } else {
          console.log('📝 No articles data found');
          setArticles([]);
        }
      } else {
        console.log('📝 API response not successful');
        setArticles([]);
      }
    } catch (err) {
      console.error('❌ Error fetching articles:', err);
      setArticles([]);
    } finally {
      setLoading(prev => ({ ...prev, articles: false }));
    }
  };

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      setLoading(prev => ({ ...prev, books: true }));
      console.log('📖 Fetching books...');
      
      const response = await apiClient.getPublicBooks({
        page: 1,
        limit: 4,
        status: 'PUBLISHED'
      });

      debugResponse('Books', response);

      if (response.success && response.data) {
        let booksData: any[] = [];
        
        if (response.data.books && Array.isArray(response.data.books)) {
          booksData = response.data.books;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          booksData = response.data.data;
        } else if (Array.isArray(response.data)) {
          booksData = response.data;
        }

        console.log('📖 Extracted books data:', booksData);

        if (booksData && booksData.length > 0) {
          const mappedBooks = booksData.map((book: any) => ({
            id: book.id,
            title: book.title || 'Untitled Book',
            author: book.author || 'Unknown Author',
            description: book.description || book.summary || 'A valuable resource for spiritual growth',
            image: book.image || book.coverImage || book.thumbnail || getDefaultBookImage(book.title),
            slug: book.slug
          }));
          console.log('📖 Mapped books:', mappedBooks);
          setBooks(mappedBooks);
        } else {
          console.log('📖 No books data found');
          setBooks([]);
        }
      } else {
        console.log('📖 API response not successful');
        setBooks([]);
      }
    } catch (err) {
      console.error('❌ Error fetching books:', err);
      setBooks([]);
    } finally {
      setLoading(prev => ({ ...prev, books: false }));
    }
  };

  useEffect(() => {
    console.log('🚀 Homepage mounted, starting sequential data fetching...');
    fetchAllData();
  }, []);

  // Helper functions for default images
  const getDefaultArticleImage = (title: string) => {
    const images = [
      'https://images.unsplash.com/photo-1610728488568-88c9f634d4d9?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=300&h=200&fit=crop'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const getDefaultBookImage = (title: string) => {
    const images = [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=300&fit=crop'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  // Loading skeletons
  const ArticleSkeleton = () => (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 animate-pulse">
      <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded mb-1"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const BookSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  // Check if articles and books section should be shown
  const showArticlesBooksSection = articles.length > 0 || books.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Debug info - remove in production */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Hero Slider */}
      <HeroSlider />

      {/* About Section with Image on Left */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Section - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={aboutImage}
                  alt="Khanqah Saifia - Spiritual Learning Center"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Decorative elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl rotate-12 shadow-xl"
              ></motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl -rotate-12 shadow-xl"
              ></motion.div>
            </motion.div>

            {/* Content Section - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Where Knowledge Meets the{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Light of the Heart
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                <span className="font-semibold text-emerald-600">Khanqah Saifia</span> is more than an institute — it's a sanctuary of learning and transformation. 
                Guided by <span className="font-medium text-gray-800">Sarkar Wakeel Sahib Mubarik</span>, our purpose is to awaken hearts through 
                <span className="italic"> authentic Islamic knowledge, Sufi guidance, and Tarbiyat</span>.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed">
                Every class, every gathering, and every moment here is designed to help you draw closer to Allah with love, understanding, and clarity.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  {
                    title: 'Authentic Education',
                    description: 'Qur\'an & Sunnah based learning',
                    icon: BookOpen,
                    color: 'from-emerald-500 to-teal-500'
                  },
                  {
                    title: 'Spiritual Guidance',
                    description: 'Sufi path of purification',
                    icon: Heart,
                    color: 'from-purple-500 to-pink-500'
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 mt-6"
              >
                Discover Our Journey
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Five Pillars of Islam Section */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        {/* Fixed Background */}
        <div 
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/bg-img.jpg")'
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              The Five Pillars of Islam
            </h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              The foundation of Muslim life and the framework of worship
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="group text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{pillar.title}</h3>
                  <div className="text-lg font-semibold text-amber-200 mb-2">{pillar.arabic}</div>
                  <div className="text-sm text-blue-100 font-medium mb-3">{pillar.description}</div>
                  <p className="text-xs text-white/80 leading-relaxed">{pillar.meaning}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Learn. Reflect. Transform.
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              We offer structured courses that blend traditional Islamic scholarship with modern accessibility — designed for all levels of learners across the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{program.description}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
            >
              Browse All Courses
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section with Light Gradient and Animation */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Moments of Light and Reflection
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              A glimpse into our gatherings, study sessions, and moments of Zikr — capturing the beauty of spiritual companionship and learning.
            </p>
          </motion.div>

          <motion.div
            variants={galleryVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-6"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                variants={imageVariants}
                whileHover="hover"
                className="relative overflow-hidden rounded-2xl aspect-square group cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="text-white text-sm font-medium">
                    Spiritual Moment {index + 1}
                  </div>
                </div>
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
            >
              View More Moments
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Articles & Books Section - Conditionally Rendered */}
      {showArticlesBooksSection && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Articles - Conditionally Rendered */}
              {articles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                      Latest Articles
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {loading.articles ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <ArticleSkeleton key={index} />
                      ))
                    ) : (
                      articles.map((article, index) => (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ x: 8 }}
                          className="group flex gap-4 p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
                        >
                          <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                {article.category}
                              </span>
                              <span className="text-xs text-gray-500">{article.readTime}</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    View All Articles
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Books - Conditionally Rendered */}
              {books.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Book className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                      Featured Books
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {loading.books ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <BookSkeleton key={index} />
                      ))
                    ) : (
                      books.map((book, index) => (
                        <motion.div
                          key={book.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ y: -10, scale: 1.05 }}
                          className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                        >
                          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-1">
                              {book.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                            <p className="text-xs text-gray-600 line-clamp-2">{book.description}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    Explore Library
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Begin Your Spiritual Journey
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              Join our community of seekers and embark on a transformative path of knowledge and spiritual growth
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 sm:px-10 py-4 bg-white text-emerald-600 font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 inline-flex items-center gap-2 text-lg"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;