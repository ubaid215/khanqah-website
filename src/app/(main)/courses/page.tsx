'use client';

import { motion } from 'framer-motion';
import { Search, Filter, Clock, Users, Star, BookOpen, Award, TrendingUp, ChevronDown, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { CourseWithRelations, CourseLevel } from '@/types';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [sortBy, setSortBy] = useState('popular');
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const levels = ['All', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  const stats = [
    { label: 'Active Students', value: '15,000+', icon: Users },
    { label: 'Expert Instructors', value: '50+', icon: Award },
    { label: 'Course Completion', value: '95%', icon: TrendingUp },
    { label: 'Average Rating', value: '4.8/5', icon: Star },
  ];

  // Debug function to log API responses
  const debugApiResponse = (response: any) => {
    console.log('API Response:', response);
    console.log('Response success:', response.success);
    console.log('Response data:', response.data);
    if (response.data) {
      console.log('Data structure:', {
        hasData: !!response.data.data,
        dataType: typeof response.data.data,
        isArray: Array.isArray(response.data.data),
        arrayLength: Array.isArray(response.data.data) ? response.data.data.length : 'N/A'
      });
    }
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.getCategories();
        console.log('Categories response:', response);
        
        if (response.success && Array.isArray(response.data)) {
          const categoryNames = response.data.map((cat: Category) => cat.name);
          setCategories(['All', ...categoryNames]);
        } else {
          console.log('No categories from API, will extract from courses');
        }
      } catch (err) {
        console.error('Categories endpoint error:', err);
        // Categories will be extracted from courses data instead
      }
    };
    fetchCategories();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching courses with level:', selectedLevel);
        
        const filters: any = {
          page: 1,
          limit: 100,
        };

        // Add level filter if not "All"
        if (selectedLevel !== 'All') {
          filters.level = selectedLevel as CourseLevel;
        }

        const response = await apiClient.getPublicCourses(filters);
        debugApiResponse(response);
        
        if (response.success) {
          // Handle different possible response structures
          let coursesData: CourseWithRelations[] = [];
          
          if (Array.isArray(response.data)) {
            // Direct array response
            coursesData = response.data;
          } else if (response.data && Array.isArray(response.data.data)) {
            // Paginated response structure
            coursesData = response.data.data;
          } else if (response.data && Array.isArray(response.data.courses)) {
            // Alternative structure
            coursesData = response.data.courses;
          }
          
          console.log('Processed courses data:', coursesData);
          setCourses(coursesData);
          
          // Extract unique categories from courses if we don't have them
          if (categories.length === 1 && coursesData.length > 0) {
            const uniqueCategories = new Set<string>();
            coursesData.forEach((course: CourseWithRelations) => {
              if (course.categories && course.categories.length > 0) {
                course.categories.forEach((cat: any) => {
                  if (cat.category && cat.category.name) {
                    uniqueCategories.add(cat.category.name);
                  }
                });
              }
            });
            
            if (uniqueCategories.size > 0) {
              const newCategories = ['All', ...Array.from(uniqueCategories)];
              console.log('Extracted categories:', newCategories);
              setCategories(newCategories);
            }
          }
        } else {
          throw new Error(response.error || 'Failed to fetch courses');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
        
        // For development: set some mock data to test UI
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock data for development');
          const mockCourses: CourseWithRelations[] = [
            {
              id: '1',
              title: 'Introduction to Quranic Arabic',
              slug: 'introduction-to-quranic-arabic',
              description: 'Learn the basics of Quranic Arabic',
              shortDesc: 'Basic Arabic for Quran understanding',
              level: 'BEGINNER',
              duration: '8 weeks',
              price: 99,
              isFree: false,
              featured: true,
              rating: 4.8,
              thumbnail: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=500&fit=crop',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              categories: [
                {
                  category: {
                    id: '1',
                    name: 'Arabic',
                    slug: 'arabic'
                  }
                }
              ],
              _count: {
                enrollments: 150,
                reviews: 45,
                modules: 5
              }
            }
          ];
          setCourses(mockCourses);
          setCategories(['All', 'Arabic', 'Quran', 'Fiqh']);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedLevel, categories.length]);

  // Filter and sort courses
  const filteredCourses = courses.filter((course: CourseWithRelations) => {
    // Check category match
    const matchesCategory = selectedCategory === 'All' || 
      (course.categories && course.categories.some((cat: any) => 
        cat.category && cat.category.name === selectedCategory
      ));
    
    // Check search query
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.shortDesc && course.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a: CourseWithRelations, b: CourseWithRelations) => {
    switch (sortBy) {
      case 'popular':
        return (b._count?.enrollments || 0) - (a._count?.enrollments || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      default:
        return 0;
    }
  });

  const featuredCourses = sortedCourses.filter((c: CourseWithRelations) => c.featured).slice(0, 3);

  console.log('Current state:', {
    coursesCount: courses.length,
    filteredCount: filteredCourses.length,
    sortedCount: sortedCourses.length,
    selectedCategory,
    selectedLevel,
    categories
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section with Image */}
      <section className="relative h-[400px] sm:h-[500px] overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1920&h=1080&fit=crop"
            alt="Islamic Learning"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-900/85 to-cyan-900/90" />
          {/* Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">
              Explore Our Islamic Courses
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/95 mb-6 sm:mb-8 max-w-3xl mx-auto drop-shadow-md">
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
                  className="w-full pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base bg-white/95 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-white shadow-2xl border border-white/20"
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
                  <option key={level} value={level}>{level === 'All' ? 'All' : level.charAt(0) + level.slice(1).toLowerCase()}</option>
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
                Showing <span className="font-semibold">{sortedCourses.length}</span> courses
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="text-red-600 mb-4">Error loading courses</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <svg
              className="w-32 h-32 mx-auto mb-6 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Courses Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Stay tuned! We're updating our course catalog with exciting new content.
            </p>
            {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}

        {/* Content */}
        {!loading && !error && sortedCourses.length > 0 && (
          <>
            {/* Featured Courses */}
            {selectedCategory === 'All' && featuredCourses.length > 0 && (
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
                {sortedCourses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

const CourseCard = ({ course, index, featured = false }: { course: CourseWithRelations; index: number; featured?: boolean }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=500&fit=crop';
  
  return (
    <motion.a
      href={`/courses/${course.slug}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
        <img
          src={course.thumbnail || defaultImage}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultImage;
          }}
        />
        {featured && (
          <div className="absolute top-3 left-3 px-2 sm:px-3 py-1 bg-amber-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center gap-1">
            <Award className="w-3 h-3" />
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3 px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] sm:text-xs font-semibold text-gray-700 rounded-full">
          {course.level ? course.level.charAt(0) + course.level.slice(1).toLowerCase() : 'Beginner'}
        </div>
        {course.categories && course.categories.length > 0 && (
          <div className="absolute bottom-3 left-3 px-2 sm:px-3 py-1 bg-emerald-600 text-white text-[10px] sm:text-xs font-semibold rounded-full">
            {course.categories[0].category.name}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">
          {course.shortDesc || course.description}
        </p>

        <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-900">{course.rating || '4.8'}</span>
            <span>({course._count?.reviews || 0})</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{(course._count?.enrollments || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{course.duration || 'Self-paced'}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{course._count?.modules || 0} modules</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {course.isFree ? (
              <div className="text-xl sm:text-2xl font-bold text-emerald-600">Free</div>
            ) : (
              <>
                <div className="text-xl sm:text-2xl font-bold text-emerald-600">
                  ${course.price || 0}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500">per course</div>
              </>
            )}
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
};

export default CoursesPage;