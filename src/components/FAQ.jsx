import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'What services does Maurisys offer?',
    a: 'Maurisys offers web and mobile app development, custom software solutions, and IT consulting services. We also provide UI/UX design, security services, and DevOps/cloud support.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'Project timelines vary based on scope and complexity. A basic website typically takes 2-4 weeks, while a full mobile app may take 8-12 weeks. We provide a detailed timeline during the initial consultation.',
  },
  {
    q: 'Do you provide post-launch support?',
    a: 'Yes. We offer ongoing maintenance and support packages to ensure your website, app, or campaigns continue to run smoothly after launch.',
  },
  {
    q: 'How can I get a quote for my project?',
    a: 'Simply reach out through our contact form or call us directly. We offer a free consultation to understand your needs and provide a detailed, customized quote.',
  },
  {
    q: 'What technologies do you work with?',
    a: 'Our team is proficient in modern technologies including React, Next.js, Node.js, Express, MongoDB, PostgreSQL, Flutter, React Native, AWS, and many more. We pick the best stack for your specific needs.',
  },
  {
    q: 'Do you work with international clients?',
    a: 'Absolutely. We work with clients across the globe and have experience adapting to different time zones, cultures, and business requirements.',
  },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-12 bg-white">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-14">
          <p className="section-eyebrow justify-center">FAQ</p>
          <h2 className="section-title">Have Questions? We Have Answers</h2>
          <p className="section-lede mx-auto text-center">
            Find answers to the most common questions about working with Maurisys.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-lg border transition-all overflow-hidden ${
                  isOpen ? 'border-primary-300 shadow-card' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors"
                >
                  <h3 className="font-semibold text-slate-900 pr-4 text-[15px]">{faq.q}</h3>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isOpen ? 'bg-primary-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
