import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe, Smartphone, Palette, TrendingUp, Megaphone,
  Image, Server, PenTool, Link as LinkIcon, ArrowRight, Code, ArrowUpRight,
} from 'lucide-react';
import { fetchServices } from '../services/api';

const iconMap = {
  globe: Globe,
  smartphone: Smartphone,
  palette: Palette,
  'trending-up': TrendingUp,
  megaphone: Megaphone,
  image: Image,
  server: Server,
  'pen-tool': PenTool,
  link: LinkIcon,
  code: Code,
};

const ServicesSection = ({ limit = null }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchServices();
        setServices(limit ? data.data.slice(0, limit) : data.data);
      } catch (e) {
        console.error('Failed to load services', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [limit]);

  return (
    <section className="py-24 bg-white" id="services">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <p className="section-eyebrow">Our Services</p>
            <h2 className="section-title">Complete Digital Solutions</h2>
            <p className="section-lede">
              Transforming ideas into powerful digital solutions with end-to-end technology services that drive innovation, growth, and long-term success.
            </p>
          </div>
          {limit && (
            <Link
              to="/services"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors"
            >
              View all services <ArrowUpRight size={16} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-100 h-56 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Code;
              return (
                <Link
                  key={service._id}
                  to={`/services/${service.slug}`}
                  className="group card-pro-hover p-7 relative block"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 bg-primary-50 border border-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-700 group-hover:border-primary-700 transition-colors">
                      <Icon className="w-5 h-5 text-primary-700 group-hover:text-white transition-colors" strokeWidth={1.8} />
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="text-slate-300 group-hover:text-primary-700 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {service.shortDescription}
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        {limit && (
          <div className="text-center mt-10 md:hidden">
            <Link to="/services" className="btn-primary">
              View All Services <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
