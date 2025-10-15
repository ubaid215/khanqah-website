"use client";

import { motion } from "framer-motion";
import {
  Heart,
  BookOpen,
  Users,
  Award,
  Target,
  Globe,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  Quote,
} from "lucide-react";

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: "Authentic Knowledge",
      description:
        "We are committed to providing knowledge based on Quran, Sunnah, and the understanding of righteous predecessors",
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: BookOpen,
      title: "Quality Education",
      description:
        "Our courses and resources are carefully curated by qualified scholars to ensure the highest educational standards",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Users,
      title: "Community Focus",
      description:
        "Building a supportive community where learners can grow together in faith and knowledge",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description:
        "Making Islamic education accessible to everyone, everywhere, removing barriers to learning",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const achievements = [
    { number: "50K+", label: "Active Students", icon: Users },
    { number: "200+", label: "Courses Completed", icon: BookOpen },
    { number: "30+", label: "Expert Instructors", icon: Award },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
  ];

  const team = [
    {
      name: "Sheikh Abdullah Ahmad",
      role: "Founder & Lead Instructor",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Graduated from Al-Azhar University with 20+ years of teaching experience",
    },
    {
      name: "Dr. Fatima Hassan",
      role: "Head of Curriculum",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "PhD in Islamic Studies, specializing in Hadith sciences and Fiqh",
    },
    {
      name: "Qari Ibrahim Malik",
      role: "Quran & Tajweed Expert",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      bio: "Certified Qari with Ijazah in multiple recitation styles",
    },
    {
      name: "Ustadha Aisha Rahman",
      role: "Women's Education Director",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bio: "Masters in Islamic Jurisprudence with focus on women's issues",
    },
  ];

  const milestones = [
    {
      year: "2018",
      title: "Foundation",
      description:
        "Khanqah Saifia was established with a vision to provide quality Islamic education online",
    },
    {
      year: "2019",
      title: "First 1000 Students",
      description:
        "Reached our first milestone of 1000 enrolled students across 20 countries",
    },
    {
      year: "2020",
      title: "Digital Library Launch",
      description:
        "Launched free digital library with 500+ Islamic books and resources",
    },
    {
      year: "2021",
      title: "Scholarship Program",
      description:
        "Introduced scholarship program making education accessible to underserved communities",
    },
    {
      year: "2022",
      title: "Mobile App Launch",
      description:
        "Released mobile apps for iOS and Android, reaching 10,000+ downloads",
    },
    {
      year: "2024",
      title: "Global Expansion",
      description:
        "Expanded to 50+ countries with 50,000+ active learners worldwide",
    },
  ];

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section with Image */}
      <section className="relative h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
        <img
          src="/images/astana.jpg"
          alt="Islamic Architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-900/80 to-cyan-900/70" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6">
                About Khanqah Saifia
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Guiding souls and enlightening minds through faith, knowledge, and spirituality
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=600&fit=crop"
                alt="Islamic Learning"
                className="rounded-2xl shadow-2xl w-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Our Story
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                <p>
                  <strong>Khanqah Saifia </strong> was established under the
                  blessed guidance of{" "}
                  <strong> Sarkar Wakeel Sahib Mubarik</strong> with a noble
                  vision — to spread the light of Tasawwuf (Sufism), authentic
                  Islamic knowledge, and spiritual refinement (Tarbiyat) across
                  the world. What began as a humble gathering of seekers has now
                  blossomed into a thriving spiritual and educational community,
                  dedicated to nurturing hearts and guiding souls toward Allah.
                </p>
                <p>
                  Rooted in the timeless traditions of the Sufi path, Khanqah
                  Saifia serves as a beacon for those who seek both ‘Ilm
                  (knowledge) and Irfan (spiritual understanding). Through our
                  structured programs in{" "}
                  <strong>
                    {" "}
                    Qur’anic Studies, Hadith, Fiqh, Arabic Language, and
                    Tasawwuf
                  </strong>
                  , we aim to combine the beauty of outward learning with the
                  depth of inner purification.
                </p>
                <p>
                  Under the mentorship of esteemed scholars and spiritual
                  guides, our students come from all walks of life — united by a
                  shared purpose: to live with sincerity, discipline, and love
                  for the Divine. <br />
                  Today, <b> Khanqah Saifia </b> welcomes learners from across
                  the globe, offering not just education, but transformation — a
                  journey from knowledge to action, and from the self to Allah.
                </p>
                <p>
                  At our Astana, remembrance (Zikr), spiritual companionship
                  (Suhbah), and moral refinement are at the heart of every
                  gathering. We believe that true success lies in the balance of
                  knowledge, devotion, and service — and it is this balance that
                  we strive to cultivate in every seeker who joins us.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Our Mission
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                To revive hearts through the light of authentic Islamic
                knowledge and the path of Sufism. At Khanqah Saifia, our mission
                is to provide balanced Islamic education that nurtures both the
                intellect and the soul — combining ‘Ilm (knowledge) with
                Tarbiyat (spiritual training). <br />
                We strive to create an environment where seekers can grow in
                faith, refine their character, and strengthen their connection
                with Allah through learning, remembrance (Zikr), and service to
                humanity.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  "Deliver authentic Islamic and spiritual education worldwide",
                  "Foster spiritual growth and character development",
                  "Build a supportive learning community",
                  "Make knowledge accessible and affordable",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Our Vision
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                To become a guiding light for seekers across the globe — a place
                where knowledge and spirituality unite to form hearts anchored
                in love for Allah and His Messenger ﷺ. <br />
                We envision Khanqah Saifia as a global center of Tarbiyat and
                Tasawwuf, preserving the noble traditions of our Sufi masters
                while embracing the tools of modern learning. Our goal is to
                inspire generations of Muslims who live with purpose, wisdom,
                and service — illuminating the world through faith and
                compassion.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  "Build a global network of spiritually awakened Muslims",
                  "Preserve and spread the teachings of the Qur’an, Sunnah, and Sufi heritage",
                  "Inspire positive change through education",
                  "Bridge traditional and modern learning methods",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Khanqah Saifia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Team */}
      {/* <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Dedicated scholars and educators committed to your spiritual
              growth
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative h-48 sm:h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Timeline */}
      {/* <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Key milestones in our story
            </p>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex gap-4 sm:gap-6"
              >
                <div className="flex-shrink-0 w-16 sm:w-20 text-right">
                  <div className="inline-block px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm font-bold rounded-full">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
              Join Our Learning Community
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Start your journey of knowledge and spiritual growth with Khanqah
              Saifia today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/courses"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-emerald-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
              >
                Browse Courses
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white hover:bg-white/20 transition-all text-sm sm:text-base"
              >
                Contact Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
