import { X } from 'lucide-react'

interface Props {
  onClose: () => void
}

export default function QurbaniTermsModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-up overflow-hidden">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="bg-[#111f12] px-5 py-4 flex items-start justify-between gap-3 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">📜</span>
              <h2 className="text-white font-bold text-base">Power of Attorney — Qurbani</h2>
            </div>
            <p className="urdu text-[#8abf8c] text-base" style={{ fontFamily: '"Amiri", serif', direction: 'rtl', lineHeight: '2' }}>
              وکالت نامہ — قربانی
            </p>
            <p className="text-[#5a8c5c] text-xs mt-1">
              Khanqah Saifia Murshidabad Shareef — Jhang Road, Faisalabad
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5a8c5c] hover:text-white hover:bg-[#2c5f2e] rounded-lg transition-colors flex-shrink-0 mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable Body ───────────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6 text-sm">

          {/* Bismillah */}
          <div className="text-center py-3 border-b border-stone-100">
            <p
              className="urdu text-[#2c5f2e] text-2xl font-bold"
              style={{ fontFamily: '"Amiri", serif', direction: 'rtl', lineHeight: '2' }}
            >
              بِسْمِ اللّٰہِ الرَّحْمٰنِ الرَّحِیْم
            </p>
            <p className="text-xs text-stone-400 mt-1 italic">
              In the Name of Allah, the Most Gracious, the Most Merciful
            </p>
          </div>

          {/* 1 — Appointment of Wakeel */}
          <TermsSection number="1" en="Appointment of Wakeel (Agent)" ur="وکیل کا تقرر">
            <TermsBilingual
              en="I hereby appoint Shakeel Ahmad, son of Muhammad Abdul Ghafur, as my fully authorised representative (Wakeel) in Pakistan to carry out all matters related to my Qurbani on my behalf. This includes managing all necessary arrangements and associated expenses — such as slaughterhouse services, butcher fees, and the secure transportation of meat to eligible recipients — in accordance with Islamic principles."
              ur="میں شکیل احمد ولد محمد عبدالغفور کو بیرون ملک یعنی پاکستان میں اپنی قربانی اور قربانی سے متعلق کسی بھی طرح کا خرچ (مثلاً سلاٹر ہاؤس، قصاب اور مسلمانوں تک قربانی کا گوشت بحفاظت پہنچانے کے اخراجات) کرنے کے لیے اپنا وکیلِ مطلق یعنی با اختیار نائب مقرر کرتا ہوں۔"
            />
          </TermsSection>

          {/* 2 — Meat & By-products Distribution */}
          <TermsSection number="2" en="Distribution of Meat & By-products" ur="گوشت اور ذیلی اجزاء کی تقسیم">
            <TermsBilingual
              en="My representative is authorised to manage all parts of the sacrificial animal — including the meat and fat that are traditionally consumed. They may distribute my share of the meat to any deserving individuals or fellow believers as they see fit. Parts not typically consumed (certain fats, bones) shall be disposed of respectfully. Proceeds from the sale of by-products (such as skin) and any surplus funds shall be handed over to the Khanqah."
              ur="میرا وکیل قربانی کے جانور کے گوشت، چربی وغیرہ — جو کھانے کے قابل ہو — میرے حصے کے مطابق مسلمانوں میں جسے چاہے جیسے چاہے تقسیم کر سکتا ہے۔ جو چربی یا ہڈی نہ کھائی جاتی نہ پکائی جاتی، اگر بیچنے کی ضرورت پڑے تو بیچ سکتا ہے۔ کھال اور بچی ہوئی رقم خانقاہ عالیہ کو دے دی جائے۔"
            />
          </TermsSection>

          {/* 3 — Delegation & Amanah */}
          <TermsSection number="3" en="Delegation & Payment as Amanah (Trust)" ur="تفویضِ اختیار اور امانت">
            <TermsBilingual
              en="The Wakeel is authorised to delegate responsibilities to another trusted person if required. The funds entrusted are held as Amanah (trust). If any loss or damage occurs without negligence or misuse, the Wakeel will not be held liable and no compensation will be sought."
              ur="وکیل کو اختیار ہے کہ تمام کام خود سر انجام دے یا کسی اور با اختیار شخص کو سونپ دے۔ آپ کے ہاتھ میں دی گئی رقم امانت ہے۔ اگر بلا کسی غلط استعمال کے رقم یا جانور ضائع ہو جائے تو اس کا تاوان وکیل کے ذمہ نہ ہوگا اور کوئی مطالبہ نہیں کیا جائے گا۔"
            />
          </TermsSection>

          {/* 4 — Unforeseen Circumstances */}
          <TermsSection number="4" en="Unforeseen Circumstances" ur="غیر متوقع حالات">
            <TermsBilingual
              en="If the animal intended for your share becomes unfit for sacrifice due to illness, injury, or death — or cannot be acquired due to unforeseen circumstances such as loss of funds — you will be informed immediately. Any further arrangements will only be made with your prior consent."
              ur="اگر میرے حصے والی قربانی کا جانور کسی حادثے یا مرض کے سبب قربانی کے قابل نہ رہا، یا کسی وجہ سے مر گیا، یا رقم چھن جانے کی صورت میں جانور خریدا نہ جا سکا، تو مجھے فوری اطلاع دی جائے اور آئندہ کے معاملات میری اجازت سے طے کیے جائیں۔"
            />
          </TermsSection>

          {/* 5 — Death of Stakeholder */}
          <TermsSection number="5" en="Death of a Stakeholder Before Sacrifice" ur="قربانی سے قبل حصہ دار کا انتقال">
            <TermsBilingual
              en="If any stakeholder passes away before the sacrifice is performed, this must be promptly reported to the Khanqah so that the matter can be addressed appropriately with guidance from the Fatwa Council (Dar al-Ifta)."
              ur="اگر کسی حصہ دار کا قربانی سے قبل خدانخواستہ انتقال ہو جائے تو اس کی اطلاع خانقاہ عالیہ کو ضرور دی جائے، تاکہ آگے کے معاملات دار الافتاء سے رہنمائی لے کر طے کیے جا سکیں۔"
            />
          </TermsSection>

          {/* 6 — Shari'ah Compliance */}
          <TermsSection number="6" en="Shari'ah Compliance & Oversight" ur="شرعی تقاضے اور نگرانی">
            <TermsBilingual
              en="The slaughter of all sacrificial animals will be conducted strictly in accordance with Shari'ah requirements, under the supervision of the Shari'ah Council. For any questions or clarifications regarding this Power of Attorney, please reach out via WhatsApp — a response will be provided after consultation with the relevant authorities."
              ur="قربانی کے جانوروں کے ذبح کی خدمات شرعی تقاضوں کے مطابق مجلس کی نگرانی میں ہوں گی۔ وکالت نامے کے حوالے سے اگر کوئی وضاحت درکار ہو تو لکھ کر واٹس ایپ کر دیں۔ مجلس شرعی رہنمائی لینے کے بعد آپ کو جواب دے گی۔"
            />
          </TermsSection>

          {/* Hadith / Closing quote */}
          <div className="bg-[#f0f9f0] border border-[#c8e6c9] rounded-xl p-4 text-center">
            <p
              className="urdu text-[#2c5f2e] text-lg"
              style={{ fontFamily: '"Amiri", serif', direction: 'rtl', lineHeight: '2.2' }}
            >
              مَنْ ضَحَّى طَيِّبَةً نَفْسُهُ مُحْتَسِبًا لِأُضْحِيَّتِهِ كَانَتْ لَهُ حِجَابًا مِنَ النَّارِ
            </p>
            <p className="text-xs text-stone-500 mt-2 italic">
              "Whoever offers a sacrifice with a willing heart, seeking its reward, it will be a shield for him from the Fire."
              <br />— (Related in Islamic tradition)
            </p>
          </div>

        </div>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-stone-200 px-5 py-4 bg-stone-50">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#2c5f2e] text-white font-semibold text-sm
              hover:bg-[#245828] transition-colors shadow-[0_4px_12px_rgba(44,95,46,0.25)]
              flex items-center justify-center gap-2"
          >
            I Understand — Close
            <span className="urdu text-sm" style={{ fontFamily: '"Amiri", serif' }}>سمجھ گیا</span>
          </button>
        </div>

      </div>
    </div>
  )
}

// ── Private sub-components ────────────────────────────────────────────────────

function TermsSection({
  number, en, ur, children,
}: {
  number: string
  en: string
  ur: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2.5">
        <div className="w-5 h-5 rounded-full bg-[#2c5f2e] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
          {number}
        </div>
        <div>
          <p className="font-semibold text-stone-800 text-sm">{en}</p>
          <p
            className="urdu text-[#2c5f2e] text-sm font-medium"
            style={{ fontFamily: '"Amiri", serif', direction: 'rtl', lineHeight: '2' }}
          >
            {ur}
          </p>
        </div>
      </div>
      <div className="ml-7">{children}</div>
    </div>
  )
}

function TermsBilingual({ en, ur }: { en: string; ur: string }) {
  return (
    <div className="space-y-2">
      <p className="text-stone-600 text-xs leading-relaxed">{en}</p>
      <p
        className="urdu text-stone-500 text-sm text-right"
        style={{ fontFamily: '"Amiri", serif', direction: 'rtl', lineHeight: '2.2' }}
      >
        {ur}
      </p>
    </div>
  )
}