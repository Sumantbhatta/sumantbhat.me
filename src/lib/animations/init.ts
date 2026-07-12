// src/lib/animations/init.ts
// Central animation initializer - runs once on page load
import Lenis from "lenis";

let globalLenis: any = null;
let globalLenisTicker: ((time: number) => void) | null = null;

export function cleanupAnimations() {
  if (typeof window === "undefined") return;
  const gsap = (window as any).gsap;
  if (!gsap) return;

  const ScrollTrigger = (window as any).ScrollTrigger;
  if (ScrollTrigger) {
    // kill(true) forces pinned elements to revert their inline styles
    ScrollTrigger.getAll().forEach((t: any) => t.kill(true));
    ScrollTrigger.clearMatchMedia();
  }

  if (globalLenis) {
    if (globalLenisTicker) {
      gsap.ticker.remove(globalLenisTicker);
      globalLenisTicker = null;
    }
    globalLenis.destroy();
    globalLenis = null;
  }
}

export function initAllAnimations() {
  if (typeof window === "undefined") return;

  const gsap = (window as any).gsap;
  if (!gsap) return;

  // GSAP plugins
  const { ScrollTrigger, SplitText, Flip } = window as any;

  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  if (Flip) gsap.registerPlugin(Flip);

  // Initialize Lenis for smooth scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom premium easing curve
    smoothWheel: true,
    wheelMultiplier: 1, // Normalized wheel scrolling
    touchMultiplier: 2, // Natural touch drag
  });
  globalLenis = lenis;

  if (ScrollTrigger) {
    // Disable native scroll restoration to prevent jumping/locking on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Force scroll to top on initial load
    window.scrollTo(0, 0);

    lenis.on('scroll', ScrollTrigger.update);
    globalLenisTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(globalLenisTicker);
    gsap.ticker.lagSmoothing(0);
  }

  // Fire all inits
  initFOUCPrevention();
  initHeaderTheme();
  initHamburger();
  initAccordions();
  initDescriptionToggle();
  initProductMediaGallery();
  initProductSliderDots();
  initSourcingCardHover();

  if (typeof document !== "undefined") {
    document.fonts.ready.then(() => {
      if (SplitText && ScrollTrigger) {
        initMaskTextScrollReveal();
      }
      if (ScrollTrigger) {
        initContentRevealScroll();
        initFeaturedProductsScroll();
        initParallax();
        
        // Final refresh to ensure all bounding boxes and heights are correct after DOM/fonts settle
        ScrollTrigger.refresh();
      }
    });
  }

  if (SplitText && ScrollTrigger && Flip) {
    setTimeout(() => {
      initFlipOnScroll();
    }, 100);
  }

  if (ScrollTrigger) {
    initHeroOverlay();
  }
}

// ─── Parallax ────────────────────────────────────────────────────
function initParallax() {
  const gsap = (window as any).gsap;
  const ScrollTrigger = (window as any).ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  const mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", () => {
    document.querySelectorAll<HTMLElement>("[data-scroll-speed]").forEach((el) => {
      const speed = parseFloat(el.getAttribute("data-scroll-speed") || "0");
      if (!speed) return;

      // Locomotive scroll uses speed roughly as Y movement, GSAP parallax needs similar feel
      const yValue = speed * -150;

      gsap.to(el, {
        y: yValue,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => { };
  });
}

// ─── FOUC Prevention ────────────────────────────────────────────
function initFOUCPrevention() {
  document.body.classList.add("ready");
}

// ─── Header Theme ────────────────────────────────────────────────
function initHeaderTheme() {
  const header = document.querySelector(".navigation") as HTMLElement | null;
  if (!header) return;

  const sections = document.querySelectorAll<HTMLElement>("[data-header-theme]");
  const defaultTheme = "light";

  const updateHeaderTheme = () => {
    let activeTheme = defaultTheme;
    const checkY = 20;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= checkY && rect.bottom >= checkY) {
        activeTheme = section.dataset.headerTheme || defaultTheme;
        break;
      }
    }

    if (header.dataset.headerTheme !== activeTheme) {
      header.setAttribute("data-header-theme", activeTheme);
    }
  };

  window.addEventListener("scroll", updateHeaderTheme, { passive: true });
  window.addEventListener("resize", updateHeaderTheme);
  updateHeaderTheme();
}

