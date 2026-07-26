import { useState, useEffect, useRef } from 'react';
import { Briefcase, Users, Award, Smile } from 'lucide-react';

const stats = [
  { icon: Briefcase, value: 50, suffix: '+', label: 'Projects Completed' },
  { icon: Users, value: 40, suffix: '+', label: 'Happy Clients' },
  { icon: Award, value: 10, suffix: '+', label: 'Ongoing Projects' },
  { icon: Smile, value: 4, suffix: '+', label: 'Years Experience' },
];

// Count-up hook with start trigger
const useCountUp = (end, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
};

// Individual stat card so each can have its own counter
const StatCard = ({ stat, inView }) => {
  const Icon = stat.icon;
  const count = useCountUp(stat.value, 2000, inView);

  return (
    <div className="bg-primary-900 p-8 text-white text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-white/[0.06] border border-white/10 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary-200" strokeWidth={1.8} />
      </div>
      <p className="stat-number text-3xl md:text-4xl mb-2">
        {count}{stat.suffix}
      </p>
      <p className="text-xs text-primary-200 uppercase tracking-[0.18em] font-medium">
        {stat.label}
      </p>
    </div>
  );
};

const Stats = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // animate only once
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-primary-900 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="container-custom relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;