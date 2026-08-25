import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Eye, ArrowUpRight } from 'lucide-react';
import { fetchBlogs } from '../services/api';

const BlogSection = ({ limit = 3 }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchBlogs({ limit });
        setBlogs(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [limit]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <p className="section-eyebrow">Insights & Articles</p>
            <h2 className="section-title">Latest from Our Blog</h2>
            <p className="section-lede">
              Practical perspectives on technology, design, and digital growth from
              our team.
            </p>
          </div>
          <Link
            to="/blog"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors"
          >
            All articles <ArrowUpRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-100 h-96 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="card-pro-hover overflow-hidden"
              >
                <Link to={`/blog/${blog.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-primary-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      {blog.category}
                    </span>
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} /> {formatDate(blog.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye size={12} /> {blog.views} views
                    </span>
                  </div>

                  <Link to={`/blog/${blog.slug}`}>
                    <h3 className="text-base font-semibold text-slate-900 mb-3 hover:text-primary-700 transition-colors line-clamp-2 tracking-tight leading-snug">
                      {blog.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {blog.excerpt}
                  </p>

                  <Link
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center text-primary-700 font-semibold text-xs uppercase tracking-wider hover:gap-2 transition-all"
                  >
                    Read More <ArrowRight size={14} className="ml-1.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link to="/blog" className="btn-primary">
            View All Articles <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