// ─── Hamburger ───────────────────────────────────────────────────
function initHamburger() {
  const nav = document.querySelector("[data-navigation]") as HTMLElement | null;
  const hamburger = document.querySelector("[data-hamburger-toggle]") as HTMLButtonElement | null;
  const mobileMenu = document.querySelector("[data-mobile-menu]") as HTMLElement | null;

  if (!hamburger || !mobileMenu || !nav) return;

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.contains("is-open");
    if (isOpen) {
      hamburger.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
      nav.classList.remove("menu-open");
      document.body.style.overflow = "";
    } else {
      hamburger.classList.add("is-open");
      hamburger.setAttribute("aria-expanded", "true");
      mobileMenu.classList.add("is-open");
      nav.classList.add("menu-open");
      document.body.style.overflow = "hidden";
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
      nav.classList.remove("menu-open");
      document.body.style.overflow = "";
    });
  });
}

// ─── Text Mask Reveal ────────────────────────────────────────────
function showElementsImmediately(scope: Document | Element = document) {
  scope.querySelectorAll<HTMLElement>('[data-split="heading"]').forEach((el) => {
    (el as any).style.visibility = "visible";
  });
}

export function initMaskTextScrollReveal(scope: Document | Element = document) {
  const gsap = (window as any).gsap;
  const SplitText = (window as any).SplitText;
  const ScrollTrigger = (window as any).ScrollTrigger;
  if (!gsap || !SplitText || !ScrollTrigger) return;

  const splitConfig: Record<string, { duration: number; stagger: number }> = {
    lines: { duration: 2, stagger: 0.2 },
    words: { duration: 1.5, stagger: 0.15 },
    chars: { duration: 1, stagger: 0.03 },
  };

  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    scope.querySelectorAll<HTMLElement>('[data-split="heading"]').forEach((heading) => {
      gsap.set(heading, { autoAlpha: 1 });
      const type = (heading.dataset.splitReveal || "lines") as "lines" | "words" | "chars";
      const typesToSplit =
        type === "lines"
          ? ["lines"]
          : type === "words"
            ? ["lines", "words"]
            : ["lines", "words", "chars"];
      const triggerType = heading.dataset.splitType || "scroll";
      const delay = parseFloat(heading.dataset.splitDelay || "0") || 0;
      const scrollStart = heading.dataset.splitStart || "clamp(top 80%)";

      SplitText.create(heading, {
        type: typesToSplit.join(", "),
        mask: "lines",
        autoSplit: true,
        linesClass: "line",
        wordsClass: "word",
        charsClass: "letter",
        onSplit: (instance: any) => {
          const targets = instance[type];
          const config = splitConfig[type];
          const animationConfig: Record<string, unknown> = {
            yPercent: 110,
            duration: config.duration,
            stagger: config.stagger,
            ease: "expo.out",
            delay,
          };
          if (triggerType === "scroll") {
            animationConfig.scrollTrigger = {
              trigger: heading,
              start: scrollStart,
              once: true,
            };
          }
          return gsap.from(targets, animationConfig);
        },
      });
    });
    return () => { };
  });

  mm.add("(max-width: 767px)", () => {
    showElementsImmediately(scope);
    return () => { };
  });
}

// ─── Content Reveal ──────────────────────────────────────────────
export function initContentRevealScroll(scope: Document | Element = document) {
  const gsap = (window as any).gsap;
  const ScrollTrigger = (window as any).ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    scope.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((groupEl) => {
      const triggerType = groupEl.getAttribute("data-reveal-group") || "scroll";
      const groupStaggerSec = (parseFloat(groupEl.getAttribute("data-stagger") || "200") || 200) / 1000;
      const groupDistance = groupEl.getAttribute("data-distance") || "2rem";
      const triggerStart = groupEl.getAttribute("data-start") || "clamp(top 80%)";
      const groupDelay = parseFloat(groupEl.getAttribute("data-delay") || "0") || 0;
      const animDuration = 1;
      const animEase = "expo.out";

      if (prefersReduced) {
        gsap.set(groupEl, { clearProps: "all", y: 0, autoAlpha: 1 });
        return;
      }

      const directChildren = Array.from(groupEl.children).filter(
        (el) => el.nodeType === 1
      ) as HTMLElement[];

      if (!directChildren.length) {
        gsap.set(groupEl, { y: groupDistance, autoAlpha: 0 });
        const animateSelf = () =>
          gsap.to(groupEl, {
            y: 0,
            autoAlpha: 1,
            duration: animDuration,
            ease: animEase,
            delay: groupDelay,
            onComplete: () => gsap.set(groupEl, { clearProps: "all" }),
          });

        if (triggerType === "load") {
          animateSelf();
        } else {
          ScrollTrigger.create({
            trigger: groupEl,
            start: triggerStart,
            once: true,
            onEnter: animateSelf,
          });
        }
        return;
      }

      directChildren.forEach((child) => {
        gsap.set(child, { y: groupDistance, autoAlpha: 0 });
      });

      const animateSlots = () => {
        const tl = gsap.timeline();
        directChildren.forEach((child, i) => {
          const slotTime = groupDelay + i * groupStaggerSec;
          tl.to(
            child,
            {
              y: 0,
              autoAlpha: 1,
              duration: animDuration,
              ease: animEase,
              onComplete: () => gsap.set(child, { clearProps: "all" }),
            },
            slotTime
          );
        });
      };

      if (triggerType === "load") {
        animateSlots();
      } else {
        ScrollTrigger.create({
          trigger: groupEl,
          start: triggerStart,
          once: true,
          onEnter: animateSlots,
        });
      }
    });
    return () => { };
  });

  mm.add("(max-width: 767px)", () => {
    scope.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((groupEl) => {
      gsap.set(groupEl, { clearProps: "all", y: 0, autoAlpha: 1 });
      Array.from(groupEl.children).forEach((child) => {
        gsap.set(child as HTMLElement, { clearProps: "all", y: 0, autoAlpha: 1 });
      });
    });
    return () => { };
  });
}

