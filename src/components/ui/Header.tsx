"use client";
import { useEffect, useState } from "react";
import Danvora from "@/assets/danvora-logo";
import { ContactModal } from "@/components/ContactModal";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "motion/react";
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Services");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/privacy-policy") {
      setActiveSection("");
      return;
    }
    if (pathname === "/about") {
      setActiveSection("About");
      return;
    }
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50;
      setIsScrolled(window.scrollY > scrollThreshold);

      // Determine active section based on scroll position
      const sections = ["services", "integrations", "solutions", "about"];
      const sectionNames = ["Services", "Integrations", "Solutions", "About"];

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(sectionNames[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
    // if the url is not /about.
    if (pathname === "/about" || pathname === "/privacy-policy") {
      // Navigate to the home page
      router.push("/");
      return;
    }
    if (href.startsWith("#")) {
      // Smooth scroll to section
      const targetId = href.replace("#", "");
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerHeight = 80; // Account for fixed header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    } else {
      // Navigate to external link
      window.location.href = href;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center transition-all duration-300 py-2 sm:py-4 will-change-transform">
      <div
        className={`w-full transition-all duration-300 px-4 sm:px-6 ${
          isScrolled ? "max-w-4xl" : "max-w-7xl"
        }`}
      >
        <div
          className={`mx-auto rounded-2xl transition-all duration-300 ${
            isScrolled
              ? "px-4 sm:px-6 border border-border/20 backdrop-blur-lg bg-background/95 shadow-lg"
              : "shadow-none px-4 sm:px-7"
          }`}
        >
          <div className="flex h-[56px] items-center justify-between p-2 sm:p-4">
            <a className="flex items-center gap-1" href="/">
              <span
                className={`text-xl sm:text-2xl font-bold whitespace-nowrap transition-colors duration-300 ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              >
                <Danvora
                  height={120}
                  width={120}
                  fill={isScrolled ? "#201515" : "#fff"}
                />
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="w-full hidden lg:block">
              <ul className="relative mx-auto flex w-fit rounded-full h-11 px-2 items-center justify-center">
                <li
                  className={`relative z-10 cursor-pointer h-full flex items-center justify-center px-3 xl:px-4 py-2 text-sm font-medium transition-all duration-300 tracking-tight rounded-full group ${
                       isScrolled
                      ? "text-foreground/60 hover:text-foreground hover:bg-accent/30"
                      : "text-white/70 hover:text-white hover:font-medium"
                  }`}
                >
                  <div className="relative">
                    <button className="flex items-center gap-2" type="button">
                      Services
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {/* Dropdown menu - fix: keep visible on hover over dropdown */}
                    <div className="absolute left-0 top-full mt-4 min-w-[220px] bg-background/95 border border-border/20 shadow-lg backdrop-blur-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 z-[999]"
                      onMouseEnter={e => {e.currentTarget.classList.add('opacity-100','visible');}}
                      onMouseLeave={e => {e.currentTarget.classList.remove('opacity-100','visible');}}
                    >
                      <ul className="">
                        <li>
                          <button className="w-full text-foreground text-left px-5 py-2 text-sm font-medium  transition-colors hover:bg-orange-500 hover:text-white focus:bg-orange-600 focus:text-white" onClick={() => handleNavClick("/customer-service")}>Customer Service</button>
                        </li>
                        <li><div className="mx-5 my-1 h-px bg-border/30" /></li>
                        <li>
                          <button className="text-foreground w-full text-left px-5 py-2 text-sm font-medium transition-colors hover:bg-orange-500 hover:text-white focus:bg-orange-600 focus:text-white" onClick={() => handleNavClick("/financial-reporting")}>Financial Reporting</button>
                        </li>
                        <li><div className="mx-5 my-1 h-px bg-border/30" /></li>
                        <li>
                          <button className="text-foreground w-full text-left px-5 py-2 text-sm font-medium  transition-colors hover:bg-orange-500 hover:text-white focus:bg-orange-600 focus:text-white" onClick={() => handleNavClick("/marketing-automation")}>Marketing Automation</button>
                        </li>
                        <li><div className="mx-5 my-1 h-px bg-border/30" /></li>
                        <li>
                          <button className="text-foreground w-full text-left px-5 py-2 text-sm font-medium  transition-colors hover:bg-orange-500 hover:text-white focus:bg-orange-600 focus:text-white" onClick={() => handleNavClick("/product-management")}>Product Management</button>
                        </li>
                        <li><div className="mx-5 my-1 h-px bg-border/30" /></li>
                        <li>
                          <button className="text-foreground w-full text-left px-5 py-2 text-sm font-medium  transition-colors hover:bg-orange-500 hover:text-white focus:bg-orange-600 focus:text-white" onClick={() => handleNavClick("/inventory")}>Inventory</button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li
                  className={`z-10 cursor-pointer h-full flex items-center justify-center px-3 xl:px-4 py-2 text-sm font-medium transition-all duration-300 tracking-tight rounded-full ${
                    activeSection === "Integrations"
                      ? isScrolled
                        ? "text-foreground bg-accent/60 border border-border"
                        : "text-white bg-white/15 backdrop-blur-md border border-white/20 shadow-md font-semibold"
                      : isScrolled
                      ? "text-foreground/60 hover:text-foreground hover:bg-accent/30"
                      : "text-white/70 hover:text-white hover:font-medium hover:bg-white/10"
                  }`}
                >
                  <button onClick={() => handleNavClick("#integrations")}>
                    Integrations
                  </button>
                </li>
                <li
                  className={`z-10 cursor-pointer h-full flex items-center justify-center px-3 xl:px-4 py-2 text-sm font-medium transition-all duration-300 tracking-tight rounded-full ${
                    activeSection === "Solutions"
                      ? isScrolled
                        ? "text-foreground bg-accent/60 border border-border"
                        : "text-white bg-white/15 backdrop-blur-md border border-white/20 shadow-md font-semibold"
                      : isScrolled
                      ? "text-foreground/60 hover:text-foreground hover:bg-accent/30"
                      : "text-white/70 hover:text-white hover:font-medium hover:bg-white/10"
                  }`}
                >
                  <button onClick={() => handleNavClick("#solutions")}>
                    Solutions
                  </button>
                </li>
                <li
                  className={`z-10 cursor-pointer h-full flex items-center justify-center px-3 xl:px-4 py-2 text-sm font-medium transition-all duration-300 tracking-tight rounded-full ${
                    activeSection === "About"
                      ? isScrolled
                        ? "text-foreground bg-accent/60 border border-border"
                        : "text-white bg-white/15 backdrop-blur-md border border-white/20 shadow-md font-semibold"
                      : isScrolled
                      ? "text-foreground/60 hover:text-foreground hover:bg-accent/30"
                      : "text-white/70 hover:text-white hover:font-medium hover:bg-white/10"
                  }`}
                >
                  <a href="/about">About</a>
                </li>
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled
                  ? "text-foreground hover:bg-background/10"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* CTA Button */}
            {/* Show Contact Us button only on large screens (lg and up) */}
            <div className={`hidden lg:flex flex-row items-center gap-1 md:gap-3 shrink-0`}>
              <motion.div className="flex items-center space-x-6">
                <motion.button
                  className={`bg-gradient-orange text-background inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 transition-all bg-primary text-primary-foreground hover:bg-primary/90 primary h-9 px-4 py-2 flex items-center ${"shadow-orange-glow"}`}
                  onClick={() => setIsContactModalOpen(true)}
                >
                  <span className="relative z-10">Contact Us</span>
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div
              className={`lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl border transition-all duration-300 ${
                isScrolled
                  ? "bg-background/95 border-border/20 backdrop-blur-lg"
                  : "bg-background/95 border-border/20 backdrop-blur-lg"
              }`}
            >
              <div className="p-4 space-y-2">
                {/* Mobile Services Dropdown */}
                <div className="w-full">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setIsMobileServicesOpen(prev => !prev);
                    }}
                    className={`w-full flex justify-between items-center text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === "Services"
                        ? "text-foreground bg-accent/20 border border-border/20"
                        : "text-foreground hover:bg-accent/10"
                    }`}
                  >
                    <span>Services</span>
                    <svg className={`w-4 h-4 ml-2 transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {/* Dropdown content for mobile */}
                  {isMobileServicesOpen && (
                    <div className="mt-2 rounded-lg border border-border/20 bg-background/95 shadow-lg max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-transparent">
                      <ul className="py-2">
                        <li>
                          <button className="w-full text-left px-5 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-orange-500 hover:text-white focus:bg-orange-600 focus:text-white" onClick={e => {e.stopPropagation(); handleNavClick("/customer-service");}}>Customer Service</button>
                        </li>
                        <li><div className="mx-5 my-1 h-px bg-border/30" /></li>
                        <li>
                          <button className="w-full text-left px-5 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-orange-500 hover:text-white focus:bg-orange-600 focus:text-white" onClick={e => {e.stopPropagation(); handleNavClick("/financial-reporting");}}>Financial Reporting</button>
                        </li>
                        <li><div className="mx-5 my-1 h-px bg-border/30" /></li>
                        <li>
                          <button className="w-full text-left px-5 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-orange-500 hover:text-white focus:bg-orange-600 focus:text-white" onClick={e => {e.stopPropagation(); handleNavClick("/marketing-automation");}}>Marketing Automation</button>
                        </li>
                        <li><div className="mx-5 my-1 h-px bg-border/30" /></li>
                        <li>
                          <button className="w-full text-left px-5 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-orange-500 hover:text-white focus:bg-orange-600 focus:text-white" onClick={e => {e.stopPropagation(); handleNavClick("/product-management");}}>Product Management</button>
                        </li>
                        <li><div className="mx-5 my-1 h-px bg-border/30" /></li>
                        <li>
                          <button className="w-full text-left px-5 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-orange-500 hover:text-white focus:bg-orange-600 focus:text-white" onClick={e => {e.stopPropagation(); handleNavClick("/inventory");}}>Inventory</button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                {/* ...existing code for other mobile nav items... */}
                <button
                  onClick={() => handleNavClick("#integrations")}
                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === "Integrations"
                      ? "text-foreground bg-accent/20 border border-border/20"
                      : "text-foreground/60 hover:text-foreground hover:bg-accent/10"
                  }`}
                >
                  Integrations
                </button>
                <button
                  onClick={() => handleNavClick("#solutions")}
                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === "Solutions"
                      ? "text-foreground bg-accent/20 border border-border/20"
                      : "text-foreground/60 hover:text-foreground hover:bg-accent/10"
                  }`}
                >
                  Solutions
                </button>
                <a
                  href="/about"
                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === "About"
                      ? "text-foreground bg-accent/20 border border-border/20"
                      : "text-foreground/60 hover:text-foreground hover:bg-accent/10"
                  }`}
                >
                  About Us
                </a>
                <div className="pt-2 border-t border-border/20">
                  <button
                    onClick={() => {setIsContactModalOpen(true);setIsMobileMenuOpen(false);}}
                    className="w-full px-4 py-3 text-sm font-medium text-center glass-card rounded-lg transition-colors"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ContactModal
        open={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </header>
  );
}
