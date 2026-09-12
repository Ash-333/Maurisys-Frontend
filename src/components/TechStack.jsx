import { techIcons } from '../assets/techIcons';

/**
 * Three belts of technology logos, one per discipline. Rows alternate
 * direction and run at slightly different speeds so the block reads as three
 * independent strips rather than one big scrolling wall.
 */
const rows = [
  {
    label: 'Frontend',
    duration: '38s',
    reverse: false,
    slugs: ['react', 'nextdotjs', 'typescript', 'javascript', 'tailwindcss', 'redux', 'vite', 'html5', 'css3'],
  },
  {
    label: 'Backend',
    duration: '46s',
    reverse: true,
    slugs: ['nodedotjs', 'express', 'nestjs', 'python', 'django', 'graphql', 'mongodb', 'postgresql', 'mysql', 'redis'],
  },
  {
    label: 'Tools & Cloud',
    duration: '42s',
    reverse: false,
    slugs: ['docker', 'amazonwebservices', 'kubernetes', 'git', 'github', 'vercel', 'nginx', 'firebase', 'postman', 'figma', 'openai'],
  },
];

const TechLogo = ({ slug }) => {
  const icon = techIcons[slug];
  if (!icon) return null;

  return (
    <div className="group/logo flex flex-col items-center gap-3 w-28 sm:w-32">
      <svg
        role="img"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 transition-transform duration-300 group-hover/logo:scale-110"
        fill={icon.hex}
      >
        <path d={icon.path} />
      </svg>
      <span className="text-xs font-semibold text-slate-600 tracking-tight text-center transition-colors duration-300 group-hover/logo:text-slate-900">
        {icon.title}
      </span>
    </div>
  );
};

/**
 * The track holds the logo list twice and slides left by 50%, so when the
 * animation restarts the second copy sits exactly where the first began and the
 * loop reads as one endless belt. A short list would leave a visible gap
 * mid-scroll, so it is repeated until it overflows the viewport before doubling.
 */
const TechRow = ({ row }) => {
  const strip = Array.from({ length: Math.ceil(12 / row.slugs.length) }, () => row.slugs).flat();

  return (
    <div className="container-custom">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-4">
        {row.label}
      </p>

      {/* Edge fade so logos dissolve instead of getting clipped mid-scroll */}
      <div
        className="group relative overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div
          className={`flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none ${
            row.reverse ? '[animation-direction:reverse]' : ''
          }`}
          style={{ animationDuration: row.duration }}
        >
          {[...strip, ...strip].map((slug, i) => (
            <div
              key={`${slug}-${i}`}
              className="shrink-0 px-2 sm:px-4 flex items-center justify-center"
              // The duplicated half is decorative — screen readers announce the
              // first pass only.
              aria-hidden={i >= strip.length}
            >
              <TechLogo slug={slug} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TechStack = () => {
  return (
    <section className="py-12 bg-slate-50/60 border-y border-slate-100" id="technologies">
      <div className="container-custom">
        <div className="max-w-2xl mb-14">
          <p className="section-eyebrow">Our Tech Stack</p>
          <h2 className="section-title">Technologies We Work With</h2>
          <p className="section-lede">
            We pick proven, well-supported tools over trends — so what we build for you stays
            fast today and maintainable years from now.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {rows.map((row) => (
          <TechRow key={row.label} row={row} />
        ))}
      </div>
    </section>
  );
};

export default TechStack;
