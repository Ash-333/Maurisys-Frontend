import { useEffect, useState } from 'react';
import { fetchPartners } from '../services/api';

const PartnerLogo = ({ partner }) => {
    const logo = (
        <img
            src={partner.logo}
            alt={partner.name}
            loading="lazy"
            className="max-h-14 sm:max-h-20 w-auto object-contain transition-transform duration-300 hover:scale-110"
        />
    );

    return partner.website ? (
        <a href={partner.website} target="_blank" rel="noopener noreferrer" title={partner.name}>
            {logo}
        </a>
    ) : (
        logo
    );
};

/**
 * Continuously scrolling strip of partner logos.
 *
 * The track holds the logo list twice and slides left by 50%, so when the
 * animation restarts the second copy is exactly where the first began and the
 * loop reads as one endless belt. A short list would leave a visible gap
 * mid-scroll, so it is repeated until it overflows the viewport before being
 * doubled.
 */
const PartnersMarquee = ({ hideIfEmpty = true }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await fetchPartners();
                setItems(data.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return null;
    if (hideIfEmpty && items.length === 0) return null;

    const strip = Array.from({ length: Math.ceil(8 / items.length) }, () => items).flat();

    return (
        <section className="py-12 bg-slate-50/70 border-y border-slate-100" id="partners">
            <div className="container-custom">
                <div className="max-w-xl mb-14">
                    <p className="section-eyebrow">Our Partners</p>
                    <h2 className="section-title">Trusted by Leading Companies</h2>
                    <p className="section-lede">
                        The organisations that count on us to build, ship, and scale their technology.
                    </p>
                </div>

                {/* Edge fade so logos dissolve instead of getting clipped mid-scroll */}
                <div
                    className="group relative overflow-hidden"
                    style={{
                        maskImage:
                            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                        WebkitMaskImage:
                            'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                    }}
                >
                    <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
                        {[...strip, ...strip].map((partner, i) => (
                            <div
                                key={`${partner._id}-${i}`}
                                className="shrink-0 px-8 sm:px-14 flex items-center justify-center h-28"
                                // The duplicated half is decorative — screen readers
                                // announce the first pass only.
                                aria-hidden={i >= strip.length}
                            >
                                <PartnerLogo partner={partner} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnersMarquee;
