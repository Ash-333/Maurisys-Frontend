import AboutSection from '../components/AboutSection';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import { Target, Eye, Heart } from 'lucide-react';
import TeamSection from "../components/TeamSection"

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      text: 'To empower businesses with technology solutions that drive measurable growth and lasting success.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      text: 'To be the most trusted technology partner for businesses ready to transform their digital future.',
    },
    {
      icon: Heart,
      title: 'Our Values',
      text: 'Quality, innovation, transparency, and an unwavering commitment to client satisfaction.',
    },
  ];

  return (
    <>
      {/* Page Hero */}
      <section className="hero-bg pt-32 pb-20 text-white relative">
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 text-accent-300 font-semibold uppercase tracking-[0.18em] text-xs mb-4">
            <span className="inline-block w-8 h-px bg-accent-400" />
            About Us
            <span className="inline-block w-8 h-px bg-accent-400" />
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-[3.25rem] font-bold mb-5 leading-[1.1] tracking-tightest">
            Building tomorrow&apos;s
            <span className="font-serif italic font-medium text-accent-300"> digital experiences</span>
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Crafted with passion, expertise, and creativity by a team that cares
            about doing things the right way.
          </p>
        </div>
      </section>

      <AboutSection />

      {/* Mission Vision Values */}
      <section className="py-24 bg-slate-50/60 border-y border-slate-100">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="section-eyebrow justify-center">Our Compass</p>
            <h2 className="section-title">Mission, Vision & Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="card-pro-hover p-7">
                  <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-lg flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-primary-700" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">
                    {v.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <TeamSection />

      <Stats />
      <Testimonials />
      <CTA />
    </>
  );
};

export default About;
