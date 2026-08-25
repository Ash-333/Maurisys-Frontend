import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Quote, Star, MessageSquarePlus, ArrowUpRight } from 'lucide-react';
import { fetchReviews } from '../services/api';
import ReviewModal from './ReviewModal';
import { Toaster } from 'react-hot-toast';

// Fallback testimonials shown when DB has no approved reviews yet
// (so the homepage doesn't look empty before any reviews come in)
const fallbackTestimonials = [
  {
    _id: 'fb1',
    name: 'Sarah Mitchell',
    role: 'Founder, BrightStart',
    image: 'https://i.pravatar.cc/100?img=1',
    rating: 5,
    text: 'The Maurisys team transformed our online presence completely. Our website now loads faster, looks stunning, and converts visitors into customers. Highly recommended.',
  },
  {
    _id: 'fb2',
    name: 'David Chen',
    role: 'CEO, FinPath',
    image: 'https://i.pravatar.cc/100?img=12',
    rating: 5,
    text: 'Working with Maurisys was a game-changer. They built our mobile app from scratch and delivered ahead of schedule. The quality and attention to detail were exceptional.',
  },
  {
    _id: 'fb3',
    name: 'Priya Sharma',
    role: 'Marketing Director, GreenLeaf',
    image: 'https://i.pravatar.cc/100?img=5',
    rating: 5,
    text: 'Their SEO and digital marketing services doubled our organic traffic in just three months. Professional, responsive, and truly invested in our success.',
  },
];

const Testimonials = ({ limit = 3, showWriteButton = true, hideIfEmpty = false }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await fetchReviews({ limit });
      setReviews(data.data || []);
    } catch (e) {
      console.error('Failed to load reviews', e);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [limit]);

  // When hideIfEmpty is set we never fall back to the placeholder reviews —
  // the section simply doesn't render until real reviews exist.
  const items = reviews.length > 0 ? reviews : hideIfEmpty ? [] : fallbackTestimonials;

  // Render nothing while loading too, so the section doesn't flash in and out.
  if (hideIfEmpty && (loading || items.length === 0)) return null;

  return (
    <section className="py-12 bg-white">
      <Toaster position="top-right" />
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <p className="section-eyebrow">Testimonials</p>
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-lede">
              Long-term partnerships are how we measure our work. Here is what some of
              those partners had to say.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {showWriteButton && (
              <button
                onClick={() => setModalOpen(true)}
                className="btn-secondary"
              >
                <MessageSquarePlus size={15} className="mr-2" /> Write a Review
              </button>
            )}
            <Link
              to="/reviews"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors"
            >
              All reviews <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-100 h-64 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.slice(0, limit).map((t) => (
              <div key={t._id} className="card-pro-hover p-7 relative">
                <Quote
                  className="absolute top-6 right-6 w-8 h-8 text-primary-100"
                  strokeWidth={1.5}
                />
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (t.rating || 5)
                          ? 'fill-accent-400 text-accent-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 relative z-10 text-[15px] line-clamp-6">
                  {t.text}
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center text-white font-bold text-sm">
                      {t.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {t.name}
                    </p>
                    {t.role && (
                      <p className="text-xs text-slate-500">{t.role}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={load}
      />
    </section>
  );
};

export default Testimonials;
