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
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
  ];

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

      {/* About Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white/70 backdrop-blur-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section Intro */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 lg:mb-16"
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        Where Knowledge Meets the Light of the Heart
      </h2>
      <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
        <span className="font-semibold text-emerald-600">Khanqah Saifia</span> is more than an institute — it’s a sanctuary of learning and transformation. 
        Guided by <span className="font-medium text-gray-800">Sarkar Wakeel Sahib Mubarik</span>, our purpose is to awaken hearts through 
        <span className="italic"> authentic Islamic knowledge, Sufi guidance, and Tarbiyat</span>. 
        Every class, every gathering, and every moment here is designed to help you draw closer to Allah with love, understanding, and clarity.
      </p>
    </motion.div>

    {/* Features Grid */}
    {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {[
        {
          title: 'Authentic Islamic Education',
          description:
            'Learn from trusted scholars and the timeless teachings of Qur’an and Sunnah.',
          icon: BookOpen,
          color: 'from-emerald-500 to-teal-500',
        },
        {
          title: 'Spiritual Guidance & Tarbiyat',
          description:
            'Walk the Sufi path of purification under the mentorship of sincere guides.',
          icon: Heart,
          color: 'from-purple-500 to-pink-500',
        },
        {
          title: 'Global Learning Community',
          description:
            'Join a worldwide family of seekers dedicated to knowledge and remembrance (Zikr).',
          icon: Users,
          color: 'from-blue-500 to-cyan-500',
        },
        {
          title: 'Path of Love & Purity',
          description:
            'Transform your inner world through continuous learning, reflection, and devotion.',
          icon: Sparkles,
          color: 'from-amber-500 to-orange-500',
        },
      ].map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group p-6 lg:p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
          </motion.div>
        );
      })}
    </div> */}

    {/* Button CTA */}
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
        Discover Our Journey
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
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

      {/* Gallery Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Moments of Light and Reflection
            </h2>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
              A glimpse into our gatherings, study sessions, and moments of Zikr — capturing the beauty of spiritual companionship and learning.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-xl aspect-square"
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all duration-300" />
              </motion.div>
            ))}
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
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
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