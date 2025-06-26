import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, Share2, Eye } from "lucide-react";
import { Link, useParams } from "react-router-dom";

// Import all MDX files
const postModules = import.meta.glob("../posts/*.mdx", { eager: true });

const BlogPost = () => {
  const { slug } = useParams();
  const [blobPosition, setBlobPosition] = useState({ x: 50, y: 30 });
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setBlobPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!slug) return;
    // Only increment once per session
    const key = `viewed-${slug}`;
    if (!sessionStorage.getItem(key)) {
      fetch(`https://api.countapi.xyz/hit/lirikrexhepi-blog/${slug}`)
        .then((res) => res.json())
        .then((data) => setViews(data.value));
      sessionStorage.setItem(key, "true");
    } else {
      fetch(`https://api.countapi.xyz/get/lirikrexhepi-blog/${slug}`)
        .then((res) => res.json())
        .then((data) => setViews(data.value));
    }
  }, [slug]);

  // Find the post with the matching slug
  const post = Object.values(postModules).find(
    (mod: any) => mod.frontmatter.slug === slug
  ) as any;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Post not found.</p>
      </div>
    );
  }

  const { title, date, readTime, tags } = post.frontmatter;
  const Content = post.default;

  return (
    <div className="min-h-screen w-full bg-white relative grain-overlay">
      {/* Animated blob background */}
      <div
        className="blob animate-blob animate-rainbow"
        style={{
          left: `${blobPosition.x}%`,
          top: `${blobPosition.y}%`,
          transform: "translate(-50%, -50%)",
          transition: "left 0.3s ease-out, top 0.3s ease-out",
        }}
      ></div>

      {/* Header */}
      <nav className="fixed top-6 left-6 z-50">
        <Link
          to="/blog"
          className="glow-button p-4 glass text-black hover:text-white"
        >
          <ArrowLeft size={20} />
        </Link>
      </nav>

      <div className="container mx-auto px-8 py-24 max-w-4xl">
        {/* Article Header */}
        <header className="space-y-8 mb-16 animate-fadeInUp">
          <div className="flex items-center gap-4 font-mono text-xs text-black/40">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{views !== null ? views : "--"} views</span>
            </div>
            <button className="flex items-center gap-1 hover:text-black transition-colors">
              <Share2 size={12} />
              <span>share</span>
            </button>
          </div>

          <h1 className="font-display text-6xl font-bold text-black tracking-tight leading-tight text-glow">
            {title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {tags &&
              tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-4 py-2 glass font-mono text-sm text-black/60 lowercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <Content />
        </article>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-16 pt-8 border-t border-black/10">
          <Link
            to="/blog"
            className="glow-button px-6 py-3 glass text-black font-mono text-xs lowercase tracking-wider hover:text-white"
          >
            ← back to blog
          </Link>
          <div className="flex items-center gap-4">
            <button className="glow-button p-3 glass text-black hover:text-white">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
