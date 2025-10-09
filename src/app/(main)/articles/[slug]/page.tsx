'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, Eye, Share2, Bookmark, ChevronLeft, ChevronRight, Tag, Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const ArticleDetailPage = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(245);
  const [isLiked, setIsLiked] = useState(false);

  const article = {
    id: 1,
    slug: 'importance-of-daily-dhikr',
    title: 'The Importance of Daily Dhikr in Spiritual Growth',
    excerpt: 'Discover how regular remembrance of Allah transforms the heart and brings peace to the soul through consistent spiritual practice.',
    content: `
      <h2>Introduction</h2>
      <p>In the journey of spiritual development, few practices hold as much transformative power as dhikr - the remembrance of Allah. This sacred practice, deeply rooted in Islamic tradition, serves as a beacon of light guiding believers towards inner peace and spiritual enlightenment.</p>
      
      <p>The Prophet Muhammad (peace be upon him) emphasized the significance of dhikr in numerous hadith, describing it as the polish that removes the rust from hearts. Just as a mirror requires regular cleaning to reflect clearly, our hearts need the constant remembrance of Allah to maintain their spiritual clarity.</p>

      <h2>The Spiritual Benefits of Dhikr</h2>
      <p>When we engage in regular dhikr, we create a direct connection with the Divine. This practice transcends mere words; it becomes a state of consciousness that permeates every aspect of our lives. The heart that remembers Allah finds tranquility in His remembrance, as mentioned in the Quran: "Verily, in the remembrance of Allah do hearts find rest" (13:28).</p>

      <p>Regular dhikr cultivates mindfulness and presence, allowing us to break free from the distractions of worldly life. It serves as an anchor, keeping us grounded in our faith even amidst life's storms. Through consistent practice, we develop a heightened awareness of Allah's presence in every moment.</p>

      <h2>Practical Implementation</h2>
      <p>Beginning a dhikr practice doesn't require elaborate preparations. Start with simple phrases like "SubhanAllah" (Glory be to Allah), "Alhamdulillah" (All praise is due to Allah), and "Allahu Akbar" (Allah is the Greatest). These powerful expressions can be repeated throughout the day, transforming routine moments into opportunities for spiritual connection.</p>

      <p>The early morning hours, particularly the time before Fajr prayer, offer a special opportunity for dhikr. The stillness of these moments creates an ideal environment for deep spiritual reflection and connection with the Divine.</p>

      <h2>Overcoming Challenges</h2>
      <p>Many seekers struggle with maintaining consistency in their dhikr practice. The key lies in starting small and gradually building the habit. Even a few minutes of sincere remembrance daily can create profound changes in one's spiritual state. Quality surpasses quantity - it's better to have five minutes of focused, heartfelt dhikr than an hour of mechanical repetition.</p>

      <h2>The Transformative Power</h2>
      <p>As we persist in our dhikr practice, we begin to notice subtle but significant changes. Our perspective shifts, our patience increases, and our hearts become more receptive to divine guidance. The practice becomes a source of strength during difficult times and a means of expressing gratitude during moments of joy.</p>

      <p>The scholars of tasawwuf (Islamic spirituality) describe dhikr as the food of the soul. Just as our bodies require regular nourishment, our souls need the constant remembrance of Allah to thrive and grow. Through this practice, we align ourselves with our true purpose and find the peace that our hearts naturally seek.</p>

      <h2>Conclusion</h2>
      <p>Daily dhikr is not merely a religious obligation; it's a gift that Allah has given us to maintain our connection with Him. As we incorporate this practice into our daily lives, we embark on a transformative journey that brings us closer to our Creator and helps us realize our spiritual potential. May Allah grant us consistency in His remembrance and allow our hearts to find peace in His dhikr.</p>
    `,
    image: 'https://images.unsplash.com/photo-1610728488568-88c9f634d4d9?w=1200&h=600&fit=crop',
    category: 'Spirituality',
    tags: ['Dhikr', 'Spiritual Growth', 'Islamic Practice', 'Mindfulness'],
    author: {
      name: 'Sheikh Abdullah Ahmad',
      bio: 'Islamic scholar and spiritual guide with over 20 years of teaching experience',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    date: '2024-03-15',
    readTime: '8 min read',
    views: '2.4k',
  };

  const relatedArticles = [
    {
      id: 2,
      slug: 'understanding-tazkiyah',
      title: 'Understanding Tazkiyah: Purification of the Soul',
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=300&fit=crop',
      category: 'Self-Development',
      readTime: '12 min read',
    },
    {
      id: 3,
      slug: 'path-of-sufism',
      title: 'The Path of Sufism: Inner Dimensions',
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=300&fit=crop',
      category: 'Spirituality',
      readTime: '10 min read',
    },
    {
      id: 4,
      slug: 'quran-recitation-benefits',
      title: 'Spiritual Benefits of Quran Recitation',
      image: 'https://images.unsplash.com/photo-1585506019033-e6e14d8b0c70?w=400&h=300&fit=crop',
      category: 'Quran',
      readTime: '7 min read',
    },
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden"
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <motion.a
          href="/articles"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all text-sm sm:text-base"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Back to Articles</span>
          <span className="sm:hidden">Back</span>
        </motion.a>

        {/* Category Badge */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1 bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-full">
          {article.category}
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
                    <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{article.readTime}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{article.views} views</span>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{article.author.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{article.author.bio}</p>
                  </div>
                </div>

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
                    onClick={() => setIsBookmarked(!isBookmarked)}
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
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden xs:inline">24</span>
                  </motion.button>
                </div>
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-emerald-600 prose-strong:text-gray-900 prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <span className="text-sm sm:text-base font-semibold text-gray-900">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <a
                      key={index}
                      href={`/articles?tag=${tag}`}
                      className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs sm:text-sm rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-gray-200"
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Comments (24)</h3>
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
                <a href="#introduction" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Introduction
                </a>
                <a href="#spiritual-benefits" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  The Spiritual Benefits of Dhikr
                </a>
                <a href="#practical" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Practical Implementation
                </a>
                <a href="#challenges" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Overcoming Challenges
                </a>
                <a href="#transformative" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  The Transformative Power
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
                  className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all text-xs sm:text-sm font-medium"
                >
                  Facebook
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all text-xs sm:text-sm font-medium"
                >
                  Twitter
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all text-xs sm:text-sm font-medium"
                >
                  WhatsApp
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all text-xs sm:text-sm font-medium"
                >
                  Copy Link
                </motion.button>
              </div>
            </motion.div>
          </aside>
        </div>

        {/* Related Articles */}
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
                    src={related.image}
                    alt={related.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm text-xs sm:text-sm font-semibold text-gray-700 rounded-full">
                    {related.category}
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{related.readTime}</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ArticleDetailPage;