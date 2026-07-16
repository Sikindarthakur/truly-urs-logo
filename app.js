/* ==========================================================================
   Truly Ur's Brand Showcase - JavaScript Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // 1. Populate Logo Gallery
    // -------------------------------------------------------------
    const logosGrid = document.getElementById("logos-grid-container");
    
    // Fallback list of logos (including the new ones)
    const fallbackLogos = [
        { id: "Primary Logo", tag: "Main Brandmark", file: "logo_main.png" },
        { id: "Concept A-1", tag: "Circular Brandmark", file: "logo_a_1.png" },
        { id: "Concept A-2", tag: "Minimal Monogram", file: "logo_a_2.png" },
        { id: "Concept A-3", tag: "Heart Face Outline", file: "logo_a_3.png" },
        { id: "Concept A-4", tag: "Solid Silhouette", file: "logo_a_4.png" },
        { id: "Concept A-5", tag: "Leaf Monogram", file: "logo_a_5.png" },
        { id: "Concept A-6", tag: "Sprout Stem Emblem", file: "logo_a_6.png" },
        { id: "Concept A-7", tag: "Swooping Hearts", file: "logo_a_7.png" },
        { id: "Concept A-8", tag: "Cradling Hands", file: "logo_a_8.png" },
        { id: "Concept A-9", tag: "Sprouting Monogram", file: "logo_a_9.png" },
        { id: "Concept B-1", tag: "Sage Crescent", file: "logo_b_1.png" },
        { id: "Concept B-2", tag: "Empathy Monogram", file: "logo_b_2.png" },
        { id: "Concept B-3", tag: "Sprouting Accent", file: "logo_b_3.png" },
        { id: "Concept B-4", tag: "Heart Ring Gradient", file: "logo_b_4.png" },
        { id: "Concept B-5", tag: "Lotus Monogram", file: "logo_b_5.png" },
        { id: "Concept B-6", tag: "Gold Infinity Foil", file: "logo_b_6.png" },
        { id: "Concept B-7", tag: "Profile Monogram", file: "logo_b_7.png" },
        { id: "Concept B-8", tag: "App Icon Gradient", file: "logo_b_8.png" },
        { id: "Concept B-9", tag: "Support Crescent", file: "logo_b_9.png" },
        { id: "Single Logo 1", tag: "Custom Concept 1", file: "logo_single_1_68c07e2c-8f8b-4.png" },
        { id: "Single Logo 2", tag: "Custom Concept 2", file: "logo_single_2_ChatGPTImageJul.png" },
        { id: "Single Logo 3", tag: "Custom Concept 3", file: "logo_single_3_ChatGPTImageJul.png" }
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

    async function initializeGallery() {
        let logos = [];
        try {
            const response = await fetch("logos/cropped/");
            if (!response.ok) throw new Error("Fetch listing failed");
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            
            const links = Array.from(doc.querySelectorAll("a"))
                .map(a => a.getAttribute("href"))
                .filter(href => href && href.endsWith(".png"));
                
            if (links.length > 0) {
                const uniqueFiles = [...new Set(links)];
                
                logos = uniqueFiles.map(file => {
                    let id = file;
                    let tag = "Custom Concept";
                    
                    if (file === "logo_main.png") {
                        id = "Primary Logo";
                        tag = "Main Brandmark";
                    } else if (file.startsWith("logo_a_")) {
                        const num = file.replace("logo_a_", "").replace(".png", "");
                        id = `Concept A-${num}`;
                        const aTags = ["Circular Brandmark", "Minimal Monogram", "Heart Face Outline", "Solid Silhouette", "Leaf Monogram", "Sprout Stem Emblem", "Swooping Hearts", "Cradling Hands", "Sprouting Monogram"];
                        tag = aTags[parseInt(num) - 1] || "Alternate Concept";
                    } else if (file.startsWith("logo_b_")) {
                        const num = file.replace("logo_b_", "").replace(".png", "");
                        id = `Concept B-${num}`;
                        const bTags = ["Sage Crescent", "Empathy Monogram", "Sprouting Accent", "Heart Ring Gradient", "Lotus Monogram", "Gold Infinity Foil", "Profile Monogram", "App Icon Gradient", "Support Crescent"];
                        tag = bTags[parseInt(num) - 1] || "Alternate Concept";
                    } else if (file.startsWith("logo_single_")) {
                        const parts = file.replace("logo_single_", "").split("_");
                        const index = parts[0];
                        id = `Single Logo ${index}`;
                        tag = "Custom Concept";
                    }
                    return { id, tag, file };
                });
                
                // Sort logos so logo_main is first, then logo_a_*, then logo_b_*, then logo_single_*
                logos.sort((a, b) => {
                    if (a.file === "logo_main.png") return -1;
                    if (b.file === "logo_main.png") return 1;
                    if (a.file.startsWith("logo_a_") && b.file.startsWith("logo_b_")) return -1;
                    if (a.file.startsWith("logo_b_") && b.file.startsWith("logo_a_")) return 1;
                    if (a.file.startsWith("logo_single_") && !b.file.startsWith("logo_single_")) return 1;
                    if (!a.file.startsWith("logo_single_") && b.file.startsWith("logo_single_")) return -1;
                    return a.file.localeCompare(b.file, undefined, {numeric: true, sensitivity: 'base'});
                });
            } else {
                logos = fallbackLogos;
            }
        } catch (e) {
            logos = fallbackLogos;
        }

        // Render cards
        logosGrid.innerHTML = "";
        logos.forEach(logo => {
            logosGrid.appendChild(createLogoCard(logo));
        });

        // Set up active state on the first card (which is logo_main.png)
        const firstCard = logosGrid.querySelector(".logo-card");
        if (firstCard) {
            firstCard.classList.add("active-logo");
        }

        // Now bind event listeners since the DOM elements exist
        setupEvents();
    }

    function setupEvents() {
        const logoCards = document.querySelectorAll(".logo-card");
        const selectedCountText = document.getElementById("selected-count-text");
        const dynamicLogos = document.querySelectorAll(".dynamic-logo-img");

        logoCards.forEach(card => {
            card.addEventListener("click", () => {
                logoCards.forEach(c => c.classList.remove("active-logo"));
                card.classList.add("active-logo");
                
                const logoPath = card.getAttribute("data-logo-path");
                const logoName = card.getAttribute("data-logo-name");
                
                selectedCountText.innerHTML = `Active Logo: <strong>${logoName}</strong>`;
                
                dynamicLogos.forEach(img => {
                    img.style.opacity = 0;
                    setTimeout(() => {
                        img.src = logoPath;
                        img.style.opacity = 1;
                    }, 150);
                });
            });
        });

        dynamicLogos.forEach(img => {
            img.style.transition = "opacity 0.2s ease-in-out";
        });
    }

    // Call dynamic initialize
    initializeGallery();

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
        threshold: 0.02, // trigger when 2% is visible
        rootMargin: "0px"
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
