import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Renders an assistant reply as Markdown.
 *
 * Assistant output arrives as Markdown, so the raw text would otherwise show
 * its own syntax (**bold**, `- ` bullets, pipe tables) to the user. Element
 * styling is supplied here rather than through a prose plugin so the type scale
 * stays inside a 400px-wide chat bubble.
 *
 * This is loaded lazily by ChatWidget: the parser is a sizeable dependency and
 * nobody needs it until a chat is actually opened.
 */
const components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,

  // Headings are all the same size in here — a chat bubble has no room for a
  // scale, so they read as bold lead-ins with a little space above.
  h1: ({ children }) => <p className="font-semibold mt-3 first:mt-0 mb-1.5">{children}</p>,
  h2: ({ children }) => <p className="font-semibold mt-3 first:mt-0 mb-1.5">{children}</p>,
  h3: ({ children }) => <p className="font-semibold mt-3 first:mt-0 mb-1.5">{children}</p>,
  h4: ({ children }) => <p className="font-semibold mt-3 first:mt-0 mb-1.5">{children}</p>,

  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="pl-0.5">{children}</li>,

  strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="text-primary-700 underline underline-offset-2 hover:text-primary-900"
    >
      {children}
    </a>
  ),

  // react-markdown v10 dropped the `inline` prop, so every `code` is styled as
  // an inline chip and `pre` strips that back off for its own child instead.
  code: ({ children }) => (
    <code className="px-1 py-0.5 rounded bg-slate-200/70 text-[0.85em] font-mono">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-2 p-2.5 rounded-lg bg-slate-800 text-slate-100 overflow-x-auto [&>code]:bg-transparent [&>code]:p-0 [&>code]:rounded-none">
      {children}
    </pre>
  ),

  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-slate-300 pl-3 my-2 text-slate-600">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-slate-200" />,

  // Tables can outgrow the bubble, so each gets its own horizontal scroller
  // rather than widening the panel.
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full text-left border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-slate-200 px-2 py-1 bg-slate-50 font-semibold whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border border-slate-200 px-2 py-1">{children}</td>,
};

const ChatMarkdown = ({ content }) => (
  <Markdown remarkPlugins={[remarkGfm]} components={components}>
    {content}
  </Markdown>
);

export default ChatMarkdown;
