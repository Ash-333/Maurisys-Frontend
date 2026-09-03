import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { fetchProducts } from '../services/api';
import { formatNPR } from '../utils/currency';

const categories = [
    { id: 'all', label: 'All' },
    { id: 'software', label: 'Software' },
    { id: 'hardware', label: 'Hardware' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'service-bundle', label: 'Bundles' },
];

const ProductsSection = ({ limit = null, showFilters = true, hideIfEmpty = false }) => {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const { data } = await fetchProducts({ category: filter });
                setItems(limit ? data.data.slice(0, limit) : data.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [filter, limit]);

    // Nothing from the API (and nothing loading) — skip the section entirely.
    if (hideIfEmpty && (loading || items.length === 0)) return null;

    return (
        <section className="py-12 bg-white" id="products">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                    <div className="max-w-xl">
                        <p className="section-eyebrow">Our Products</p>
                        <h2 className="section-title">Ready-to-Use Solutions</h2>
                        <p className="section-lede">
                            Explore the products we&apos;ve built to help businesses launch and scale faster.
                        </p>
                    </div>
                    {limit && (
                        <Link
                            to="/products"
                            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors"
                        >
                            View all products <ArrowUpRight size={16} />
                        </Link>
                    )}
                </div>

                {showFilters && (
                    <div className="flex flex-wrap gap-2 mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`px-4 py-1.5 rounded-full font-medium text-xs uppercase tracking-wider transition-all border ${filter === cat.id
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
                            <div key={i} className="bg-slate-200 h-80 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-12 text-center text-slate-500">
                        No products available yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {items.map((item) => (
                            <Link
                                key={item._id}
                                to={`/products/${item.slug}`}
                                className="group card-pro-hover overflow-hidden block"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {item.isFeatured && (
                                        <span className="absolute top-3 left-3 bg-accent-600 text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <div className="p-5">
                                    <span className="inline-block px-2.5 py-0.5 bg-primary-50 text-primary-700 rounded-md text-[10px] font-bold uppercase tracking-wider mb-3">
                                        {item.category.replace('-', ' ')}
                                    </span>
                                    <h3 className="text-base font-semibold text-slate-900 mb-1.5 tracking-tight">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
                                        {item.shortDescription}
                                    </p>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            {item.discountPrice ? (
                                                <>
                                                    <span className="font-bold text-primary-800">{formatNPR(item.discountPrice)}</span>
                                                    <span className="text-xs text-slate-400 line-through">{formatNPR(item.price)}</span>
                                                </>
                                            ) : (
                                                <span className="font-bold text-primary-800">{formatNPR(item.price)}</span>
                                            )}
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700">
                                            <ShoppingBag size={13} /> View
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {limit && (
                    <div className="text-center mt-10 md:hidden">
                        <Link to="/products" className="btn-primary">
                            View All Products <ArrowRight size={16} className="ml-2" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductsSection;