// ─── Logo Flip ───────────────────────────────────────────────────
export function initFlipOnScroll() {
  const gsap = (window as any).gsap;
  const ScrollTrigger = (window as any).ScrollTrigger;
  const Flip = (window as any).Flip;
  if (!gsap || !ScrollTrigger || !Flip) return;

  const heroWrapper = document.querySelector("[data-flip-element='wrapper-hero']");
  const navWrapper = document.querySelector("[data-flip-element='wrapper-nav']");
  const targetEl = document.querySelector("[data-flip-element='target']");

  if (!heroWrapper || !navWrapper || !targetEl) return;

  (navWrapper as HTMLElement).innerHTML = "";
  const state = Flip.getState(targetEl);
  navWrapper.appendChild(targetEl);
  (navWrapper as HTMLElement).style.pointerEvents = "none";

  const flipAnim = Flip.from(state, { scale: true, duration: 1, ease: "none" });

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "500px top",
    scrub: true,
    animation: flipAnim,
    onUpdate: (self: any) => {
      if (self.progress >= 0.95) {
        (navWrapper as HTMLElement).style.pointerEvents = "auto";
      } else {
        (navWrapper as HTMLElement).style.pointerEvents = "none";
      }
    },
  });

  ScrollTrigger.refresh();
}

// ─── Featured Products Scroll ────────────────────────────────────
export function initFeaturedProductsScroll(scope: Document | Element = document) {
  const gsap = (window as any).gsap;
  const ScrollTrigger = (window as any).ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  const sections = scope.querySelectorAll<HTMLElement>(".product-row");
  if (sections.length === 0) return;

  const sectionId = sections[0].dataset.sectionId;
  if (!sectionId) return;

  const titleEl = scope.querySelector<HTMLElement>(`#product-title-${sectionId}`);
  const priceEl = scope.querySelector<HTMLElement>(`#product-price-${sectionId}`);
  const subtitleEl = scope.querySelector<HTMLElement>(`#product-subtitle-${sectionId}`);
  const sourcingEl = scope.querySelector<HTMLElement>(`#sourcing-tag-${sectionId}`);
  const fixedInfo = scope.querySelector<HTMLAnchorElement>(`#fixed-product-info-${sectionId}`);
  const appLinkEl = scope.querySelector<HTMLAnchorElement>(`#fixed-product-app-link-${sectionId}`);

  if (!titleEl || !priceEl || !subtitleEl || !sourcingEl || !fixedInfo) return;

  let currentIndex = 0;
  let isInitialized = false;

  const animateTextChange = (element: HTMLElement, newText: string) => {
    const timeline = gsap.timeline();
    return timeline
      .to(element, { yPercent: -20, opacity: 0, duration: 0.3, ease: "power2.in" })
      .call(() => { element.textContent = newText; })
      .to(element, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power2.out", clearProps: "opacity" });
  };

  const updateContent = (index: number, shouldAnimate = true) => {
    if (index === currentIndex && isInitialized) return;
    currentIndex = index;

    const productRow = sections[index];
    const title = productRow.dataset.productTitle || "";
    const price = productRow.dataset.productPrice || "";
    const subtitle = productRow.dataset.productSubtitle || "";
    const sourcing = productRow.dataset.productSourcing || "";
    const url = productRow.dataset.productUrl || "";
    const appUrl = productRow.dataset.productAppUrl || "";

    if (url) fixedInfo.href = url;
    
    if (appLinkEl) {
      if (appUrl) {
        appLinkEl.href = appUrl;
        appLinkEl.classList.remove("hidden");
        appLinkEl.classList.add("flex");
      } else {
        appLinkEl.classList.add("hidden");
        appLinkEl.classList.remove("flex");
      }
    }

    if (!shouldAnimate) {
      titleEl.textContent = title;
      priceEl.textContent = price;
      subtitleEl.textContent = subtitle;
      sourcingEl.textContent = sourcing;
      isInitialized = true;
      return;
    }

    gsap
      .timeline()
      .add(animateTextChange(titleEl, title), 0)
      .add(animateTextChange(priceEl, price), 0.05)
      .add(animateTextChange(subtitleEl, subtitle), 0.1)
      .add(animateTextChange(sourcingEl, sourcing), 0);
    isInitialized = true;
  };

  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => updateContent(index),
      onEnterBack: () => updateContent(index),
    });
  });

  updateContent(0, false);

  // Mobile Project Reveal
  const mobileProjects = scope.querySelectorAll<HTMLElement>(".mobile-project-reveal");
  mobileProjects.forEach((proj) => {
    gsap.fromTo(
      proj,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: proj,
          start: "top 85%",
        },
      }
    );
  });

  // Parallax for side images
  const parallaxImages = scope.querySelectorAll<HTMLElement>(".project-parallax-img");
  parallaxImages.forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -15 },
      {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: img.closest(".product-row") || img.closest(".group"),
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });

  // Pin animation for the central card
  const productPin = scope.querySelector<HTMLElement>("[data-featured-product-pin]");
  const pinContainer = productPin?.parentElement; // The absolute overlay div

  if (productPin && pinContainer) {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      let scrollTriggerInstance: any = null;

      function setupPinAnimation() {
        if (!productPin || !pinContainer) return;

        if (scrollTriggerInstance) {
          scrollTriggerInstance.kill();
        }

        const splitSection = document.getElementById("split-section");
        const realInfoCard = document.getElementById("real-info-card");

        // Calculate total travel distance to fake a pin.
        // It needs to travel down the height of the pinContainer PLUS the distance into SplitSection.
        // We want it to stay pinned until the bottom of SplitSection.
        const containerHeight = pinContainer.offsetHeight;
        const splitHeight = splitSection ? splitSection.offsetHeight : 0;
        
        // The total scrollable distance is the height of the projects container + split section
        // We subtract pinHeight so it stops exactly at the bottom of the track.
        const pinHeight = productPin.offsetHeight;
        
        // Instead of calculating a static yPercent which is error prone across sections,
        // we can just use `y` with a function that calculates the distance.
        const animation = gsap.to(productPin, {
          y: () => (pinContainer.offsetHeight + (splitSection ? splitSection.offsetHeight : 0)) - productPin.offsetHeight,
          ease: "none",
          scrollTrigger: {
            trigger: productPin,
            start: "bottom+=10% bottom",
            endTrigger: splitSection || pinContainer,
            end: "bottom bottom-=10%",
            scrub: true, // perfect 1:1 scrubbing to mimic a pin
            invalidateOnRefresh: true, // recalculate on resize
          },
        });

        scrollTriggerInstance = animation.scrollTrigger;

        // Add a secondary ScrollTrigger to toggle the morphing class when the card enters SplitSection
        if (splitSection && realInfoCard) {
          ScrollTrigger.create({
            trigger: splitSection,
            start: "top center", // when SplitSection reaches center of screen
            end: "bottom top", 
            toggleClass: { targets: realInfoCard, className: "morph-explore" }
          });
        }
      }

      setupPinAnimation();

      let resizeTimeout: ReturnType<typeof setTimeout>;
      const resizeHandler = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          setupPinAnimation();
          ScrollTrigger.refresh();
        }, 150);
      };
      window.addEventListener("resize", resizeHandler);

      return () => {
        window.removeEventListener("resize", resizeHandler);
        if (scrollTriggerInstance) {
          scrollTriggerInstance.kill();
        }
        gsap.set(productPin, { clearProps: "all" });
      };
    });
  }
}

