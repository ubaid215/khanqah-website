'use client';

import { motion } from 'framer-motion';
import { 
  ChevronLeft, Clock, Users, Star, BookOpen, Award, CheckCircle, Play, 
  Download, Globe, Smartphone, Lock, Unlock, ChevronDown, ChevronRight,
  AlertCircle, Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { CourseWithRelations } from '@/types';

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState(0);
  const [course, setCourse] = useState<CourseWithRelations | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<CourseWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const slug = params.slug as string;
        
        // Fetch course by slug
        const response = await apiClient.getCourseBySlug(slug);
        setCourse(response);

        // Check if user is authenticated
        const authenticated = apiClient.isAuthenticated();
        setIsAuthenticated(authenticated);

        // Check if user is enrolled (if authenticated)
        if (authenticated) {
          try {
            const enrollment = await apiClient.getUserEnrollment(response.id);
            setIsEnrolled(!!enrollment);
          } catch (err) {
            // Not enrolled or error checking
            setIsEnrolled(false);
          }
        }

        // Fetch related courses
        if (response.categories && response.categories.length > 0) {
          const relatedResponse = await apiClient.getPublicCourses({
            categorySlug: response.categories[0].category.slug,
            limit: 3,
          });
          
          // Filter out current course
          const filtered = (relatedResponse.data?.data || []).filter(c => c.id !== response.id);
          setRelatedCourses(filtered.slice(0, 3));
        }
      } catch (err: any) {
        console.error('Error fetching course:', err);
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchCourse();
    }
  }, [params.slug]);

  // Handle enrollment
  const handleEnroll = async () => {
  if (!isAuthenticated) {
    router.push('/auth/login?redirect=' + window.location.pathname);
    return;
  }

  if (!course) return;

  try {
    setEnrolling(true);
    await apiClient.enrollInCourse(course.id);
    setIsEnrolled(true);

    // ✅ Redirect enrolled users to dashboard courses
    router.push('/dashboard/courses');
  } catch (err: any) {
    console.error('Enrollment error:', err);
    alert(err.message || 'Failed to enroll in course');
  } finally {
    setEnrolling(false);
  }
};


  // Calculate total duration
  const calculateTotalDuration = () => {
    if (!course?.modules) return '0 hours';
    
    const totalMinutes = course.modules.reduce((acc, module) => {
      const moduleDuration = module.lessons.reduce((sum, lesson) => {
        return sum + (lesson.duration || 0);
      }, 0);
      return acc + moduleDuration;
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The course you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/courses')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const courseFeatures = [
    `${course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0} comprehensive video lessons`,
    'Lifetime access to course materials',
    'Certificate of completion',
    'Access on mobile and desktop',
    'Downloadable resources',
    'Community discussion forum',
    'Weekly live Q&A sessions',
    '30-day money-back guarantee',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.a
            href="/courses"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm sm:text-base mb-4 sm:mb-6 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Back to Courses
          </motion.a>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                  {course.categories && course.categories.map((cat) => (
                    <span key={cat.category.id} className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold rounded-full">
                      {cat.category.name}
                    </span>
                  ))}
                  <span className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold rounded-full">
                    {course.level}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                  {course.title}
                </h1>
                <p className="text-base sm:text-lg text-white/90 mb-4 sm:mb-6">
                  {course.shortDesc || course.description?.substring(0, 150) + '...'}
                </p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/90 text-xs sm:text-sm mb-4 sm:mb-6">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-300 text-amber-300" />
                    <span className="font-bold text-white">{course.avgRating?.toFixed(1) || '4.8'}</span>
                    <span>({course.reviewCount || 0} reviews)</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{course.studentCount || 0} students</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{calculateTotalDuration()}</span>
                  </div>
                </div>

                {course.instructor && (
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img
                      src={course.instructor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&size=100`}
                      alt={course.instructor.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/50"
                    />
                    <div>
                      <div className="text-xs sm:text-sm text-white/80">Instructor</div>
                      <div className="text-sm sm:text-base font-semibold text-white">{course.instructor.name}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Price Card - Desktop */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden sticky top-24"
              >
                <div className="relative h-48">
                  <img 
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&h=600&fit=crop'} 
                    alt={course.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-emerald-600 ml-1" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {course.isFree ? (
                    <div className="text-4xl font-bold text-emerald-600 mb-2">Free</div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold text-emerald-600 mb-2">
                        ${course.price?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-sm text-gray-500 mb-6">One-time payment</div>
                    </>
                  )}
                  
                  {isEnrolled ? (
                    <button
                      onClick={() => router.push(`/learn/${course.slug}`)}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg mb-3"
                    >
                      Continue Learning
                    </button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {enrolling ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        'Enroll Now'
                      )}
                    </motion.button>
                  )}
                  
                  <button className="w-full px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all">
                    Add to Wishlist
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-900 mb-4">This course includes:</div>
                    <div className="space-y-3">
                      {courseFeatures.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="flex overflow-x-auto border-b border-gray-200 scrollbar-hide">
                {['overview', 'curriculum', 'instructor'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'text-emerald-600 border-b-2 border-emerald-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Course Description</h2>
                    <div 
                      className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: course.description || '' }}
                    />

                    {course.objectives && course.objectives.length > 0 && (
                      <>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">What You'll Learn</h3>
                        <div className="space-y-3 mb-6">
                          {course.objectives.map((objective, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm sm:text-base text-gray-700">{objective}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {course.requirements && course.requirements.length > 0 && (
                      <>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                        <ul className="space-y-2">
                          {course.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-gray-700">
                              <span className="text-emerald-600 mt-1">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Curriculum Tab */}
                {activeTab === 'curriculum' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Course Curriculum</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                      {course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0} lessons • {calculateTotalDuration()} total
                    </p>

                    <div className="space-y-4">
                      {course.modules?.map((module, index) => (
                        <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setExpandedModule(expandedModule === index ? -1 : index)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1 text-left">
                              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{module.title}</h4>
                              <div className="text-xs sm:text-sm text-gray-500">
                                {module.lessons.length} lessons • {Math.floor(module.lessons.reduce((acc, l) => acc + (l.duration || 0), 0) / 60)}h {module.lessons.reduce((acc, l) => acc + (l.duration || 0), 0) % 60}m
                              </div>
                            </div>
                            <ChevronDown
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                expandedModule === index ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {expandedModule === index && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="border-t border-gray-200"
                            >
                              <div className="p-4 space-y-2">
                                {module.lessons.map((lesson) => (
                                  <div
                                    key={lesson.id}
                                    className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      {lesson.isFree || isEnrolled ? (
                                        <Play className="w-4 h-4 text-emerald-600" />
                                      ) : (
                                        <Lock className="w-4 h-4 text-gray-400" />
                                      )}
                                      <span className="text-sm text-gray-700">{lesson.title}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {lesson.duration ? `${Math.floor(lesson.duration / 60)}:${String(lesson.duration % 60).padStart(2, '0')}` : '-'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Instructor Tab */}
                {activeTab === 'instructor' && course.instructor && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                      <img
                        src={course.instructor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&size=128`}
                        alt={course.instructor.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mx-auto sm:mx-0"
                      />
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{course.instructor.name}</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">{course.instructor.email}</p>
                        
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Instructor</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {course.instructor.bio && (
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{course.instructor.bio}</p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Mobile Price Card */}
          <div className="lg:hidden">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                {course.isFree ? (
                  <div className="text-3xl font-bold text-emerald-600">Free</div>
                ) : (
                  <div className="text-3xl font-bold text-emerald-600">${course.price?.toFixed(2) || '0.00'}</div>
                )}
                <button className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-white ml-0.5" />
                </button>
              </div>
              
              {isEnrolled ? (
                <button
                  onClick={() => router.push(`/learn/${course.slug}`)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg mb-3 text-sm sm:text-base"
                >
                  Continue Learning
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg mb-3 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {enrolling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    'Enroll Now'
                  )}
                </motion.button>
              )}
              
              <button className="w-full px-6 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm sm:text-base">
                Add to Wishlist
              </button>
            </div>
          </div>

          {/* Sidebar - Features */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Course Features</h3>
              <div className="space-y-3">
                {courseFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <section className="mt-12 sm:mt-16 lg:mt-20">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Related Courses</h2>
              <a href="/courses" className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedCourses.map((related, index) => (
                <motion.a
                  key={related.id}
                  href={`/courses/${related.slug}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img 
                      src={related.thumbnail || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop'} 
                      alt={related.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute top-3 right-3 px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm text-xs sm:text-sm font-semibold text-gray-700 rounded-full">
                      {related.level}
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{related.avgRating?.toFixed(1) || '4.5'}</span>
                        <span>({related.studentCount || 0})</span>
                      </div>
                      {related.isFree ? (
                        <div className="text-lg sm:text-xl font-bold text-emerald-600">Free</div>
                      ) : (
                        <div className="text-lg sm:text-xl font-bold text-emerald-600">${related.price?.toFixed(2) || '0.00'}</div>
                      )}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;