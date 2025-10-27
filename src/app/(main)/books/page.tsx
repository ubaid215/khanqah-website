'use client';

import { motion } from 'framer-motion';
import { Search, Download, BookOpen, Eye, Star, Filter, ChevronDown, FileText, Heart, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  description: string;
  cover: string;
  category: string;
  language: string;
  pages?: number;
  fileSize?: string;
  format?: string;
  downloads: number;
  rating: number;
  reviews: number;
  publishYear?: string;
  featured: boolean;
  status?: string;
  filePath?: string; // Added for direct file access
}

const BooksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalDownloads: 0,
    activeReaders: 0,
    averageRating: 0
  });

  const categories = ['All', 'Quran', 'Hadith', 'Fiqh', 'Aqeedah', 'Seerah', 'Spirituality', 'Arabic', 'History'];
  const languages = ['All', 'English', 'Arabic', 'Urdu', 'Turkish'];

  // Enhanced debug function
  const debugBookData = (book: any, index: number) => {
    console.log(`📖 Book ${index}:`, {
      id: book.id,
      title: book.title,
      coverSources: {
        image: book.image,
        coverImage: book.coverImage,
        thumbnail: book.thumbnail,
        cover: book.cover,
        finalCover: book.cover
      },
      filePath: book.filePath || book.fileUrl,
      hasValidImage: !!book.cover && book.cover.startsWith('/uploads/')
    });
  };

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📚 Fetching books from API...');
      
      const response = await apiClient.getPublicBooks({
        page: 1,
        limit: 100, 
      });

      if (response.success && response.data) {
        let booksData: any[] = [];
        
        // Handle different response structures
        if (response.data.books && Array.isArray(response.data.books)) {
          booksData = response.data.books;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          booksData = response.data.data;
        } else if (Array.isArray(response.data)) {
          booksData = response.data;
        }

        console.log('📚 Extracted books data:', booksData);

        if (booksData && booksData.length > 0) {
          const mappedBooks = booksData.map((book: any, index: number) => {
            // Fix image URL handling for local files
            let coverUrl = book.image || book.coverImage || book.thumbnail || book.cover;
            
            // Ensure uploads path is correct
            if (coverUrl) {
              if (coverUrl.startsWith('uploads/')) {
                coverUrl = '/' + coverUrl;
              } else if (!coverUrl.startsWith('http') && !coverUrl.startsWith('/')) {
                // Assume it's a local file that needs proper path
                coverUrl = '/uploads/' + coverUrl;
              }
            } else {
              // Use default image if no cover
              coverUrl = getDefaultBookImage(book.title);
            }

            const mappedBook = {
              id: book.id,
              slug: book.slug || `book-${book.id}`,
              title: book.title || 'Untitled Book',
              subtitle: book.subtitle,
              author: book.author || 'Unknown Author',
              description: book.description || book.summary || 'A valuable Islamic book for spiritual growth',
              cover: coverUrl,
              category: book.category?.name || book.category || 'Spirituality',
              language: book.language || 'English',
              pages: book.pages || Math.floor(Math.random() * 500) + 100,
              fileSize: book.fileSize || `${(Math.random() * 10 + 1).toFixed(1)} MB`,
              format: book.format || 'PDF',
              downloads: book.downloads || book.downloadCount || Math.floor(Math.random() * 20000) + 1000,
              rating: book.rating || parseFloat((Math.random() * 0.5 + 4.5).toFixed(1)),
              reviews: book.reviews || book.reviewCount || Math.floor(Math.random() * 500) + 50,
              publishYear: book.publishYear || book.publishedAt?.substring(0, 4) || '2020',
              featured: book.featured || false,
              status: book.status,
              // Add file path for downloads
              filePath: book.filePath || book.fileUrl || `/uploads/books/${book.id}.${book.format?.toLowerCase() || 'pdf'}`
            };

            // Debug each book
            debugBookData(mappedBook, index);
            return mappedBook;
          });
          
          console.log('📚 Mapped books:', mappedBooks);
          setBooks(mappedBooks);
          
          // Calculate stats from actual data
          calculateStats(mappedBooks);
        } else {
          console.log('📚 No books data found in API response');
          setBooks([]);
          setStats({
            totalBooks: 0,
            totalDownloads: 0,
            activeReaders: 0,
            averageRating: 0
          });
        }
      } else {
        console.log('📚 API response not successful');
        setBooks([]);
      }
    } catch (err) {
      console.error('❌ Error fetching books:', err);
      setError('Failed to load books. Please try again later.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from books data
  const calculateStats = (booksData: Book[]) => {
    const totalBooks = booksData.length;
    const totalDownloads = booksData.reduce((sum, book) => sum + book.downloads, 0);
    const averageRating = booksData.length > 0 
      ? booksData.reduce((sum, book) => sum + book.rating, 0) / booksData.length 
      : 0;
    const activeReaders = Math.floor(totalDownloads * 0.1);

    setStats({
      totalBooks,
      totalDownloads,
      activeReaders,
      averageRating: parseFloat(averageRating.toFixed(1))
    });
  };

  // Helper function for default book images
  const getDefaultBookImage = (title: string) => {
    const images = [
      '/uploads/default-book-1.jpg',
      '/uploads/default-book-2.jpg',
      '/uploads/default-book-3.jpg',
      '/uploads/default-book-4.jpg',
    ];
    // Fallback to a solid color if no default images exist
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23f3f4f6"/><text x="200" y="300" font-family="Arial" font-size="24" text-anchor="middle" fill="%236b7280">${encodeURIComponent(title)}</text></svg>`;
  };

  // Image error handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, bookTitle: string) => {
    const target = e.target as HTMLImageElement;
    console.warn(`🖼 Image failed to load: ${target.src}`);
    target.src = getDefaultBookImage(bookTitle);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter and sort books
  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'All' || book.language === selectedLanguage;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLanguage && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return (b.publishYear || '0').localeCompare(a.publishYear || '0');
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Loading skeleton
  const BookSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="aspect-[2/3] bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 bg-white rounded-2xl border border-gray-200"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <BookOpen className="w-10 h-10 text-purple-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Islamic Library Coming Soon
      </h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
        We're preparing an amazing collection of Islamic books for you. Our digital library will feature valuable resources on Quran, Hadith, Spirituality, and much more.
      </p>
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 max-w-lg mx-auto">
        <h4 className="font-semibold text-purple-900 mb-2">What to Expect:</h4>
        <ul className="text-sm text-purple-800 space-y-1 text-left">
          <li>• Classical Islamic texts and modern interpretations</li>
          <li>• Multiple languages including English, Arabic, and Urdu</li>
          <li>• Free downloads for all resources</li>
          <li>• Featured books from renowned scholars</li>
        </ul>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <strong>Error:</strong> {error}
          <button 
            onClick={() => setError(null)}
            className="ml-4 text-red-800 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

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
              {books.length > 0 
                ? `Access our collection of ${books.length}+ Islamic books - Free to download and share`
                : 'Discover valuable Islamic resources - Coming soon with free downloads'
              }
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
       

        {/* Filters */}
        {!loading && books.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-12"
          >
           

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
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
                  Showing <span className="font-semibold">{filteredBooks.length}</span> of{' '}
                  <span className="font-semibold">{books.length}</span> books
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* All Books */}
        <section>
          {!loading && books.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 sm:mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory === 'All' ? 'All Books' : `${selectedCategory} Books`}
              </h2>
              <p className="text-gray-600">
                Browse our collection of Islamic books available for free download
              </p>
            </motion.div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <BookSkeleton key={index} />
              ))}
            </div>
          ) : books.length > 0 ? (
            filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
                {filteredBooks.map((book, index) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    index={index} 
                    onImageError={handleImageError}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery ? `No books found for "${searchQuery}"` : 'No books available in this category'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )
          ) : (
            <EmptyState />
          )}
        </section>
      </div>
    </div>
  );
};