// ─── Hero Overlay ────────────────────────────────────────────────
function initHeroOverlay() {
  const gsap = (window as any).gsap;
  const ScrollTrigger = (window as any).ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  const overlay = document.querySelector<HTMLElement>("[data-scroll-event-progress]");
  if (!overlay) return;

  ScrollTrigger.create({
    trigger: overlay.closest("section") || document.body,
    start: "top top",
    end: "bottom top",
    scrub: true,
    onUpdate: (self: any) => {
      overlay.style.opacity = String(Math.min(self.progress * 0.8, 0.8));
    },
  });
}

// ─── Accordion ───────────────────────────────────────────────────
function initAccordions() {
  document.querySelectorAll<HTMLElement>("[data-accordion-css-init]").forEach((container) => {
    const closeSiblings = container.getAttribute("data-accordion-close-siblings") === "true";

    container.querySelectorAll<HTMLElement>("[data-accordion-toggle]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const item = toggle.closest<HTMLElement>("[data-accordion-status]");
        if (!item) return;

        const isActive = item.getAttribute("data-accordion-status") === "active";

        if (closeSiblings) {
          container.querySelectorAll<HTMLElement>("[data-accordion-status]").forEach((sibling) => {
            sibling.setAttribute("data-accordion-status", "not-active");
          });
        }

        item.setAttribute("data-accordion-status", isActive ? "not-active" : "active");
      });
    });
  });
}

