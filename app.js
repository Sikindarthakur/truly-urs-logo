/* ==========================================================================
   Truly Ur's Brand Showcase - JavaScript Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // 1. Populate Logo Gallery
    // -------------------------------------------------------------
    const logosGrid = document.getElementById("logos-grid-container");
    
    // Grid A: Cropped logos from the first sheet (9 logos)
    const gridALogos = [
        { id: "Concept A-1", tag: "Circular Brandmark", file: "logo_a_1.webp" },
        { id: "Concept A-2", tag: "Minimal Monogram", file: "logo_a_2.webp" },
        { id: "Concept A-3", tag: "Heart Face Outline", file: "logo_a_3.webp" },
        { id: "Concept A-4", tag: "Solid Silhouette", file: "logo_a_4.webp" },
        { id: "Concept A-5", tag: "Leaf Monogram", file: "logo_a_5.webp" },
        { id: "Concept A-6", tag: "Sprout Stem Emblem", file: "logo_a_6.webp" },
        { id: "Concept A-7", tag: "Swooping Hearts", file: "logo_a_7.webp" },
        { id: "Concept A-8", tag: "Cradling Hands", file: "logo_a_8.webp" },
        { id: "Concept A-9", tag: "Sprouting Monogram", file: "logo_a_9.webp" }
    ];

    // Grid B: Cropped logos from the second sheet (9 logos)
    const gridBLogos = [
        { id: "Concept B-1", tag: "Sage Crescent", file: "logo_b_1.webp" },
        { id: "Concept B-2", tag: "Empathy Monogram", file: "logo_b_2.webp" },
        { id: "Concept B-3", tag: "Sprouting Accent", file: "logo_b_3.webp" },
        { id: "Concept B-4", tag: "Heart Ring Gradient", file: "logo_b_4.webp" },
        { id: "Concept B-5", tag: "Lotus Monogram", file: "logo_b_5.webp" },
        { id: "Concept B-6", tag: "Gold Infinity Foil", file: "logo_b_6.webp" },
        { id: "Concept B-7", tag: "Profile Monogram", file: "logo_b_7.webp" },
        { id: "Concept B-8", tag: "App Icon Gradient", file: "logo_b_8.webp" },
        { id: "Concept B-9", tag: "Support Crescent", file: "logo_b_9.webp" }
    ];

    // Build logo card elements
    function createLogoCard(logo) {
        const path = `logos/cropped/${logo.file}`;
        const card = document.createElement("div");
        card.className = "logo-card";
        card.setAttribute("data-logo-path", path);
        card.setAttribute("data-logo-name", logo.id);
        
        card.innerHTML = `
            <div class="logo-card-inner">
                <div class="logo-img-wrapper">
                    <img src="${path}" alt="${logo.id}" loading="lazy">
                </div>
                <div class="logo-card-info">
                    <span class="logo-id">${logo.id}</span>
                    <span class="logo-tag">${logo.tag}</span>
                </div>
            </div>
            <div class="logo-select-indicator"><i class="fa-solid fa-circle-check"></i></div>
        `;
        return card;
    }

    // Append Grid A logos
    gridALogos.forEach(logo => {
        logosGrid.appendChild(createLogoCard(logo));
    });

    // Append Grid B logos
    gridBLogos.forEach(logo => {
        logosGrid.appendChild(createLogoCard(logo));
    });

    // -------------------------------------------------------------
    // 2. Active Logo State & Live Mockup Synchronization
    // -------------------------------------------------------------
    const logoCards = document.querySelectorAll(".logo-card");
    const selectedCountText = document.getElementById("selected-count-text");
    const dynamicLogos = document.querySelectorAll(".dynamic-logo-img");

    logoCards.forEach(card => {
        card.addEventListener("click", () => {
            // Remove active state from all cards
            logoCards.forEach(c => c.classList.remove("active-logo"));
            
            // Add active state to clicked card
            card.classList.add("active-logo");
            
            const logoPath = card.getAttribute("data-logo-path");
            const logoName = card.getAttribute("data-logo-name");
            
            // Update info text
            selectedCountText.innerHTML = `Active Logo: <strong>${logoName}</strong>`;
            
            // Update all dynamic mockup logo images with a fade transition effect
            dynamicLogos.forEach(img => {
                // Check if it's the business card front logo (which uses a special CSS tint filter)
                if (img.classList.contains("logo-tint-coral")) {
                    // For the business card front, we tint white if the logo is a concept with white/dark background
                    // In this case, the CSS class handles the tinting filter
                }
                
                // Animate change
                img.style.opacity = 0;
                setTimeout(() => {
                    img.src = logoPath;
                    img.style.opacity = 1;
                }, 150);
            });
        });
    });

    // Add smooth transition style to mockup images
    dynamicLogos.forEach(img => {
        img.style.transition = "opacity 0.2s ease-in-out";
    });

    // -------------------------------------------------------------
    // 3. Gallery Background Switcher
    // -------------------------------------------------------------
    const bgBtns = document.querySelectorAll(".bg-btn");

    bgBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active from all buttons
            bgBtns.forEach(b => b.classList.remove("active"));
            
            // Add active to clicked button
            btn.classList.add("active");
            
            const themeColor = btn.getAttribute("data-color");
            
            // Remove previous background classes
            logosGrid.classList.remove("bg-theme-light", "bg-theme-dark", "bg-theme-brand");
            
            // Add new background class
            logosGrid.classList.add(`bg-theme-${themeColor}`);
        });
    });

    // -------------------------------------------------------------
    // 4. Dark/Light Theme Toggle
    // -------------------------------------------------------------
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = themeToggle.querySelector("i");
    
    // Check local storage for preference
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeIcon.classList.replace("fa-moon", "fa-sun");
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        
        let theme = "light";
        if (document.body.classList.contains("dark-theme")) {
            theme = "dark";
            themeIcon.classList.replace("fa-moon", "fa-sun");
        } else {
            themeIcon.classList.replace("fa-sun", "fa-moon");
        }
        
        localStorage.setItem("theme", theme);
    });

    // -------------------------------------------------------------
    // 5. Copy Brand Color Code to Clipboard
    // -------------------------------------------------------------
    const copyBtns = document.querySelectorAll(".btn-copy");
    const toast = document.getElementById("toast");

    copyBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Avoid triggering any card selection if inside a card
            
            const colorBlock = btn.closest(".color-block");
            const hexCode = colorBlock.getAttribute("data-color");
            
            navigator.clipboard.writeText(hexCode).then(() => {
                // Show toast notification
                toast.innerText = `Copied ${hexCode} to clipboard!`;
                toast.classList.add("show");
                
                setTimeout(() => {
                    toast.classList.remove("show");
                }, 2000);
            }).catch(err => {
                console.error("Failed to copy text: ", err);
            });
        });
    });

    // -------------------------------------------------------------
    // 6. Intersection Observer for Scroll Reveals
    // -------------------------------------------------------------
    const revealSections = document.querySelectorAll("section");
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("section-revealed");
                // Optional: Stop observing after it has revealed
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% is visible
        rootMargin: "0px 0px -50px 0px" // offset bottom slightly
    });

    revealSections.forEach(section => {
        // Add setup style for reveal
        section.style.opacity = "0";
        section.style.transform = "translateY(40px)";
        section.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        
        revealObserver.observe(section);
    });

    // Custom CSS style helper for revealed state
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .section-revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Explicitly reveal hero since it's above the fold
    setTimeout(() => {
        const heroSection = document.getElementById("hero");
        heroSection.classList.add("section-revealed");
    }, 100);
});
