export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-emerald-100">
            Last updated: January 7, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-emerald-600 rounded"></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Introduction
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Assalamu Alaikum. We are committed to protecting your privacy and
              handling your personal information with the trust and
              responsibility that Islamic principles demand. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our services. We operate in accordance
              with both Shariah principles and applicable data protection laws.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-emerald-600 rounded"></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Information We Collect
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="pl-4 border-l-2 border-emerald-200">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-600">
                  When you register or use our services, we may collect your
                  name, email address, phone number, and postal address. For
                  donation processing, we collect payment information which is
                  securely processed through certified payment processors.
                </p>
              </div>

              <div className="pl-4 border-l-2 border-emerald-200">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Donation Information
                </h3>
                <p className="text-gray-600">
                  We collect and maintain records of your donations including
                  amount, date, category (Zakat, Sadaqah, Lillah), and purpose.
                  This information is used solely for receipt generation,
                  transparency reporting, and tax documentation where
                  applicable.
                </p>
              </div>

              <div className="pl-4 border-l-2 border-emerald-200">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Usage Information
                </h3>
                <p className="text-gray-600">
                  We automatically collect certain information about your device
                  and how you interact with our website, including IP address,
                  browser type, pages visited, and time spent on pages. This
                  helps us improve our services.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-emerald-600 rounded"></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                How We Use Your Information
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              We use the information we collect for the following purposes:
            </p>
            <div className="bg-emerald-50 rounded-lg p-6 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-emerald-600 mt-1">•</span>
                <p className="text-gray-700">
                  Processing and managing your donations with complete
                  transparency
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-600 mt-1">•</span>
                <p className="text-gray-700">
                  Sending donation receipts and acknowledgments via email or
                  WhatsApp
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-600 mt-1">•</span>
                <p className="text-gray-700">
                  Providing you with updates about our charitable activities and
                  impact reports
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-600 mt-1">•</span>
                <p className="text-gray-700">
                  Communicating with you about your account and responding to
                  your inquiries
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-600 mt-1">•</span>
                <p className="text-gray-700">
                  Improving our website functionality and user experience
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-600 mt-1">•</span>
                <p className="text-gray-700">
                  Complying with legal obligations and maintaining financial
                  records
                </p>
              </div>
            </div>
          </section>

          {/* Islamic Principles */}
          <section className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-emerald-600 rounded"></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Our Islamic Commitment
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              We handle your information in accordance with Islamic principles
              of Amanah (trust) and confidentiality. Your data is treated as an
              Amanah entrusted to us, and we are committed to safeguarding it
              with the highest level of integrity. We do not use your
              information for any purpose that contradicts Islamic values, and
              we ensure complete transparency in how your donations are
              utilized.
            </p>
            <p className="text-gray-700 leading-relaxed">
              In keeping with the principle that "Allah loves those who are
              trustworthy," we maintain strict confidentiality of donor
              information unless you explicitly consent to public recognition.
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-emerald-600 rounded"></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Information Sharing and Disclosure
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              We respect your privacy and do not sell or rent your personal
              information. We may share your information only in the following
              circumstances:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">→</span>
                <p className="text-gray-700">
                  <span className="font-semibold">Service Providers:</span> With
                  trusted third-party service providers who assist us in
                  operating our website, processing payments, or sending
                  communications, under strict confidentiality agreements.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">→</span>
                <p className="text-gray-700">
                  <span className="font-semibold">Legal Compliance:</span> When
                  required by law or to protect our rights and safety, or the
                  rights and safety of others.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">→</span>
                <p className="text-gray-700">
                  <span className="font-semibold">With Your Consent:</span> When
                  you explicitly authorize us to share your information for
                  specific purposes.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-emerald-600 rounded"></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Data Security
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. This includes
              encryption of sensitive data, secure servers, regular security
              audits, and strict access controls. However, no method of
              transmission over the internet is completely secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-emerald-600 rounded"></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Rights
              </h2>
            </div>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <div className="grid gap-3">
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-700">
                  Access and receive a copy of your personal information
                </p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-700">
                  Correct or update inaccurate information
                </p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-700">
                  Request deletion of your information (subject to legal
                  retention requirements)
                </p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-700">
                  Opt-out of marketing communications at any time
                </p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-700">
                  Request a copy of your donation history
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-emerald-600 rounded"></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Cookies and Tracking
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your
              browsing experience, analyze site traffic, and understand user
              preferences. You can control cookie settings through your browser
              preferences. Please note that disabling cookies may limit some
              functionality of our website.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-emerald-600 rounded"></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Children's Privacy
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Our services are not directed to individuals under the age of 13.
              We do not knowingly collect personal information from children. If
              you are a parent or guardian and believe your child has provided
              us with personal information, please contact us so we can delete
              such information.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-emerald-600 rounded"></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Changes to This Privacy Policy
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. We will notify you
              of any material changes by posting the new Privacy Policy on this
              page and updating the "Last updated" date. We encourage you to
              review this Privacy Policy periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-emerald-600 text-white rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4 text-emerald-50">
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-emerald-50">
              <p>Email: privacykhanqahsaifia.org</p>
              <p>Phone: +92 322 7677 422</p>
              <p>Address: Your Organization Address, City, Country</p>
            </div>
            <p className="mt-6 text-emerald-100 text-sm">
              We are committed to resolving any privacy concerns in a timely and
              transparent manner, in sha Allah.
            </p>
          </section>

          {/* Footer Note */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              By using our services, you acknowledge that you have read and
              understood this Privacy Policy.
            </p>
            <p className="text-emerald-600 font-arabic text-lg mt-4">
              جزاك الله خيرا
            </p>
            <p className="text-gray-600 text-sm">May Allah reward you with goodness</p>
          </div>
        </div>
      </div>
    </div>
  );
}