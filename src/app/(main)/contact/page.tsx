'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Clock, Send,
  MessageCircle, Headphones, Globe,
  Facebook, Twitter, Instagram, Youtube,
  ChevronDown, CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const departments = [
  {
    icon: Headphones,
    title: 'General Inquiries',
    email: 'info@khanqahsaifia.com',
    description: 'For general questions and information',
  },
  {
    icon: MessageCircle,
    title: 'Student Support',
    email: 'support@khanqahsaifia.com',
    description: 'Help with courses and learning',
  },
  {
    icon: Globe,
    title: 'Admissions',
    email: 'admissions@khanqahsaifia.com',
    description: 'Course enrollment and registration',
  },
];

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+92 300 000 0000',
    href: 'tel:+923000000000',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@khanqahsaifia.com',
    href: 'mailto:info@khanqahsaifia.com',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Faisalabad, Punjab, Pakistan',
    href: '#map',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon – Sat, 9am – 6pm',
    href: null,
  },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
];

const faqs = [
  {
    question: 'How do I enroll in a course?',
    answer:
      'Browse our courses page, select your desired course, and click "Enroll Now". Follow the registration process to get started on your spiritual journey.',
  },
  {
    question: 'Are the courses self-paced?',
    answer:
      'Yes, most of our courses are self-paced, allowing you to learn at your own convenience. Some courses also offer live sessions with our scholars.',
  },
  {
    question: 'Do you offer certificates?',
    answer:
      'Yes, upon successful completion of a course, you will receive a certificate of completion from Khanqah Saifia.',
  },
  {
    question: 'Can I access courses on mobile?',
    answer:
      'Absolutely! Our platform is fully responsive and optimised for mobile devices, so you can learn anywhere.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const GoldRule = ({ className = '' }: { className?: string }) => (
  <div className={`h-px bg-[hsl(45,70%,45%)] ${className}`} />
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="label-caps text-[hsl(45,70%,45%)] mb-3">{children}</p>
);

// Accordion FAQ item
const FaqItem = ({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-[hsl(100,5%,76%)]"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left focus:outline-none group"
      >
        <span className="font-serif text-[15px] sm:text-base text-[hsl(100,3%,10%)] group-hover:text-[hsl(156,31%,14%)] transition-colors leading-snug">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[hsl(45,70%,45%)]"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="body-md text-[hsl(100,5%,28%)] pb-5 leading-relaxed text-sm sm:text-base">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Input / Textarea shared styles ──────────────────────────────────────────
const inputCls =
  'w-full px-4 py-3.5 bg-[hsl(42,30%,96%)] border border-[hsl(100,5%,76%)] rounded-[4px] ' +
  'text-[14px] text-[hsl(100,3%,10%)] font-[Manrope,sans-serif] placeholder:text-[hsl(100,5%,56%)] ' +
  'focus:outline-none focus:border-[hsl(156,31%,14%)] focus:ring-2 focus:ring-[hsl(156,31%,14%)]/10 ' +
  'transition-all duration-200';

const labelCls = 'block text-[11px] font-bold tracking-[0.08em] uppercase text-[hsl(100,5%,28%)] mb-2';

// ─── Page ─────────────────────────────────────────────────────────────────────

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[hsl(42,30%,96%)]">

      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <section className="relative bg-[hsl(156,31%,14%)] overflow-hidden">
        {/* Decorative arcs */}
        <div className="absolute top-0 right-0 w-56 h-56 sm:w-80 sm:h-80 border-r border-t border-[hsl(45,70%,45%)]/15 rounded-tr-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l border-b border-[hsl(45,70%,45%)]/15 rounded-bl-full pointer-events-none" />

        <div className="container-sacred py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionLabel>تواصل معنا — Get In Touch</SectionLabel>
            <h1 className="font-serif text-[32px] sm:text-[44px] lg:text-[56px] font-normal leading-[1.15] text-[hsl(42,30%,96%)] mb-4 max-w-xl">
              We'd Love to Hear From You
            </h1>
            <GoldRule className="w-16 mb-5" />
            <p className="body-md text-[hsl(42,30%,96%)]/70 max-w-lg text-sm sm:text-base leading-relaxed">
              Reach out with questions about our teachings, events, or spiritual guidance.
              Our team responds within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT INFO STRIP — mobile-first pill row ─────────────────── */}
      <section className="bg-[hsl(156,31%,10%)] border-b border-[hsl(45,70%,45%)]/20">
        <div className="container-sacred py-0">
          <div className="flex overflow-x-auto scrollbar-hide gap-0 divide-x divide-[hsl(45,70%,45%)]/20">
            {contactInfo.map(({ icon: Icon, label, value, href }, i) => {
              const content = (
                <div
                  key={i}
                  className="flex-shrink-0 flex items-center gap-3 px-5 py-4 sm:py-5 group"
                >
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-[hsl(45,70%,45%)]/10 group-hover:bg-[hsl(45,70%,45%)]/20 transition-colors">
                    <Icon className="w-3.5 h-3.5 text-[hsl(45,70%,45%)]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.1em] uppercase text-[hsl(42,30%,96%)]/40 mb-0.5">{label}</p>
                    <p className="text-[12px] sm:text-[13px] text-[hsl(42,30%,96%)]/80 font-medium whitespace-nowrap">{value}</p>
                  </div>
                </div>
              );
              return href ? (
                <a href={href} key={i} className="hover:bg-white/5 transition-colors">
                  {content}
                </a>
              ) : (
                <div key={i}>{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <section className="container-sacred py-10 sm:py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 xl:gap-16">

          {/* ── LEFT: FORM ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white border border-[hsl(100,5%,76%)] rounded-[4px] overflow-hidden">

              {/* Card header */}
              <div className="px-6 sm:px-8 pt-7 pb-6 border-b border-[hsl(100,5%,88%)]">
                <SectionLabel>Message Us</SectionLabel>
                <h2 className="font-serif text-[22px] sm:text-[28px] font-normal text-[hsl(156,31%,14%)] leading-snug">
                  Send Us a Message
                </h2>
                <p className="text-[13px] text-[hsl(100,5%,28%)] mt-1.5">
                  We'll respond within 24 hours, in sha' Allah.
                </p>
              </div>

              {/* Form body */}
              <div className="px-6 sm:px-8 py-7">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12 text-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-[hsl(156,31%,14%)]/8 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-[hsl(156,31%,14%)]" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-[hsl(156,31%,14%)] mb-1">Message Received</h3>
                        <p className="text-sm text-[hsl(100,5%,28%)]">Jazak Allah Khayran. We'll be in touch shortly.</p>
                      </div>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="mt-2 text-[11px] font-bold tracking-[0.1em] uppercase text-[hsl(45,70%,40%)] hover:text-[hsl(45,70%,32%)] transition-colors"
                      >
                        Send Another →
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Row 1 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className={labelCls}>Full Name *</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Abdullah Khan"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className={labelCls}>Email Address *</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="phone" className={labelCls}>Phone Number</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+92 300 000 0000"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label htmlFor="subject" className={labelCls}>Subject *</label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className={inputCls + ' appearance-none cursor-pointer'}
                          >
                            <option value="">Select a topic…</option>
                            <option>General Inquiry</option>
                            <option>Course Enrollment</option>
                            <option>Student Support</option>
                            <option>Spiritual Guidance</option>
                            <option>Events & Gatherings</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className={labelCls}>Message *</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          placeholder="Tell us how we can help you…"
                          className={inputCls + ' resize-none'}
                        />
                      </div>

                      {/* Submit */}
                      <div className="flex items-center gap-4 pt-1">
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex-1 sm:flex-none sm:w-auto inline-flex items-center justify-center gap-2.5
                            bg-[hsl(156,31%,14%)] text-[hsl(42,30%,96%)]
                            text-[11px] font-bold tracking-[0.1em] uppercase
                            px-7 py-4 rounded-[3px]
                            hover:bg-[hsl(156,31%,10%)] transition-colors duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-[hsl(42,30%,96%)] border-t-transparent rounded-full animate-spin" />
                              Sending…
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              Send Message
                            </>
                          )}
                        </motion.button>
                        <p className="hidden sm:block text-[11px] text-[hsl(100,5%,56%)] leading-tight">
                          We reply within<br />24 hours
                        </p>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT SIDEBAR ────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Departments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-[hsl(100,5%,76%)] rounded-[4px] overflow-hidden"
            >
              <div className="px-6 pt-6 pb-4 border-b border-[hsl(100,5%,88%)]">
                <SectionLabel>Departments</SectionLabel>
                <h3 className="font-serif text-[18px] font-normal text-[hsl(156,31%,14%)]">
                  Reach the Right Team
                </h3>
              </div>
              <div className="divide-y divide-[hsl(100,5%,92%)]">
                {departments.map(({ icon: Icon, title, email, description }, i) => (
                  <a
                    key={i}
                    href={`mailto:${email}`}
                    className="flex items-start gap-4 px-6 py-4 hover:bg-[hsl(42,30%,96%)] transition-colors group"
                  >
                    <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-[hsl(156,31%,14%)]/8 group-hover:bg-[hsl(156,31%,14%)]/14 transition-colors mt-0.5">
                      <Icon className="w-4 h-4 text-[hsl(156,31%,14%)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[hsl(100,3%,10%)] mb-0.5">{title}</p>
                      <p className="text-[11px] text-[hsl(100,5%,42%)] mb-1 leading-snug">{description}</p>
                      <p className="text-[11px] text-[hsl(45,70%,38%)] font-medium truncate group-hover:text-[hsl(45,70%,30%)] transition-colors">
                        {email}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[hsl(156,31%,14%)] rounded-[4px] overflow-hidden"
            >
              {/* Gold top accent */}
              <div className="h-[3px] bg-[hsl(45,70%,45%)]" />
              <div className="px-6 py-5">
                <SectionLabel>Follow Us</SectionLabel>
                <p className="text-[13px] text-[hsl(42,30%,96%)]/65 mb-5 leading-relaxed">
                  Stay connected for daily reminders, live sessions and event announcements.
                </p>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, label, href }, i) => (
                    <motion.a
                      key={i}
                      href={href}
                      aria-label={label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.93 }}
                      className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-[hsl(45,70%,45%)]/25 border border-white/10 hover:border-[hsl(45,70%,45%)]/40 text-white/70 hover:text-[hsl(45,70%,65%)] transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              id="map"
              className="rounded-[4px] overflow-hidden border border-[hsl(100,5%,76%)]"
            >
              <div className="bg-white px-5 py-4 flex items-center gap-3 border-b border-[hsl(100,5%,88%)]">
                <MapPin className="w-4 h-4 text-[hsl(45,70%,45%)] flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-[hsl(100,5%,28%)]">Our Location</p>
                  <p className="text-[12px] text-[hsl(100,5%,42%)]">Faisalabad, Punjab, Pakistan</p>
                </div>
              </div>
              <div className="h-52 sm:h-60">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.176441073056!2d74.35874631512485!3d31.518519981366614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-[hsl(100,5%,88%)]">
        <div className="container-sacred py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <SectionLabel>Common Questions</SectionLabel>
              <h2 className="font-serif text-[26px] sm:text-[32px] font-normal text-[hsl(156,31%,14%)] leading-snug">
                Frequently Asked Questions
              </h2>
              <GoldRule className="w-12 mt-4" />
            </motion.div>

            <div>
              {faqs.map((faq, i) => (
                <FaqItem key={i} {...faq} index={i} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 pt-6 border-t border-[hsl(100,5%,88%)] flex items-center gap-4"
            >
              <p className="text-[13px] text-[hsl(100,5%,42%)]">Still have questions?</p>
              <a
                href="mailto:info@khanqahsaifia.com"
                className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] uppercase text-[hsl(45,70%,38%)] hover:text-[hsl(45,70%,28%)] transition-colors"
              >
                Email Us <Send className="w-3 h-3" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;