// ─── Description toggle ──────────────────────────────────────────
function initDescriptionToggle() {
  document.querySelectorAll<HTMLButtonElement>("[data-description-toggle]").forEach((btn) => {
    const content = btn.closest(".regular")?.querySelector<HTMLElement>("[data-description-content]");
    const gradient = btn.closest(".regular")?.querySelector<HTMLElement>("[data-description-gradient]");
    if (!content) return;

    btn.addEventListener("click", () => {
      const isTruncated = content.dataset.truncated === "true";
      if (isTruncated) {
        content.style.maxHeight = "none";
        content.dataset.truncated = "false";
        btn.textContent = btn.dataset.readLessText || "Read less";
        if (gradient) gradient.style.opacity = "0";
      } else {
        content.style.maxHeight = "3.6rem";
        content.dataset.truncated = "true";
        btn.textContent = btn.dataset.readMoreText || "Read more";
        if (gradient) gradient.style.opacity = "1";
      }
    });
  });
}

// ─── Product media gallery (desktop thumbnails) ──────────────────
function initProductMediaGallery() {
  document.querySelectorAll<HTMLButtonElement>("[data-target-media-id]").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const targetId = thumb.dataset.targetMediaId;
      if (!targetId) return;

      const mediaEl = document.getElementById(`media-${targetId}`);
      if (!mediaEl) return;

      mediaEl.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

// ─── Mobile product slider dots ──────────────────────────────────
function initProductSliderDots() {
  const slider = document.querySelector<HTMLElement>("[data-product-slider]");
  const dots = document.querySelectorAll<HTMLButtonElement>("[data-slider-dot]");
  if (!slider || !dots.length) return;

  const updateActiveDot = (index: number) => {
    dots.forEach((d) => d.classList.replace("bg-black", "bg-gray/40"));
    dots[index]?.classList.replace("bg-gray/40", "bg-black");
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const i = parseInt(dot.dataset.sliderDot || "0");
      const slide = slider.querySelector<HTMLElement>(`[data-slide-index="${i}"]`);
      if (slide) slider.scrollLeft = slide.offsetLeft;
      updateActiveDot(i);
    });
  });

  slider.addEventListener("scroll", () => {
    const index = Math.round(slider.scrollLeft / slider.clientWidth);
    updateActiveDot(index);
  });
}

// ─── Sourcing card hover ─────────────────────────────────────────
function initSourcingCardHover() {
  const gsap = (window as any).gsap;
  if (!gsap) return;

  const cards = document.querySelectorAll<HTMLElement>("[data-sourcing-card]");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      cards.forEach((other) => {
        if (other !== card) {
          gsap.to(other, { opacity: 0.3, duration: 0.5, ease: "power2.out" });
          gsap.set(other, { zIndex: 1 });
        } else {
          gsap.to(card, { duration: 0.5, ease: "power2.out" });
          gsap.set(card, { zIndex: 10 });
        }
      });
    });
    card.addEventListener("mouseleave", () => {
      cards.forEach((other) => {
        gsap.to(other, { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.set(other, { zIndex: 1 });
      });
    });
  });
}
