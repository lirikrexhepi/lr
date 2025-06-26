import React, { useRef, useEffect, useState } from "react";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

// Import all MDX files in src/posts
const blogPosts = Object.values(
  import.meta.glob("../posts/*.mdx", { eager: true })
).map((mod: any) => ({
  title: mod.frontmatter.title,
  description: mod.frontmatter.description,
  date: mod.frontmatter.date,
  slug: mod.frontmatter.slug,
}));

const Index = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [blobPosition, setBlobPosition] = useState({ x: 20, y: 20 });
  const sections = ["hero", "about", "skills", "projects", "contact", "blog"];

  const scrollToSection = (index: number) => {
    const container = scrollContainerRef.current;
    if (container && !isScrolling) {
      setIsScrolling(true);
      const sectionWidth = container.clientWidth;
      container.scrollTo({
        left: index * sectionWidth,
        behavior: "smooth",
      });
      setCurrentSection(index);

      // Move blob based on section
      const positions = [
        { x: 20, y: 20 },
        { x: 70, y: 60 },
        { x: 10, y: 70 },
        { x: 80, y: 10 },
        { x: 50, y: 50 },
        { x: 30, y: 30 },
      ];
      setBlobPosition(positions[index]);

      setTimeout(() => setIsScrolling(false), 1000);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isScrolling) return;

      const delta = e.deltaY;
      const threshold = 30;

      if (Math.abs(delta) > threshold) {
        if (delta > 0 && currentSection < sections.length - 1) {
          scrollToSection(currentSection + 1);
        } else if (delta < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1);
        }
      }
    };

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollLeft = container.scrollLeft;
        const sectionWidth = container.clientWidth;
        const newSection = Math.round(scrollLeft / sectionWidth);
        if (newSection !== currentSection) {
          setCurrentSection(newSection);
          const positions = [
            { x: 20, y: 20 },
            { x: 70, y: 60 },
            { x: 10, y: 70 },
            { x: 80, y: 10 },
            { x: 50, y: 50 },
            { x: 30, y: 30 },
          ];
          setBlobPosition(positions[newSection]);
        }
      }, 100);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentSection, isScrolling, sections.length]);

  const skills = [
    "React",
    "Vue.js",
    "Php",
    "Laravel",
    "TailwindCSS",
    "MySQL",
    "Rest API",
    "Git",
  ];

  const projects = [
    {
      title: "Avaa Match",
      description:
        "Recruitment platform that intelligently connects job seekers with employers through AI-powered matching.",
      tech: ["Laravel", "Tailwind", "MySQL", "Gemini AI"],
      link: "https://github.com/lirikrexhepi/aavaMatach",
    },
    {
      title: "Pupill",
      description:
        "Pupill is a LMS that transforms grading, homework sharing, and teacher-parent communication into a seamless digital experience.",
      tech: ["PhP", "Tailwind", "MySQL"],
      link: "https://github.com/lirikrexhepi/Pupill",
    },
    {
      title: "MathGPT",
      description:
        "A math symbol toolbox integrated into ChatGPT that enables efficient input and formatting of complex equations and formulas, improving user interaction with mathematical content.",
      tech: ["JavaScript"],
      link: "https://github.com/lirikrexhepi/mathGPT",
    },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-white relative grain-overlay">
      {/* Animated blob background */}
      <div
        className="blob animate-blob animate-rainbow"
        style={{
          left: `${blobPosition.x}%`,
          top: `${blobPosition.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      ></div>

      {/* Floating particles */}
      <div className="particle" style={{ top: "10%", left: "15%" }}></div>
      <div className="particle" style={{ top: "20%", right: "20%" }}></div>
      <div className="particle" style={{ bottom: "30%", left: "25%" }}></div>
      <div className="particle" style={{ bottom: "15%", right: "30%" }}></div>

      {/* Minimal navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-8 px-8 py-4 glass">
          {sections.map((section, index) => (
            <button
              key={section}
              onClick={() => scrollToSection(index)}
              className={`font-mono text-xs lowercase tracking-wider transition-all duration-500 ${
                currentSection === index
                  ? "text-black opacity-100"
                  : "text-black/50 hover:text-black/80"
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <div
        ref={scrollContainerRef}
        className="flex h-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide"
      >
        {/* Hero Section */}
        <section className="min-w-full h-full flex items-center justify-center snap-start">
          <div className="text-center space-y-12 max-w-6xl mx-auto px-8">
            <div className="space-y-8 animate-fadeInUp">
              <h1 className="font-display text-9xl font-bold text-black tracking-tighter leading-none text-glow">
                Lirik Rexhepi
              </h1>
              <h2 className="font-display text-7xl font-light text-black/70 tracking-wide">
                computer engineer
              </h2>
              <p className="font-mono text-sm text-black/60 max-w-2xl mx-auto lowercase tracking-wider leading-loose">
                full-stack software engineer
                <br />
                crafting digital experiences
                <br />
                and solving modern problems
              </p>
            </div>
            <div className="flex items-center justify-center gap-6">
              <button
                className="glow-button px-12 py-4 bg-black text-white font-mono text-xs lowercase tracking-wider"
                onClick={() => scrollToSection(4)}
              >
                contact
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="min-w-full h-full flex items-center justify-center snap-start">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-8 animate-fadeInUp">
                <h2 className="font-display text-7xl font-bold text-black tracking-tight text-glow">
                  about
                </h2>
                <div className="space-y-6 text-black/80 text-lg leading-relaxed font-light">
                  <p>
                    award winning software engineer with 5+ years of experience
                    building scalable web applications and digital solutions.
                  </p>
                  <p className="font-mono text-sm text-black/60 lowercase tracking-wider">
                    modern javascript frameworks / deep data understanding / ai
                    integration
                  </p>
                  <p>
                    i thrive in competitive and fast paced enviorments, turning
                    challenging and mind puzzling problems into modern digital
                    solutions through minimalist design principles and clean
                    code architecture.
                  </p>
                </div>
              </div>
              <div className="relative animate-float">
                <div className="w-96 h-96 glass zen-hover animate-glow">
                  <div className="absolute inset-8 glass-dark flex items-center justify-center overflow-hidden rounded-2xl">
                    <img
                      src="/portrait.png"
                      alt="Portrait of Lirik Rexhepi"
                      className="w-full h-full object-cover rounded-2xl"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  </div>
                  <div className="absolute top-4 right-4 font-mono text-xs text-black/30 lowercase tracking-wider"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="min-w-full h-full flex items-center justify-center snap-start">
          <div className="max-w-7xl mx-auto px-8">
            <div className="space-y-16">
              <div className="text-center">
                <h2 className="font-display text-7xl font-bold text-black tracking-tight text-glow">
                  skills
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {skills.map((skill, index) => (
                  <div
                    key={skill}
                    className="p-8 glass zen-hover group glow-button"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="font-mono text-sm text-black/80 lowercase tracking-wider group-hover:text-black transition-colors duration-300">
                      {skill}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="min-w-full h-full flex items-center justify-center snap-start">
          <div className="max-w-7xl mx-auto px-8">
            <div className="space-y-16">
              <div className="text-center">
                <h2 className="font-display text-7xl font-bold text-black tracking-tight text-glow">
                  projects
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <a
                    key={project.title}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden glass zen-hover glow-button no-underline"
                  >
                    <div className="p-10 space-y-6">
                      <div className="flex items-start justify-between">
                        <h3 className="font-display text-xl font-bold text-black group-hover:text-black/80 transition-colors">
                          {project.title}
                        </h3>
                        <ExternalLink
                          className="text-black/40 group-hover:text-black transition-colors"
                          size={16}
                        />
                      </div>
                      <p className="text-black/70 leading-relaxed font-light">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 glass font-mono text-xs text-black/60 lowercase tracking-wider"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="min-w-full h-full flex items-center justify-center snap-start">
          <div className="max-w-5xl mx-auto px-8 text-center space-y-16">
            <h2 className="font-display text-7xl font-bold text-black tracking-tight text-glow">
              contact
            </h2>
            <div className="space-y-12">
              <p className="font-mono text-sm text-black/60 max-w-2xl mx-auto lowercase tracking-wider leading-loose">
                open to discussing new opportunities
                <br />
                interesting projects
                <br />
                technology conversations
              </p>
              <div className="flex items-center justify-center gap-8">
                <a
                  href="mailto:lirikrexhepi@gmail.com"
                  className="p-6 glass zen-hover text-black glow-button"
                >
                  <Mail size={20} />
                </a>
                <a
                  href="https://github.com/lirikrexhepi/"
                  className="p-6 glass zen-hover text-black glow-button"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/lirik-rexhepi-700511240/"
                  className="p-6 glass zen-hover text-black glow-button"
                >
                  <Linkedin size={20} />
                </a>
              </div>
              <a
                href="/LirikR-Resume.pdf"
                download
                className="glow-button px-16 py-4 bg-black text-white font-mono text-xs lowercase tracking-wider inline-block"
              >
                download resume
              </a>
            </div>
          </div>
        </section>
        {/* Blog Section */}
        <section className="min-w-full h-full flex items-center justify-center snap-start">
          <div className="max-w-5xl mx-auto px-8 text-center space-y-16">
            <h2 className="font-display text-7xl font-bold text-black tracking-tight text-glow">
              blog
            </h2>
            <div className="space-y-12">
              <p className="font-mono text-sm text-black/60 max-w-2xl mx-auto lowercase tracking-wider leading-loose">
                sharing thoughts on code
                <br />
                design patterns and insights
                <br />
                stories from the development journey
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="group glass zen-hover glow-button p-6 space-y-4 block"
                  >
                    <h3 className="font-display text-lg font-bold text-black group-hover:text-black/80 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-black/70 text-sm font-light">
                      {post.description}
                    </p>
                    <div className="font-mono text-xs text-black/40">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                to="/blog"
                className="glow-button px-16 py-4 bg-black text-white font-mono text-xs lowercase tracking-wider inline-block"
              >
                explore blog
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
