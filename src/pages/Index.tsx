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
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [blobPosition, setBlobPosition] = useState({ x: 20, y: 20 });
  const [isMobile, setIsMobile] = useState(false);
  const navRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [highlight, setHighlight] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const sections = ["hero", "about", "skills", "projects", "contact", "blog"];

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animated nav highlight effect
  useEffect(() => {
    const activeBtn = navRefs.current[currentSection];
    if (activeBtn) {
      const rect = activeBtn.getBoundingClientRect();
      const parentRect = activeBtn.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setHighlight({
          x: activeBtn.offsetLeft,
          y: activeBtn.offsetTop,
          width: activeBtn.offsetWidth,
          height: activeBtn.offsetHeight,
        });
      }
      // Scroll active nav link into view on mobile
      if (window.innerWidth < 768) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [currentSection, isMobile]);

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
      if (isMobile) return; // Disable horizontal scroll on mobile
      e.preventDefault();
      if (isScrolling) return;
      const delta = e.deltaY;
      const threshold = 30;
      if (Math.abs(delta) > threshold) {
        if (delta > 0 && currentSection < sections.length - 1) {
          // Special handling for projects section
          if (
            currentSection === 3 &&
            projectsSectionRef.current &&
            projectsSectionRef.current.scrollHeight >
              projectsSectionRef.current.clientHeight
          ) {
            // If not at bottom of projects, let vertical scroll happen
            const proj = projectsSectionRef.current;
            if (proj.scrollTop + proj.clientHeight < proj.scrollHeight - 5) {
              // Let user scroll down in projects
              return;
            }
          }
          scrollToSection(currentSection + 1);
        } else if (delta < 0 && currentSection > 0) {
          // Special handling for projects section
          if (
            currentSection === 3 &&
            projectsSectionRef.current &&
            projectsSectionRef.current.scrollTop > 5
          ) {
            // Let user scroll up in projects
            return;
          }
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
  }, [currentSection, isScrolling, sections.length, isMobile]);

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
      <nav className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-full px-1 sm:top-6">
        <div
          className="relative flex items-center justify-center mx-1 sm:mx-12 gap-0.5 sm:gap-8 px-0.5 sm:px-8 py-2 sm:py-4 glass overflow-x-auto scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-transparent rounded-lg whitespace-nowrap"
          style={{ minHeight: 48 }}
        >
          {/* Fade indicator for mobile scrollable nav */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-4 bg-gradient-to-r from-white via-white/80 to-transparent z-20 block sm:hidden" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-white via-white/80 to-transparent z-20 block sm:hidden" />
          {/* Animated gradient highlight */}
          <div
            className="absolute pointer-events-none transition-all duration-300"
            style={{
              top: highlight.y,
              left: highlight.x,
              width: highlight.width,
              height: highlight.height,
              background:
                "linear-gradient(45deg, #311736, #cf69a1, #c88827, #6f6aa1)",
              borderRadius: 12,
              zIndex: 0,
              opacity: 1,
              boxShadow: "0 2px 8px 0 rgba(80, 40, 80, 0.10)",
              transition:
                "top 0.3s cubic-bezier(.4,1,.4,1), left 0.3s cubic-bezier(.4,1,.4,1), width 0.3s cubic-bezier(.4,1,.4,1), height 0.3s cubic-bezier(.4,1,.4,1)",
            }}
          />
          {sections.map((section, index) => (
            <button
              key={section}
              ref={(el) => (navRefs.current[index] = el)}
              onClick={() => scrollToSection(index)}
              className={`font-mono text-xs lowercase tracking-wider transition-all duration-500 px-1.5 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap relative z-10
                ${
                  currentSection === index
                    ? "text-white"
                    : "text-black/50 hover:text-black/80"
                }
              `}
              style={{
                borderRadius: 12,
                fontWeight: currentSection === index ? 700 : 400,
                transition: "color 0.3s cubic-bezier(.4,1,.4,1)",
              }}
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
          <div className="text-center space-y-8 sm:space-y-12 max-w-6xl mx-auto px-4 sm:px-8 w-full">
            <div className="space-y-6 sm:space-y-8 animate-fadeInUp">
              <h1 className="font-display text-5xl sm:text-9xl font-bold text-black tracking-tighter leading-none text-glow break-words">
                Lirik Rexhepi
              </h1>
              <h2 className="font-display text-3xl sm:text-7xl font-light text-black/70 tracking-wide">
                computer engineer
              </h2>
              <p className="font-mono text-xs sm:text-sm text-black/60 max-w-2xl mx-auto lowercase tracking-wider leading-loose">
                full-stack software engineer
                <br />
                crafting digital experiences
                <br />
                and solving modern problems
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <button
                className="glow-button px-8 sm:px-12 py-3 sm:py-4 bg-black text-white font-mono text-xs lowercase tracking-wider"
                onClick={() => scrollToSection(4)}
              >
                contact
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="min-w-full h-full flex items-center justify-center snap-start">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-24 items-center">
              <div className="space-y-6 sm:space-y-8 animate-fadeInUp">
                <h2 className="font-display text-4xl sm:text-7xl font-bold text-black tracking-tight text-glow">
                  about
                </h2>
                <div className="space-y-4 sm:space-y-6 text-black/80 text-base sm:text-lg leading-relaxed font-light">
                  <p>
                    award winning software engineer with 3 years of experience
                    building scalable web applications and digital solutions.
                  </p>
                  <p className="font-mono text-xs sm:text-sm text-black/60 lowercase tracking-wider">
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
              {/* Portrait image section removed */}
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
          <div
            ref={projectsSectionRef}
            className={`max-w-7xl mx-auto px-4 sm:px-8 w-full h-full ${
              isMobile ? "overflow-y-auto pt-8 pb-8" : ""
            }`}
            style={isMobile ? { maxHeight: "100vh" } : {}}
          >
            <div className="space-y-8 sm:space-y-16">
              <div className="text-center pt-16 sm:pt-24">
                <h2 className="font-display text-4xl sm:text-7xl font-bold text-black tracking-tight text-glow">
                  projects
                </h2>
              </div>
              <div
                className={`grid gap-4 sm:gap-8 ${
                  isMobile
                    ? "grid-cols-1"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {projects.map((project, index) => (
                  <a
                    key={project.title}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden glass zen-hover glow-button no-underline"
                  >
                    <div className="p-6 sm:p-10 space-y-4 sm:space-y-6">
                      <div className="flex items-start justify-between">
                        <h3 className="font-display text-lg sm:text-xl font-bold text-black group-hover:text-black/80 transition-colors">
                          {project.title}
                        </h3>
                        <ExternalLink
                          className="text-black/40 group-hover:text-black transition-colors"
                          size={16}
                        />
                      </div>
                      <p className="text-black/70 text-sm sm:text-base leading-relaxed font-light">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 sm:px-3 py-1 glass font-mono text-xs text-black/60 lowercase tracking-wider"
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
                href="/Resume.pdf"
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
      {/* Scroll Indicator */}
      {currentSection < sections.length - 1 && (
        <div
          className={`fixed z-50 select-none pointer-events-none transition-opacity duration-300 ${
            isMobile
              ? "bottom-4 right-4 flex flex-col items-end"
              : "bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          }`}
        >
          {isMobile ? (
            <>
              <svg
                className="animate-bounce mb-1"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#888" }}
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="font-mono text-xs text-black/40">
                scroll left
              </span>
            </>
          ) : (
            <>
              <svg
                className="animate-bounce mb-1"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#888" }}
              >
                <polyline points="6 15 12 21 18 15" />
                <line x1="12" y1="3" x2="12" y2="21" />
              </svg>
              <span className="font-mono text-xs text-black/40">
                scroll down
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
