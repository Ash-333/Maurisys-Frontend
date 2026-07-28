import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { fetchProductBySlug } from '../services/api';
import CTA from '../components/CTA';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchProductBySlug(slug);
        setProduct(data.data);
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

  if (!product) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </div>
    );
  }

  return (
    <>
      <section className="pt-32 pb-16 bg-slate-50/60 border-b border-slate-100">
        <div className="container-custom">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-700 mb-8"
          >
            <ArrowLeft size={15} /> Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 aspect-[4/3]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <span className="inline-block px-2.5 py-1 bg-primary-50 text-primary-700 rounded-md text-[11px] font-bold uppercase tracking-wider mb-4">
                {product.category.replace('-', ' ')}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                {product.name}
              </h1>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                {product.shortDescription}
              </p>

              <div className="flex items-center gap-3 mb-8">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-primary-800">${product.discountPrice}</span>
                    <span className="text-lg text-slate-400 line-through">${product.price}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary-800">${product.price}</span>
                )}
                {product.stock > 0 ? (
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              <Link to="/contact" className="btn-primary">
                Get in Touch <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none mb-12">
            <h3 className="text-xl md:text-2xl font-bold mb-4 tracking-tight">Overview</h3>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg">
              {product.description}
            </p>
          </div>

          {product.features && product.features.length > 0 && (
            <div className="bg-slate-50/60 border border-slate-200 rounded-2xl p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-6 tracking-tight">
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((feat, idx) => (
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
        </div>
      </section>

      <CTA />
    </>
  );
};

export default ProductDetail;
