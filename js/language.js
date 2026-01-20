// Language management system
class LanguageManager {
    constructor() {
        this.currentLanguage = 'sv'; // Default to Swedish
        this.languages = {
            'sv': null,
            'en': null
        };
        this.init();
    }

    async init() {
        // Load saved language preference or default to Swedish
        const savedLang = localStorage.getItem('preferred-language') || 'sv';
        await this.loadLanguage(savedLang);
        this.setupLanguageSelector();
    }

    async loadLanguage(lang) {
        if (!this.languages[lang]) {
            try {
                const response = await fetch(`./lang/${lang}.json`);
                this.languages[lang] = await response.json();
            } catch (error) {
                console.error(`Failed to load language ${lang}:`, error);
                return false;
            }
        }
        
        this.currentLanguage = lang;
        localStorage.setItem('preferred-language', lang);
        this.updatePageContent();
        this.updateLanguageSelector();
        return true;
    }

    updatePageContent() {
        const data = this.languages[this.currentLanguage];
        if (!data) return;

        // Update document title
        document.title = data.meta.title;

        // Update header
        this.updateElement('[data-lang="header.title"]', data.header.title);
        this.updateElement('[data-lang="header.tagline"]', data.header.tagline);

        // Update navigation
        Object.keys(data.nav).forEach(key => {
            this.updateElement(`[data-lang="nav.${key}"]`, data.nav[key]);
        });

        // Update hero section
        this.updateElement('[data-lang="hero.title"]', data.hero.title);
        this.updateElement('[data-lang="hero.description"]', data.hero.description);
        this.updateElement('[data-lang="hero.bookButton"]', data.hero.bookButton);
        this.updateElement('[data-lang="hero.readMoreButton"]', data.hero.readMoreButton);
        this.updateElement('[data-lang="hero.imageAlt"]', data.hero.imageAlt, 'alt');

        // Update about section
        this.updateElement('[data-lang="about.title"]', data.about.title);
        this.updateElement('[data-lang="about.history"]', data.about.history);
        this.updateElement('[data-lang="about.specializedIn"]', data.about.specializedIn);
        this.updateElement('[data-lang="about.musiciansTitle"]', data.about.musiciansTitle);

        // Update specializations list
        const specializationsList = document.querySelector('[data-lang="about.specializations"]');
        if (specializationsList) {
            specializationsList.innerHTML = data.about.specializations
                .map(item => `<li>${item}</li>`)
                .join('');
        }

        // Update member information
        Object.keys(data.about.members).forEach(memberKey => {
            const member = data.about.members[memberKey];
            this.updateElement(`[data-lang="member.${memberKey}.name"]`, member.name);
            this.updateElement(`[data-lang="member.${memberKey}.role"]`, member.role);
            this.updateElement(`[data-lang="member.${memberKey}.description"]`, member.description);
            this.updateElement(`[data-lang="member.${memberKey}.quote"]`, member.quote);
        });

        // Update performances section
        this.updateElement('[data-lang="performances.title"]', data.performances.title);
        this.updateElement('[data-lang="performances.videoTitle"]', data.performances.videoTitle);
        this.updateElement('[data-lang="performances.eventTypesTitle"]', data.performances.eventTypesTitle);

        // Update event types
        Object.keys(data.performances.eventTypes).forEach(eventKey => {
            const event = data.performances.eventTypes[eventKey];
            this.updateElement(`[data-lang="event.${eventKey}.title"]`, event.title);
            this.updateElement(`[data-lang="event.${eventKey}.description"]`, event.description);
        });

        // Update services section
        this.updateElement('[data-lang="services.title"]', data.services.title);
        this.updateElement('[data-lang="services.subtitle"]', data.services.subtitle);

        // Update service packages
        Object.keys(data.services.packages).forEach(packageKey => {
            const pkg = data.services.packages[packageKey];
            this.updateElement(`[data-lang="package.${packageKey}.title"]`, pkg.title);
            this.updateElement(`[data-lang="package.${packageKey}.description"]`, pkg.description);
            this.updateElement(`[data-lang="package.${packageKey}.price"]`, pkg.price);
            this.updateElement(`[data-lang="package.${packageKey}.bookingTitle"]`, pkg.bookingTitle);
            this.updateElement(`[data-lang="package.${packageKey}.bookingInfo"]`, pkg.bookingInfo, 'innerHTML');

            // Update features list
            const featuresList = document.querySelector(`[data-lang="package.${packageKey}.features"]`);
            if (featuresList && pkg.features) {
                featuresList.innerHTML = pkg.features
                    .map(feature => `<li>${feature}</li>`)
                    .join('');
            }
        });

        // Update join section
        this.updateElement('[data-lang="join.title"]', data.join.title);
        this.updateElement('[data-lang="join.intro"]', data.join.intro);
        this.updateElement('[data-lang="join.pathTitle"]', data.join.pathTitle);
        this.updateElement('[data-lang="join.requirementsTitle"]', data.join.requirementsTitle);

        // Update steps
        data.join.steps.forEach((step, index) => {
            this.updateElement(`[data-lang="step.${index}.title"]`, step.title);
            this.updateElement(`[data-lang="step.${index}.description"]`, step.description);
        });

        // Update requirements list
        const requirementsList = document.querySelector('[data-lang="join.requirements"]');
        if (requirementsList) {
            requirementsList.innerHTML = data.join.requirements
                .map(req => `<li>${req}</li>`)
                .join('');
        }

        // Update contact section
        this.updateElement('[data-lang="contact.title"]', data.contact.title);
        this.updateElement('[data-lang="contact.bandName"]', data.contact.bandName);
        this.updateElement('[data-lang="contact.phone"]', data.contact.phone);
        this.updateElement('[data-lang="contact.email"]', data.contact.email);
        this.updateElement('[data-lang="contact.address"]', data.contact.address);
        this.updateElement('[data-lang="contact.followUs"]', data.contact.followUs);

        // Update social links
        Object.keys(data.contact.socialLinks).forEach(social => {
            this.updateElement(`[data-lang="social.${social}"]`, data.contact.socialLinks[social]);
        });

        // Update footer
        this.updateElement('[data-lang="footer.copyright"]', data.footer.copyright);
        this.updateElement('[data-lang="footer.tagline"]', data.footer.tagline);
    }

