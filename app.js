// Słownik tłumaczeń
const translations = {
    pl: {
        title: "Extra Wikipedia",
        subtitle: "Twoje nowoczesne okno na świat wiedzy",
        placeholder: "Czego chcesz się dowiedzieć?",
        searchBtn: "Szukaj",
        welcome: "Wpisz hasło i wybierz język, aby rozpocząć przygodę.",
        loading: "Szukam informacji...",
        readMore: "Czytaj pełny artykuł",
        noResults: "Niestety, nie znaleźliśmy nic o",
        error: "Błąd połączenia z Wikipedią.",
        nightMode: "Tryb Nocny 🌙",
        dayMode: "Tryb Jasny ☀️"
    },
    en: {
        title: "Extra Wikipedia",
        subtitle: "Your modern window to world knowledge",
        placeholder: "What do you want to learn?",
        searchBtn: "Search",
        welcome: "Type a keyword and choose a language to start.",
        loading: "Searching for info...",
        readMore: "Read full article",
        noResults: "Sorry, we found nothing about",
        error: "Connection error with Wikipedia.",
        nightMode: "Night Mode 🌙",
        dayMode: "Day Mode ☀️"
    },
    de: {
        title: "Extra Wikipedia",
        subtitle: "Ihr modernes Fenster zum Weltwissen",
        placeholder: "Was möchten Sie lernen?",
        searchBtn: "Suche",
        welcome: "Geben Sie ein Stichwort ein und wählen Sie eine Sprache.",
        loading: "Suche nach Informationen...",
        readMore: "Vollständigen Artikel lesen",
        noResults: "Leider haben wir nichts gefunden über",
        error: "Verbindungsfehler mit Wikipedia.",
        nightMode: "Nachtmodus 🌙",
        dayMode: "Tagmodus ☀️"
    }
};

const elements = {
    title: document.getElementById('ui-title'),
    subtitle: document.getElementById('ui-subtitle'),
    input: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchButton'),
    welcome: document.getElementById('ui-welcome'),
    themeBtn: document.getElementById('themeToggle'),
    langSelect: document.getElementById('languageSelect'),
    content: document.getElementById('content'),
    body: document.body
};

// Funkcja zmieniająca język interfejsu
function updateInterfaceLanguage() {
    const lang = elements.langSelect.value;
    const t = translations[lang];

    elements.title.textContent = t.title;
    elements.subtitle.textContent = t.subtitle;
    elements.input.placeholder = t.placeholder;
    elements.searchBtn.textContent = t.searchBtn;
    if (elements.welcome) elements.welcome.innerHTML = `<p>${t.welcome}</p>`;
    
    // Aktualizacja tekstu przycisku motywu
    const isDark = elements.body.getAttribute('data-theme') === 'dark';
    elements.themeBtn.textContent = isDark ? t.dayMode : t.nightMode;
}

// Funkcja wyszukiwania
async function searchWikipedia() {
    const query = elements.input.value.trim();
    const lang = elements.langSelect.value;
    const t = translations[lang];

    if (!query) return;

    elements.content.innerHTML = `<div class="welcome-msg"><p>${t.loading}</p></div>`;

    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|info&exintro&explaintext&inprop=url&generator=search&gsrsearch=${query}&gsrlimit=1&origin=*`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.query && data.query.pages) {
            const page = Object.values(data.query.pages)[0];
            elements.content.innerHTML = `
                <h2 style="color: var(--accent-color)">${page.title}</h2>
                <p style="font-size: 1.1rem; line-height: 1.8;">${page.extract}</p>
                <a href="${page.fullurl}" target="_blank" class="wiki-link">${t.readMore} →</a>
            `;
        } else {
            elements.content.innerHTML = `<div class="welcome-msg"><p>${t.noResults} <strong>${query}</strong>.</p></div>`;
        }
    } catch (e) {
        elements.content.innerHTML = `<p>${t.error}</p>`;
    }
}

// Event Listeners
elements.searchBtn.addEventListener('click', searchWikipedia);
elements.input.addEventListener('keypress', (e) => { if(e.key === 'Enter') searchWikipedia(); });
elements.langSelect.addEventListener('change', updateInterfaceLanguage);

elements.themeBtn.addEventListener('click', () => {
    const isLight = elements.body.getAttribute('data-theme') === 'light';
    const lang = elements.langSelect.value;
    
    elements.body.setAttribute('data-theme', isLight ? 'dark' : 'light');
    elements.themeBtn.textContent = isLight ? translations[lang].dayMode : translations[lang].nightMode;
});

// Uruchomienie tłumaczenia na starcie
updateInterfaceLanguage();