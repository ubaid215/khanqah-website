'use client';

import { motion } from 'framer-motion';
import HeroSlider from '@/components/shared/HeroSlider';
import { BookOpen, Users, Heart, Sparkles, ArrowRight, Book, FileText } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useEffect, useState } from 'react';

// Define types for our data
interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  level: string;
  duration: string;
  slug?: string;
}

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState({
    courses: true,
    articles: true,
    books: true
  });
  const [error, setError] = useState<string | null>(null);

  const features = [
    {
      title: 'Authentic Islamic Knowledge',
      description: 'Learn from verified scholars and traditional sources',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Spiritual Guidance',
      description: 'Connect with experienced mentors for your spiritual journey',
      icon: Heart,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Community Support',
      description: 'Join a vibrant community of learners and seekers',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Personal Growth',
      description: 'Transform yourself through continuous learning and practice',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
    },
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

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoading(prev => ({ ...prev, courses: true }));
      console.log('📚 Fetching courses...');
      
      const response = await apiClient.getPublicCourses({
        page: 1,
        limit: 4,
        status: 'PUBLISHED'
      });

      debugResponse('Courses', response);

      if (response.success && response.data) {
        // FIXED: Properly extract courses from the nested structure
        let coursesData: any[] = [];
        
        if (response.data.courses && Array.isArray(response.data.courses)) {
          // Structure: { data: { courses: [...] } }
          coursesData = response.data.courses;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Structure: { data: { data: [...] } }
          coursesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          // Structure: { data: [...] }
          coursesData = response.data;
        }

        console.log('📚 Extracted courses data:', coursesData);

        if (coursesData && coursesData.length > 0) {
          const mappedCourses = coursesData.map((course: any) => ({
            id: course.id,
            title: course.title || 'Untitled Course',
            description: course.description || course.excerpt || 'Explore this comprehensive course',
            image: course.image || course.thumbnail || getDefaultCourseImage(course.title),
            level: course.level || course.difficulty || 'All Levels',
            duration: course.duration || '12 weeks',
            slug: course.slug
          }));
          console.log('📚 Mapped courses:', mappedCourses);
          setCourses(mappedCourses);
        } else {
          console.log('📚 No courses data, using fallback');
          setCourses(getDefaultCourses());
        }
      } else {
        console.log('📚 API response not successful, using fallback');
        setCourses(getDefaultCourses());
      }
    } catch (err) {
      console.error('❌ Error fetching courses:', err);
      setError('Failed to load courses');
      setCourses(getDefaultCourses());
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
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
        // FIXED: Properly extract articles from the nested structure
        let articlesData: any[] = [];
        
        if (response.data.articles && Array.isArray(response.data.articles)) {
          // Structure: { data: { articles: [...] } }
          articlesData = response.data.articles;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Structure: { data: { data: [...] } }
          articlesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          // Structure: { data: [...] }
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
          console.log('📝 No articles data, using fallback');
          setArticles(getDefaultArticles());
        }
      } else {
        console.log('📝 API response not successful, using fallback');
        setArticles(getDefaultArticles());
      }
    } catch (err) {
      console.error('❌ Error fetching articles:', err);
      setError('Failed to load articles');
      setArticles(getDefaultArticles());
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
        // FIXED: Properly extract books from the nested structure
        let booksData: any[] = [];
        
        if (response.data.books && Array.isArray(response.data.books)) {
          // Structure: { data: { books: [...] } }
          booksData = response.data.books;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Structure: { data: { data: [...] } }
          booksData = response.data.data;
        } else if (Array.isArray(response.data)) {
          // Structure: { data: [...] }
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
          console.log('📖 No books data, using fallback');
          setBooks(getDefaultBooks());
        }
      } else {
        console.log('📖 API response not successful, using fallback');
        setBooks(getDefaultBooks());
      }
    } catch (err) {
      console.error('❌ Error fetching books:', err);
      setError('Failed to load books');
      setBooks(getDefaultBooks());
    } finally {
      setLoading(prev => ({ ...prev, books: false }));
    }
  };

  useEffect(() => {
    console.log('🚀 Homepage mounted, fetching data...');
    fetchCourses();
    fetchArticles();
    fetchBooks();
  }, []);

  // Helper functions for default data and images
  const getDefaultCourseImage = (title: string) => {
    const images = [
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1610728488568-88c9f634d4d9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1584286595398-a59f83aec53f?w=400&h=300&fit=crop'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const getDefaultArticleImage = (title: string) => {
    const images = [
      'https://images.unsplash.com/photo-1610728488568-88c9f634d4d9?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=300&h=200&fit=crop'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  

  const getDefaultCourses = (): Course[] => [
    {
      id: '1',
      title: 'Quran Recitation & Tajweed',
      description: 'Master the art of Quranic recitation with proper pronunciation',
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=300&fit=crop',
      level: 'Beginner',
      duration: '12 weeks',
    },
    {
      id: '2',
      title: 'Islamic Jurisprudence (Fiqh)',
      description: 'Understand Islamic law and its practical applications',
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=300&fit=crop',
      level: 'Intermediate',
      duration: '16 weeks',
    },
    {
      id: '3',
      title: 'Hadith Studies',
      description: 'Explore the sayings and traditions of Prophet Muhammad (PBUH)',
      image: 'https://images.unsplash.com/photo-1610728488568-88c9f634d4d9?w=400&h=300&fit=crop',
      level: 'Advanced',
      duration: '20 weeks',
    },
    {
      id: '4',
      title: 'Islamic History & Civilization',
      description: 'Journey through the rich history of Islamic civilization',
      image: 'https://images.unsplash.com/photo-1584286595398-a59f83aec53f?w=400&h=300&fit=crop',
      level: 'All Levels',
      duration: '10 weeks',
    },
  ];

  const getDefaultArticles = (): Article[] => [
    {
      id: '1',
      title: 'The Importance of Daily Dhikr',
      excerpt: 'Discover the spiritual benefits and transformation through regular remembrance',
      category: 'Spirituality',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1610728488568-88c9f634d4d9?w=300&h=200&fit=crop',
    },
    {
      id: '2',
      title: 'Understanding Tazkiyah',
      excerpt: 'Learn about the purification of the soul and its practical steps',
      category: 'Self-Development',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=300&h=200&fit=crop',
    },
    {
      id: '3',
      title: 'The Path of Sufism',
      excerpt: 'An introduction to the inner dimensions of Islamic spirituality',
      category: 'Tasawwuf',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=300&h=200&fit=crop',
    },
  ];

  const getDefaultBooks = (): Book[] => [
    {
      id: '1',
      title: 'Revival of Religious Sciences',
      author: 'Imam Al-Ghazali',
      description: 'A comprehensive guide to Islamic spirituality and practice',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop',
    },
    {
      id: '2',
      title: 'Riyad al-Salihin',
      author: 'Imam An-Nawawi',
      description: 'Collection of authentic hadiths for righteous living',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop',
    },
    {
      id: '3',
      title: 'The Book of Wisdom',
      author: 'Ibn Ata Allah',
      description: 'Spiritual aphorisms and divine wisdom',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
    },
    {
      id: '4',
      title: 'Purification of the Heart',
      author: 'Hamza Yusuf',
      description: 'Signs, symptoms and cures of spiritual diseases',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=300&fit=crop',
    },
  ];

  // Loading skeletons
  const CourseSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

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

  // Debug current state
  useEffect(() => {
    console.log('📊 Current State:', {
      courses,
      articles, 
      books,
      loading,
      error
    });
  }, [courses, articles, books, loading, error]);

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Khanqah Saifia
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A sanctuary for Islamic learning and spiritual guidance, where hearts find peace and souls find purpose. 
              Join us on a transformative journey towards spiritual excellence and authentic knowledge.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => {
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
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Start Your Learning Journey Today
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated courses designed to deepen your understanding of Islam
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading.courses ? (
              // Show skeletons while loading
              Array.from({ length: 4 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            ) : courses.length > 0 ? (
              // Show actual courses
              courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                      {course.level}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>⏱ {course.duration}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      Enroll Now
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              // Show fallback if no courses
              getDefaultCourses().map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                      {course.level}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>⏱ {course.duration}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      Enroll Now
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Articles & Books Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Articles */}
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
                  // Show skeletons while loading
                  Array.from({ length: 3 }).map((_, index) => (
                    <ArticleSkeleton key={index} />
                  ))
                ) : articles.length > 0 ? (
                  // Show actual articles
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
                ) : (
                  // Show fallback if no articles
                  getDefaultArticles().map((article, index) => (
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

            {/* Books */}
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
                  // Show skeletons while loading
                  Array.from({ length: 4 }).map((_, index) => (
                    <BookSkeleton key={index} />
                  ))
                ) : books.length > 0 ? (
                  // Show actual books
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
                ) : (
                  // Show fallback if no books
                  getDefaultBooks().map((book, index) => (
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
          </div>
        </div>
      </section>

      {/* Add 5 pillars of islam section with images and content */}


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