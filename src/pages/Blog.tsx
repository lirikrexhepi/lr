import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

// Import all MDX files in src/posts
const blogPosts = Object.values(
  import.meta.glob("../posts/*.mdx", { eager: true })
).map((mod: any) => ({
  title: mod.frontmatter.title,
  excerpt: mod.frontmatter.description,
  date: mod.frontmatter.date,
  readTime: mod.frontmatter.readTime || "5 min read",
  slug: mod.frontmatter.slug,
  tags: mod.frontmatter.tags,
}));

const Blog = () => {
  const [blobPosition, setBlobPosition] = useState({ x: 30, y: 40 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setBlobPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white relative grain-overlay">
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

      {/* Floating particles */}
      <div className="particle" style={{ top: "10%", left: "15%" }}></div>
      <div className="particle" style={{ top: "20%", right: "20%" }}></div>
      <div className="particle" style={{ bottom: "30%", left: "25%" }}></div>
      <div className="particle" style={{ bottom: "15%", right: "30%" }}></div>

      {/* Header */}
      <nav className="fixed top-6 left-6 z-50">
        <Link
          to="/"
          className="glow-button p-4 glass text-black hover:text-white"
        >
          <ArrowLeft size={20} />
        </Link>
      </nav>

      <div className="container mx-auto px-8 py-24">
        {/* Hero Section */}
        <div className="text-center space-y-12 mb-24 animate-fadeInUp">
          <div className="space-y-8">
            <h1 className="font-display text-8xl font-bold text-black tracking-tighter leading-none text-glow">
              blog
            </h1>
            <p className="font-mono text-sm text-black/60 max-w-2xl mx-auto lowercase tracking-wider leading-loose">
              thoughts on code, design, and technology
              <br />
              sharing knowledge through stories
              <br />
              exploring the craft of software development
            </p>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={post.slug}
                className="group relative overflow-hidden glass zen-hover glow-button"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4 text-black/40 font-mono text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <h2 className="font-display text-xl font-bold text-black group-hover:text-black/80 transition-colors leading-tight">
                        {post.title}
                      </h2>
                    </div>
                    <ExternalLink
                      className="text-black/40 group-hover:text-black transition-colors flex-shrink-0 ml-4"
                      size={16}
                    />
                  </div>

                  <p className="text-black/70 leading-relaxed font-light text-sm">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {post.tags &&
                      post.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 glass font-mono text-xs text-black/60 lowercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>

                <Link
                  to={`/blog/${post.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Read ${post.title}`}
                />
              </article>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-24 space-y-8">
          <div className="space-y-4">
            <h3 className="font-display text-3xl font-bold text-black">
              want to stay updated?
            </h3>
            <p className="font-mono text-sm text-black/60 lowercase tracking-wider">
              subscribe for new posts and insights
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-6 py-3 glass font-mono text-sm lowercase tracking-wider placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20"
            />
            <button className="glow-button px-8 py-3 bg-black text-white font-mono text-xs lowercase tracking-wider">
              subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
