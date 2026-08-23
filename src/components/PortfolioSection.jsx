import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, ArrowUpRight } from 'lucide-react';
import { fetchPortfolio } from '../services/api';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'graphics', label: 'Graphics' },
  { id: 'branding', label: 'Branding' },
];

const PortfolioSection = ({ limit = null, showFilters = true, hideIfEmpty = false }) => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchPortfolio({ category: filter });
        setItems(limit ? data.data.slice(0, limit) : data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filter, limit]);

  // When hideIfEmpty is set the section doesn't render until real items exist.
  if (hideIfEmpty && (loading || items.length === 0)) return null;

  return (
    <section className="py-24 bg-slate-50/60 border-y border-slate-100" id="portfolio">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="section-eyebrow">Our Portfolio</p>
            <h2 className="section-title">Recent Work We&apos;re Proud Of</h2>
            <p className="section-lede">
              A selection of projects we have delivered for clients across industries.
            </p>
          </div>
          {limit && (
            <Link
              to="/portfolio"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors"
            >
              View all projects <ArrowUpRight size={16} />
            </Link>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-1.5 rounded-full font-medium text-xs uppercase tracking-wider transition-all border ${
                  filter === cat.id
                    ? 'bg-primary-800 text-white border-primary-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-200 h-72 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={item._id}
                className="group card-pro-hover overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-primary-800 p-2.5 rounded-md hover:bg-slate-100 transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <span className="inline-block px-2.5 py-0.5 bg-primary-50 text-primary-700 rounded-md text-[10px] font-bold uppercase tracking-wider mb-3">
                    {item.category}
                  </span>
                  <h3 className="text-base font-semibold text-slate-900 mb-1.5 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {limit && (
          <div className="text-center mt-10 md:hidden">
            <Link to="/portfolio" className="btn-primary">
              View All Projects <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
