'use client';

import { motion } from 'framer-motion';
import { 
  ChevronLeft, Clock, Users, Star, BookOpen, Award, CheckCircle, Play, 
  Download, Globe, Smartphone, Lock, Unlock, ChevronDown, ChevronRight 
} from 'lucide-react';
import { useState } from 'react';

const CourseDetailPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState(0);

  const course = {
    id: 1,
    slug: 'quran-recitation-tajweed',
    title: 'Quran Recitation & Tajweed Mastery',
    subtitle: 'Master the art of Quranic recitation with proper pronunciation and beautiful tajweed rules',
    description: 'This comprehensive course is designed to help students of all levels master the art of Quranic recitation. You will learn the fundamental rules of tajweed, proper pronunciation of Arabic letters, and develop the ability to recite the Quran with beauty and accuracy.',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&h=600&fit=crop',
    category: 'Quran',
    level: 'Beginner',
    duration: '12 weeks',
    lessons: 48,
    students: 2458,
    rating: 4.9,
    reviews: 342,
    price: 99,
    instructor: {
      name: 'Qari Abdullah Rahman',
      title: 'Master of Quranic Recitation',
      bio: 'Qari Abdullah has been teaching Quran and Tajweed for over 15 years, with certifications from Al-Azhar University.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      courses: 8,
      students: 15240,
      rating: 4.9,
    },
    features: [
      '48 comprehensive video lessons',
      'Lifetime access to course materials',
      'Certificate of completion',
      'Access on mobile and desktop',
      'Downloadable resources',
      'Community discussion forum',
      'Weekly live Q&A sessions',
      '30-day money-back guarantee',
    ],
    objectives: [
      'Master all tajweed rules with confidence',
      'Recite the Quran with proper pronunciation',
      'Understand the articulation points of Arabic letters',
      'Apply beautification techniques in recitation',
      'Develop consistent daily recitation habits',
    ],
    curriculum: [
      {
        module: 'Module 1: Introduction to Tajweed',
        lessons: 8,
        duration: '2 hours',
        topics: [
          { title: 'What is Tajweed and Why is it Important?', duration: '15 min', type: 'video', locked: false },
          { title: 'Arabic Alphabet and Pronunciation', duration: '20 min', type: 'video', locked: false },
          { title: 'Makharij al-Huruf (Articulation Points)', duration: '25 min', type: 'video', locked: true },
          { title: 'Sifat al-Huruf (Characteristics of Letters)', duration: '20 min', type: 'video', locked: true },
          { title: 'Practice Exercises', duration: '15 min', type: 'practice', locked: true },
          { title: 'Module 1 Quiz', duration: '10 min', type: 'quiz', locked: true },
        ],
      },
      {
        module: 'Module 2: Rules of Noon Sakinah and Tanween',
        lessons: 10,
        duration: '2.5 hours',
        topics: [
          { title: 'Introduction to Noon Sakinah', duration: '18 min', type: 'video', locked: true },
          { title: 'Izhar (Clear Pronunciation)', duration: '22 min', type: 'video', locked: true },
          { title: 'Idgham (Merging)', duration: '25 min', type: 'video', locked: true },
          { title: 'Iqlab (Conversion)', duration: '20 min', type: 'video', locked: true },
          { title: 'Ikhfa (Concealment)', duration: '25 min', type: 'video', locked: true },
        ],
      },
      {
        module: 'Module 3: Rules of Meem Sakinah',
        lessons: 8,
        duration: '2 hours',
        topics: [
          { title: 'Introduction to Meem Sakinah', duration: '15 min', type: 'video', locked: true },
          { title: 'Idgham Shafawi', duration: '20 min', type: 'video', locked: true },
          { title: 'Ikhfa Shafawi', duration: '20 min', type: 'video', locked: true },
          { title: 'Izhar Shafawi', duration: '18 min', type: 'video', locked: true },
        ],
      },
      {
        module: 'Module 4: Qalqalah and Prolongation',
        lessons: 12,
        duration: '3 hours',
        topics: [
          { title: 'Understanding Qalqalah', duration: '25 min', type: 'video', locked: true },
          { title: 'Types of Madd (Prolongation)', duration: '30 min', type: 'video', locked: true },
          { title: 'Madd Tabee\'i', duration: '20 min', type: 'video', locked: true },
          { title: 'Madd Munfasil and Muttasil', duration: '25 min', type: 'video', locked: true },
        ],
      },
      {
        module: 'Module 5: Advanced Tajweed Rules',
        lessons: 10,
        duration: '2.5 hours',
        topics: [
          { title: 'Rules of Lam in Allah', duration: '20 min', type: 'video', locked: true },
          { title: 'Rules of Ra', duration: '25 min', type: 'video', locked: true },
          { title: 'Stopping and Starting', duration: '22 min', type: 'video', locked: true },
        ],
      },
    ],
    requirements: [
      'Basic understanding of Arabic alphabet (helpful but not required)',
      'Commitment to practice daily',
      'Access to a Quran (physical or digital)',
    ],
  };

  const relatedCourses = [
    {
      id: 2,
      slug: 'arabic-language-beginners',
      title: 'Arabic Language for Beginners',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
      level: 'Beginner',
      price: 89,
      rating: 4.7,
      students: 3124,
    },
    {
      id: 3,
      slug: 'quran-memorization',
      title: 'Quran Memorization Techniques',
      image: 'https://images.unsplash.com/photo-1585506019033-e6e14d8b0c70?w=400&h=300&fit=crop',
      level: 'Intermediate',
      price: 109,
      rating: 4.8,
      students: 1876,
    },
    {
      id: 4,
      slug: 'islamic-studies-foundation',
      title: 'Islamic Studies Foundation',
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=300&fit=crop',
      level: 'Beginner',
      price: 79,
      rating: 4.9,
      students: 2345,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Ahmed',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 5,
      text: 'This course transformed my Quran recitation. The instructor explains everything clearly and the practice materials are excellent!',
      course: 'Completed 2 months ago',
    },
    {
      name: 'Muhammad Ibrahim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 5,
      text: 'Outstanding course! I finally understand tajweed rules properly. Highly recommend for anyone wanting to improve their recitation.',
      course: 'Completed 1 month ago',
    },
    {
      name: 'Aisha Khan',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      rating: 5,
      text: 'The best investment I made in my spiritual journey. Qari Abdullah is an amazing teacher with so much patience.',
      course: 'Completed 3 weeks ago',
    },
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
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm sm:text-base mb-4 sm:mb-6"
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
                  <span className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold rounded-full">
                    {course.category}
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold rounded-full">
                    {course.level}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                  {course.title}
                </h1>
                <p className="text-base sm:text-lg text-white/90 mb-4 sm:mb-6">
                  {course.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/90 text-xs sm:text-sm mb-4 sm:mb-6">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-300 text-amber-300" />
                    <span className="font-bold text-white">{course.rating}</span>
                    <span>({course.reviews} reviews)</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/50"
                  />
                  <div>
                    <div className="text-xs sm:text-sm text-white/80">Instructor</div>
                    <div className="text-sm sm:text-base font-semibold text-white">{course.instructor.name}</div>
                  </div>
                </div>
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
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-emerald-600 ml-1" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">${course.price}</div>
                  <div className="text-sm text-gray-500 mb-6">One-time payment</div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg mb-3"
                  >
                    Enroll Now
                  </motion.button>
                  <button className="w-full px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all">
                    Add to Wishlist
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-900 mb-4">This course includes:</div>
                    <div className="space-y-3">
                      {course.features.slice(0, 4).map((feature, index) => (
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
                {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
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
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">{course.description}</p>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">What You'll Learn</h3>
                    <div className="space-y-3 mb-6">
                      {course.objectives.map((objective, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm sm:text-base text-gray-700">{objective}</span>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-gray-700">
                          <span className="text-emerald-600 mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
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
                      {course.lessons} lessons • {course.curriculum.reduce((acc, m) => acc + parseFloat(m.duration), 0)} hours total
                    </p>

                    <div className="space-y-4">
                      {course.curriculum.map((module, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setExpandedModule(expandedModule === index ? -1 : index)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1 text-left">
                              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{module.module}</h4>
                              <div className="text-xs sm:text-sm text-gray-500">
                                {module.lessons} lessons • {module.duration}
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
                                {module.topics.map((topic, topicIndex) => (
                                  <div
                                    key={topicIndex}
                                    className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      {topic.locked ? (
                                        <Lock className="w-4 h-4 text-gray-400" />
                                      ) : (
                                        <Play className="w-4 h-4 text-emerald-600" />
                                      )}
                                      <span className="text-sm text-gray-700">{topic.title}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{topic.duration}</span>
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
                {activeTab === 'instructor' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mx-auto sm:mx-0"
                      />
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{course.instructor.name}</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">{course.instructor.title}</p>
                        
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span>{course.instructor.rating} Instructor Rating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{course.instructor.students.toLocaleString()} Students</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{course.instructor.courses} Courses</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{course.instructor.bio}</p>
                  </motion.div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Student Reviews</h2>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-lg sm:text-xl font-bold">{course.rating}</span>
                          <span className="text-sm sm:text-base text-gray-600">({course.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {testimonials.map((testimonial, index) => (
                        <div key={index} className="pb-6 border-b border-gray-200 last:border-0">
                          <div className="flex items-start gap-4">
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                <div className="flex items-center gap-1">
                                  {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm sm:text-base text-gray-700 mb-2">{testimonial.text}</p>
                              <span className="text-xs sm:text-sm text-gray-500">{testimonial.course}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Mobile Price Card */}
          <div className="lg:hidden">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-emerald-600">${course.price}</div>
                <button className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-white ml-0.5" />
                </button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg mb-3 text-sm sm:text-base"
              >
                Enroll Now
              </motion.button>
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
                {course.features.map((feature, index) => (
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
                  <img src={related.image} alt={related.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
                      <span className="font-semibold">{related.rating}</span>
                      <span>({related.students})</span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-emerald-600">${related.price}</div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CourseDetailPage;