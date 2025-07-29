import { useEffect, useState } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate 2% of the total scroll height
      const scrollThreshold = document.documentElement.scrollHeight * 0.002;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] flex justify-center transition-all duration-300 py-4 ${isScrolled ? 'backdrop-blur-md bg-background/80' : ''}`}>
      <div style={{ width: isScrolled ? "800px" : "70rem" }} className="transition-all duration-300">
        <div
          className={`mx-auto max-w-7xl rounded-2xl transition-all duration-300 xl:px-0 ${
            isScrolled
              ? "px-2 border border-border backdrop-blur-lg bg-background/75"
              : "shadow-none px-7"
          }`}
        >
          <div className="flex h-[56px] items-center justify-between p-4">
            <a className="flex items-center gap-1" href="/">
              <span className="text-2xl font-bold text-foreground whitespace-nowrap">
                <strong>Lune</strong>xa
              </span>
            </a>
            
            <div className="w-full hidden md:block">
              <ul className="relative mx-auto flex w-fit rounded-full h-11 px-2 items-center justify-center">
                <li className="z-10 cursor-pointer h-full flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors duration-200 text-foreground tracking-tight">
                  <a onClick={() => scrollToSection('#top')}>Services</a>
                </li>
                <li className="z-10 cursor-pointer h-full flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors duration-200 text-foreground-muted hover:text-foreground tracking-tight">
                  <a onClick={() => scrollToSection('#integrations')}>Integrations</a>
                </li>
                <li className="z-10 cursor-pointer h-full flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors duration-200 text-foreground-muted hover:text-foreground tracking-tight">
                  <a onClick={() => scrollToSection('#solutions')}>Solutions</a>
                </li>
                <li className="z-10 cursor-pointer h-full flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors duration-200 text-foreground-muted hover:text-foreground tracking-tight">
                  <a onClick={() => scrollToSection('#about')}>About</a>
                </li>
                <li
                  className="absolute inset-0 my-1.5 rounded-full bg-accent/60 border border-border"
                  style={{ left: "8px", width: "68.8594px" }}
                ></li>
              </ul>
            </div>

            <div className="flex flex-row items-center gap-1 md:gap-3 shrink-0">
              <div className="flex items-center space-x-6">
                <a
                  className="relative z-10 glass-card py-1 px-4 h-full flex items-center justify-center group overflow-hidden hover:text-foreground"
                  href="#join"
                >
                  Get a Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;