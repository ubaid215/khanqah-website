'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, Eye, Share2, Bookmark, ChevronLeft, ChevronRight, Tag, Heart, MessageCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  status: string;
  readTime: number;
  views: number;
  createdAt: string;
  publishedAt: string;
  tags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  author?: {
    id: string;
    name: string;
    email: string;
    image: string;
    bio: string;
  };
  _count?: {
    bookmarks: number;
  };
}

interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  readTime: number;
  tags: Array<{
    tag: {
      name: string;
    };
  }>;
}

// Define API response types - handle both direct data and wrapped responses
interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  id?: string;
  error?: string;
}

// More flexible response types that can handle different API response structures
type ArticleResponse = Article | ApiResponse<Article>;

interface ArticlesListResponse {
  success?: boolean;
  data?: {
    articles: RelatedArticle[];
    total: number;
  };
  articles?: RelatedArticle[];
  total?: number;
}

const ArticleDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to extract article data from different response structures
  const extractArticleData = (response: ArticleResponse): Article | null => {
    if (!response) return null;

    // If response is already an Article (direct response)
    if ('id' in response && 'title' in response) {
      return response as Article;
    }

    // If response is an ApiResponse with data property
    const apiResponse = response as ApiResponse<Article>;
    if (apiResponse.data && 'id' in apiResponse.data) {
      return apiResponse.data;
    }

    // If response has success property but data might be the article itself
    if (apiResponse.success && 'id' in apiResponse) {
      return apiResponse as unknown as Article;
    }

    return null;
  };

  // Helper function to extract related articles from response
  const extractRelatedArticles = (response: ArticlesListResponse): RelatedArticle[] => {
    if (!response) return [];

    // If response has data.articles
    if (response.data?.articles) {
      return response.data.articles;
    }

    // If response has direct articles array
    if (response.articles) {
      return response.articles;
    }

    // If response is an array (direct array response)
    if (Array.isArray(response)) {
      return response as RelatedArticle[];
    }

    return [];
  };

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const slug = params.slug as string;
        const response = await apiClient.getArticleBySlug(slug) as ArticleResponse;
        
        const articleData = extractArticleData(response);
        
        if (articleData) {
          // Transform the response data to match our Article interface
          const transformedArticle: Article = {
            ...articleData,
            excerpt: articleData.excerpt || '',
            thumbnail: articleData.thumbnail || 'https://images.unsplash.com/photo-1610728488568-88c9f634d4d9?w=1200&h=600&fit=crop',
            readTime: articleData.readTime || 5,
            views: articleData.views || 0,
            publishedAt: articleData.publishedAt || articleData.createdAt,
            tags: articleData.tags || [],
            author: articleData.author ? {
              ...articleData.author,
              image: articleData.author.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(articleData.author.name)}&size=100`,
              bio: articleData.author.bio || 'Article author'
            } : undefined
          };
          
          setArticle(transformedArticle);
          
          // Fetch related articles based on tags
          if (articleData.tags && articleData.tags.length > 0) {
            const tagSlug = articleData.tags[0].tag.slug;
            const relatedResponse = await apiClient.getPublishedArticles({
              tag: tagSlug,
              limit: 3
            }) as ArticlesListResponse;
            
            const relatedArticlesData = extractRelatedArticles(relatedResponse);
            
            if (relatedArticlesData.length > 0) {
              // Filter out current article and limit to 3
              const filtered = relatedArticlesData
                .filter((a: RelatedArticle) => a.id !== articleData.id)
                .slice(0, 3);
              setRelatedArticles(filtered);
            }
          }
        } else {
          setError('Article not found');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchArticle();
    }
  }, [params.slug]);

  const handleLike = async () => {
    if (!article) return;
    
    try {
      // TODO: Implement like functionality in your API
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleBookmark = async () => {
    if (!article) return;
    
    try {
      if (isBookmarked) {
        // Remove bookmark
        await apiClient.deleteBookmark(article.id);
      } else {
        // Add bookmark
        await apiClient.createBookmark({
          articleId: article.id,
          type: 'ARTICLE'
        });
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error bookmarking article:', error);
    }
  };

  const handleShare = async (platform: string) => {
    if (!article) return;
    
    const shareUrl = window.location.href;
    const title = article.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        break;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The article you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/articles')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get category from tags (use first tag as category)
  const category = article.tags.length > 0 ? article.tags[0].tag.name : 'General';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden"
      >
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <motion.button
          onClick={() => router.push('/articles')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all text-sm sm:text-base"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Back to Articles</span>
          <span className="sm:hidden">Back</span>
        </motion.button>

        {/* Category Badge */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1 bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-full">
          {category}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
          {/* Main Content */}
          <article className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8"
            >
              {/* Article Header */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  {article.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{article.readTime} min read</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{article.views} views</span>
                  </div>
                </div>

                {/* Author Info */}
                {article.author && (
                  <div className="flex items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200">
                    <img
                      src={article.author.image}
                      alt={article.author.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{article.author.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{article.author.bio}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm ${
                      isLiked
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="hidden xs:inline">{likes}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBookmark}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm ${
                      isBookmarked
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">Save</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare('copy')}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </motion.button>
                </div>
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-emerald-600 prose-strong:text-gray-900 prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <span className="text-sm sm:text-base font-semibold text-gray-900">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map(({ tag }) => (
                      <a
                        key={tag.id}
                        href={`/articles?tag=${tag.slug}`}
                        className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs sm:text-sm rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-gray-200"
                      >
                        #{tag.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Comments</h3>
              <div className="mb-6">
                <textarea
                  placeholder="Share your thoughts..."
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
                <div className="flex justify-end mt-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 sm:px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all"
                  >
                    Post Comment
                  </motion.button>
                </div>
              </div>
              <div className="text-sm sm:text-base text-gray-500 text-center py-6 sm:py-8">
                Be the first to comment on this article
              </div>
            </motion.div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:space-y-8">
            {/* Table of Contents */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 lg:sticky lg:top-24"
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Table of Contents</h3>
              <nav className="space-y-2 sm:space-y-3">
                {/* You can parse the content to generate actual headings */}
                <a href="#introduction" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Introduction
                </a>
                <a href="#spiritual-benefits" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Key Points
                </a>
                <a href="#conclusion" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Conclusion
                </a>
              </nav>
            </motion.div>

            {/* Share Article */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-4 sm:p-6 text-white"
            >
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Share This Article</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('facebook')}
                  className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all text-xs sm:text-sm font-medium"
                >
                  Facebook
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('twitter')}
                  className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all text-xs sm:text-sm font-medium"
                >
                  Twitter
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('whatsapp')}
                  className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all text-xs sm:text-sm font-medium"
                >
                  WhatsApp
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare('copy')}
                  className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all text-xs sm:text-sm font-medium"
                >
                  Copy Link
                </motion.button>
              </div>
            </motion.div>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 sm:mt-16 lg:mt-20"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Related Articles</h2>
              <a
                href="/articles"
                className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedArticles.map((related, index) => (
                <motion.a
                  key={related.id}
                  href={`/articles/${related.slug}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={related.thumbnail || 'https://images.unsplash.com/photo-1610728488568-88c9f634d4d9?w=400&h=300&fit=crop'}
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {related.tags.length > 0 && (
                      <div className="absolute top-3 left-3 px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm text-xs sm:text-sm font-semibold text-gray-700 rounded-full">
                        {related.tags[0].tag.name}
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{related.readTime || 5} min read</span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ArticleDetailPage;