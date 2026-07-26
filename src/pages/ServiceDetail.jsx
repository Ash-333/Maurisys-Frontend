import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { fetchServiceBySlug } from '../services/api';
import CTA from '../components/CTA';

const ServiceDetail = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchServiceBySlug(slug);
        setService(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 text-center">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Service not found</h2>
        <Link to="/services" className="btn-primary">Back to Services</Link>
      </div>
    );
  }

  return (
    <>
      <section className="hero-bg pt-32 pb-20 text-white relative">
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 text-accent-300 font-semibold uppercase tracking-[0.18em] text-xs mb-4">
            <span className="inline-block w-8 h-px bg-accent-400" />
            Service
            <span className="inline-block w-8 h-px bg-accent-400" />
          </p>
          <h1 className="text-4xl text-white md:text-5xl lg:text-[3.25rem] font-bold mb-5 leading-[1.1] tracking-tightest">
            {service.title}
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {service.shortDescription}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-slate-700 leading-relaxed text-base md:text-lg">
              {service.description}
            </p>
          </div>

          {service.features && service.features.length > 0 && (
            <div className="bg-slate-50/60 border border-slate-200 rounded-2xl p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-6 tracking-tight">
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 mt-0.5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary-700" strokeWidth={3} />
                    </div>
                    <span className="text-slate-700 text-sm">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/contact" className="btn-primary">
              Get a Started <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
};

export default ServiceDetail;
