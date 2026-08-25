import { Zap, Shield, Award, Users } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Disciplined timelines, transparent milestones, no surprises in delivery.',
  },
  {
    icon: Award,
    title: 'High Quality',
    description: 'Clean, reliable, and well-tested code engineered for the long term.',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Industry-standard security practices baked into every deliverable.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Senior specialists across engineering, design, and digital strategy.',
  },
];

const Features = () => {
  return (
    <section className="py-12 bg-slate-50/60 border-y border-slate-100">
      <div className="container-custom">
        <div className="max-w-2xl mb-14">
          <p className="section-eyebrow">Why Choose Us</p>
          <h2 className="section-title">From Vision to Working Code</h2>
          <p className="section-lede">
            We deliver fast, high-quality, and secure digital solutions backed by an experienced team committed to your success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200/70 rounded-2xl overflow-hidden border border-slate-200/70">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 hover:bg-primary-50/30 transition-colors duration-300 group"
              >
                <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary-700 group-hover:border-primary-700 transition-colors">
                  <Icon className="w-5 h-5 text-primary-700 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
