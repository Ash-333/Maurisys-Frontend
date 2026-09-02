import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const AboutSection = () => {
  const points = [
    '10+ experienced technology professionals',
    'AI & Business Automation solutions',
    'Custom software tailored to your business',
    'Transparent pricing & 24/7 support',
    'Proven expertise across industries',
    'Long-term technology partnerships',
  ];

  return (
    <section className="py-12 bg-white" id="about">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden shadow-card border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600"
                    
                    alt="Team collaboration"
                    className="w-full h-44 object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-card border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600"
                    alt="Office workspace"
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>
              <div className="space-y-3 pt-8">
                <div className="rounded-xl overflow-hidden shadow-card border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600"
                    alt="Client meeting"
                    className="w-full h-32 object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-card border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600"
                    alt="Working together"
                    className="w-full h-44 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Stats badge */}
            <div className="absolute -bottom-4 -right-4 bg-primary-900 text-white rounded-xl p-5 shadow-elevated hidden md:block">
              <p className="stat-number text-3xl">4+</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary-200 mt-1">
                Years of Experience
              </p>
            </div>
          </div>

          {/* Content side */}
          <div>
            <p className="section-eyebrow">About Maurisys</p>
            <h2 className="section-title">
              Your Trusted{' '}
              <span className="font-serif italic font-medium text-primary-700">
                Technology Partner
              </span>
            </h2>
            <p className="text-slate-600 mb-5 leading-relaxed text-[15px]">
              Maurisys is a trusted technology partner helping businesses transform ideas into innovative digital solutions. We specialize in web development, mobile applications, AI-powered solutions, business automation, cloud technologies, and custom software designed to improve efficiency, streamline operations, and drive sustainable growth.
            </p>
            <p className="text-slate-600 mb-7 leading-relaxed text-[15px]">
              Whether you're a startup, growing business, or enterprise, our experienced team delivers secure, scalable, and high-performance solutions tailored to your unique business goals. From strategy and design to development, deployment, and ongoing support, we are committed to delivering technology that creates lasting value.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-9">
              {points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary-700" strokeWidth={3} />
                  </div>
                  <span className="text-slate-700 text-sm">{point}</span>
                </div>
              ))}
            </div>

            <Link to="/about" className="btn-primary">
              Learn More <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