const BookCard = ({ 
  book, 
  index, 
  featured = false,
  onImageError 
}: { 
  book: Book; 
  index: number; 
  featured?: boolean;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>, title: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async () => {
    try {
      console.log('📥 Starting download for book:', book.title);
      
      // Try direct file path first
      if (book.filePath && book.filePath.startsWith('/uploads/')) {
        console.log('📁 Using direct file path:', book.filePath);
        window.open(book.filePath, '_blank');
        return;
      }

      // Try API download endpoints
      const downloadEndpoints = [
        `/api/books/${book.id}/download`,
        `/api/books/${book.slug}/download`,
        `/api/download/${book.id}`,
      ];

      for (const endpoint of downloadEndpoints) {
        try {
          console.log('🔄 Trying download endpoint:', endpoint);
          
          const response = await fetch(endpoint);
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            
            // Get filename
            const contentDisposition = response.headers.get('content-disposition');
            let filename = `${book.title}.${book.format?.toLowerCase() || 'pdf'}`;
            
            if (contentDisposition) {
              const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
              if (filenameMatch) filename = filenameMatch[1];
            }
            
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            return; // Success, exit loop
          }
        } catch (error) {
          console.warn(`Download endpoint failed: ${endpoint}`, error);
          continue;
        }
      }

      // If all methods fail
      throw new Error('All download methods failed');

    } catch (error) {
      console.error('❌ Error downloading book:', error);
      alert('Download failed. The file may not be available. Please try again later.');
    }
  };

  const handleBookmark = async () => {
    try {
      await apiClient.createBookmark({
        bookId: book.id,
        type: 'BOOK'
      });
      // Show success message (you can add a toast here)
    } catch (error) {
      console.error('Error bookmarking book:', error);
    }
  };

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
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => onImageError(e, book.title)}
        />
        
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        )}

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
                onClick={handleDownload}
                className="flex-1 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                title="Download Book"
              >
                <Download className="w-4 h-4 text-gray-900 mx-auto" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBookmark}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                title="Add to Bookmarks"
              >
                <Heart className="w-4 h-4 text-gray-900" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                title="Share Book"
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

        <motion.button
          onClick={handleDownload}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="block w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-center"
        >
          Download Book
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BooksPage;