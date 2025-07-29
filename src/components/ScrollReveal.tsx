import { useEffect } from 'react';

const ScrollReveal = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '-50px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-reveal class
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      scrollElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  return null;
};

export default ScrollReveal;