    updateElement(selector, content, attribute = 'textContent') {
        const element = document.querySelector(selector);
        if (element) {
            if (attribute === 'innerHTML') {
                element.innerHTML = content;
            } else if (attribute === 'textContent') {
                element.textContent = content;
            } else {
                element.setAttribute(attribute, content);
            }
        }
    }

    setupLanguageSelector() {
        // Create language selector if it doesn't exist
        let languageSelector = document.querySelector('#language-selector');
        if (!languageSelector) {
            languageSelector = document.createElement('div');
            languageSelector.id = 'language-selector';
            languageSelector.innerHTML = `
                <button class="lang-toggle-btn" title="Byt språk / Switch language">
                    <img class="flag-img" src="images/se.svg" alt="Svenska" width="20" height="15">
                    <span class="lang-text">SV</span>
                </button>
            `;
            
            // Add to header
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(languageSelector);
            }
        }

        // Add event listener for toggle
        const toggleBtn = languageSelector.querySelector('.lang-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const newLang = this.currentLanguage === 'sv' ? 'en' : 'sv';
                this.loadLanguage(newLang);
            });
        }
    }

    updateLanguageSelector() {
        const toggleBtn = document.querySelector('.lang-toggle-btn');
        const flagImg = document.querySelector('.flag-img');
        const langTextSpan = document.querySelector('.lang-text');
        
        if (toggleBtn && flagImg && langTextSpan) {
            if (this.currentLanguage === 'sv') {
                flagImg.src = 'images/se.svg';
                flagImg.alt = 'Svenska';
                langTextSpan.textContent = 'SV';
                toggleBtn.title = 'Byt till engelska / Switch to English';
            } else {
                flagImg.src = 'images/gb.svg';
                flagImg.alt = 'English';
                langTextSpan.textContent = 'EN';
                toggleBtn.title = 'Byt till svenska / Switch to Swedish';
            }
        }
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});