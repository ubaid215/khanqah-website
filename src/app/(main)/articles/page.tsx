'use client';

import { motion } from 'framer-motion';
import { Search, Calendar, Clock, User, TrendingUp, BookOpen, Download, ArrowRight, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  slug?: string;
  views?: string;
  featured?: boolean;
  status?: string;
}

interface Ebook {
  id: string;
  title: string;
  author: string;
  description?: string;
  cover: string;
  pages?: string;
  downloads?: string;
  fileUrl?: string;
  slug?: string;
}

const ArticlesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [articles, setArticles] = useState<Article[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState({
    articles: true,
    ebooks: true
  });
  const [error, setError] = useState<string | null>(null);

  const categories = ['All', 'Spirituality', 'Fiqh', 'Hadith', 'Quran', 'History', 'Self-Development'];

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

  // Fetch articles from API
  const fetchArticles = async () => {
    try {
      setLoading(prev => ({ ...prev, articles: true }));
      setError(null);
      console.log('📝 Fetching articles for articles page...');
      
      const response = await apiClient.getPublicArticles({
        page: 1,
        limit: 20,
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
            excerpt: article.excerpt || article.description || (article.content ? article.content.substring(0, 150) + '...' : 'Read this insightful article'),
            category: article.category?.name || article.category || 'Spirituality',
            author: article.author || 'Khanqah Saifia',
            date: article.publishedAt || article.createdAt || article.date || new Date().toISOString(),
            readTime: article.readTime || article.duration || '5 min read',
            image: article.image || article.thumbnail || article.coverImage || getDefaultArticleImage(article.title),
            slug: article.slug,
            views: article.views ? `${(article.views / 1000).toFixed(1)}k` : '1.2k',
            featured: article.featured || false,
            status: article.status || 'PUBLISHED'
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
      setError('Failed to load articles. Please try again later.');
      setArticles([]);
    } finally {
      setLoading(prev => ({ ...prev, articles: false }));
    }
  };

  // Fetch ebooks from API
  const fetchEbooks = async () => {
    try {
      setLoading(prev => ({ ...prev, ebooks: true }));
      console.log('📖 Fetching ebooks for articles page...');
      
      const response = await apiClient.getPublicBooks({
        page: 1,
        limit: 10,
        status: 'PUBLISHED'
      });

      debugResponse('Ebooks', response);

      if (response.success && response.data) {
        let ebooksData: any[] = [];
        
        if (response.data.books && Array.isArray(response.data.books)) {
          ebooksData = response.data.books;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          ebooksData = response.data.data;
        } else if (Array.isArray(response.data)) {
          ebooksData = response.data;
        }

        console.log('📖 Extracted ebooks data:', ebooksData);

        if (ebooksData && ebooksData.length > 0) {
          const mappedEbooks = ebooksData.map((ebook: any) => ({
            id: ebook.id,
            title: ebook.title || 'Untitled Book',
            author: ebook.author || 'Unknown Author',
            description: ebook.description || ebook.summary,
            cover: ebook.image || ebook.coverImage || ebook.thumbnail || getDefaultBookImage(ebook.title),
            pages: ebook.pages ? `${ebook.pages}` : '200',
            downloads: ebook.downloads ? `${(ebook.downloads / 1000).toFixed(1)}k` : '5.2k',
            fileUrl: ebook.fileUrl || ebook.downloadUrl,
            slug: ebook.slug
          }));
          console.log('📖 Mapped ebooks:', mappedEbooks);
          setEbooks(mappedEbooks);
        } else {
          console.log('📖 No ebooks data found');
          setEbooks([]);
        }
      } else {
        console.log('📖 API response not successful');
        setEbooks([]);
      }
    } catch (err) {
      console.error('❌ Error fetching ebooks:', err);
      setEbooks([]);
    } finally {
      setLoading(prev => ({ ...prev, ebooks: false }));
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    try {
      console.log('🚀 Starting data fetching for articles page...');
      await Promise.all([fetchArticles(), fetchEbooks()]);
      console.log('✅ All data fetched successfully for articles page');
    } catch (err) {
      console.error('❌ Error in fetching data:', err);
      setError('Failed to load content. Please refresh the page.');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Helper functions for default images
  const getDefaultArticleImage = (title: string) => {
    const images = [
      'https://images.unsplash.com/photo-1610728488568-88c9f634d4d9?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1584286595398-a59f83aec53f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1585506019033-e6e14d8b0c70?w=800&h=500&fit=crop'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const getDefaultBookImage = (title: string) => {
    const images = [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = articles.filter(article => article.featured);

  // Loading skeletons
  const ArticleSkeleton = () => (
    <div className="group flex flex-col sm:flex-row gap-4 p-3 sm:p-5 bg-white rounded-xl border border-gray-100 animate-pulse">
      <div className="flex-shrink-0 w-full sm:w-48 h-40 sm:h-32 rounded-lg bg-gray-200"></div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="flex items-center gap-3">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  const FeaturedArticleSkeleton = () => (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-36 sm:h-48 bg-gray-200"></div>
      <div className="p-4 sm:p-5">
        <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const EbookSkeleton = () => (
    <div className="group cursor-pointer animate-pulse">
      <div className="flex gap-3 sm:gap-4">
        <div className="flex-shrink-0 w-16 sm:w-20 h-24 sm:h-28 rounded-lg bg-gray-200"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="w-full mt-3 h-8 bg-gray-200 rounded-lg"></div>
    </div>
  );

  // Empty state component
  const EmptyState = ({ type, message }: { type: string; message: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 bg-white rounded-xl border border-gray-200"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8 text-emerald-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No {type} Available
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {message}
      </p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Mini Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-3 sm:py-4"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-center sm:text-left">
            <p className="text-white text-xs sm:text-sm md:text-base font-medium">
              📚 Explore our collection of Islamic articles and spiritual guidance
            </p>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-emerald-600 text-xs sm:text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              Latest Updates
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
            

            {/* All Articles */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                {selectedCategory === 'All' ? 'All Articles' : `${selectedCategory} Articles`}
                {!loading.articles && (
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    ({filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'})
                  </span>
                )}
              </h2>
              
              {loading.articles ? (
                <div className="space-y-4 sm:space-y-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <ArticleSkeleton key={index} />
                  ))}
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {filteredArticles.map((article, index) => (
                    <motion.a
                      key={article.id}
                      href={`/articles/${article.slug || article.id}`}
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
              ) : (
                <EmptyState 
                  type="articles" 
                  message={
                    searchQuery 
                      ? `No articles found matching "${searchQuery}". Try different keywords.`
                      : selectedCategory !== 'All'
                      ? `No articles found in ${selectedCategory} category. Check back soon for new content.`
                      : "We're preparing amazing content for you. Please check back soon for new articles and spiritual insights."
                  }
                />
              )}
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
              
              {loading.ebooks ? (
                <div className="space-y-4 sm:space-y-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <EbookSkeleton key={index} />
                  ))}
                </div>
              ) : ebooks.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {ebooks.slice(0, 3).map((ebook, index) => (
                    <motion.div
                      key={ebook.id}
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
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Ebooks coming soon
                  </p>
                </div>
              )}
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