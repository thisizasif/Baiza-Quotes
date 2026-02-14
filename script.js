const FETCH_TIMEOUT_MS = 2800;
const TYPEWRITER_MAX_CHARS = 180;
const PREFERS_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ENABLE_KEYWORD_MATCHING = false;
const BACKGROUND_RECENT_LIMIT = 12;
const DYNAMIC_IMAGE_CANDIDATES_PER_PROVIDER = 5;
let typefitCache = null;
const QUOTE_SOURCE_WEIGHT = {
        Quotable: 22,
        ZenQuotes: 20,
        "Stoic Quotes": 19,
        QuoteGarden: 17,
        TypeFit: 16,
        DummyJSON: 12,
        Backup: 8
};
const QUOTE_BG_IMAGES = [
        "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80"
];
const QUOTE_BG_IMAGES_BY_CATEGORY = {
        motivation: [
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=80"
        ],
        wisdom: [
                "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80"
        ],
        life: [
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1433878455169-4698e60005b1?auto=format&fit=crop&w=1400&q=80"
        ],
        love: [
                "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1400&q=80"
        ],
        success: [
                "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=1400&q=80"
        ],
        inspiration: [
                "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80"
        ],
        funny: [
                "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80"
        ]
};
const IMAGE_TOPIC_KEYWORDS = {
        mountain: ["mountain", "climb", "peak", "summit", "rise", "journey", "path"],
        ocean: ["ocean", "sea", "wave", "calm", "flow", "depth", "water"],
        forest: ["forest", "tree", "nature", "grow", "growth", "roots", "green"],
        sunrise: ["sunrise", "morning", "dawn", "hope", "begin", "start", "new"],
        night: ["night", "dark", "stars", "moon", "silence", "dream"],
        city: ["city", "street", "hustle", "work", "build", "future", "success"],
        light: ["light", "shine", "bright", "clarity", "vision", "focus"],
        road: ["road", "way", "direction", "move", "step", "progress", "travel"],
        emotion: ["anger", "hurt", "injury", "restrain", "provoke", "pain", "heal", "peace"]
};
const IMAGE_TOPIC_POOLS = {
        mountain: [
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
        ],
        ocean: [
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1400&q=80"
        ],
        forest: [
                "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=80"
        ],
        sunrise: [
                "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1400&q=80"
        ],
        night: [
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1400&q=80"
        ],
        city: [
                "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=80"
        ],
        light: [
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80"
        ],
        road: [
                "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1474073705359-5da2a8270c64?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1400&q=80"
        ],
        emotion: [
                "https://images.unsplash.com/photo-1472417583565-62e7bdeda490?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&w=1400&q=80"
        ]
};
const QUOTE_STOPWORDS = new Set([
        "the", "a", "an", "and", "or", "but", "to", "of", "in", "on", "for", "with", "at", "by",
        "from", "as", "is", "it", "this", "that", "be", "are", "was", "were", "you", "your",
        "we", "they", "them", "our", "their", "i", "me", "my", "mine", "he", "she", "his",
        "her", "hers", "its", "do", "does", "did", "have", "has", "had", "will", "would", "can",
        "could", "should", "may", "might", "if", "then", "than", "so", "too", "very", "just"
]);
const CATEGORY_IMAGE_QUERY = {
        motivation: "mountain,goal,success,climb",
        wisdom: "nature,calm,light,philosophy",
        life: "journey,road,landscape,life",
        love: "sunset,warm,romantic,heart",
        success: "city,skyline,achievement,focus",
        inspiration: "sunrise,light,dream,hope",
        funny: "colorful,joy,happy,vibrant",
        all: "landscape,nature,cinematic"
};

const API_CONFIG = {
        workingAPIs: [
                {
                        name: "Quotable",
                        handler: async () => {
                                const data = await fetchJSONWithTimeout("https://api.quotable.io/random");
                                return {
                                        text: data.content,
                                        author: data.author || "Unknown",
                                        category: (data.tags && data.tags[0]) || "general"
                                };
                        }
                },
                {
                        name: "DummyJSON",
                        handler: async () => {
                                const data = await fetchJSONWithTimeout("https://dummyjson.com/quotes/random");
                                return {
                                        text: data.quote,
                                        author: data.author || "Unknown",
                                        category: "general"
                                };
                        }
                },
                {
                        name: "ZenQuotes",
                        handler: async () => {
                                const data = await fetchJSONWithTimeout("https://zenquotes.io/api/random");
                                const item = Array.isArray(data) ? data[0] : data;
                                return {
                                        text: item?.q || item?.quote || "Stay positive and keep moving.",
                                        author: item?.a || item?.author || "Unknown",
                                        category: "inspiration"
                                };
                        }
                },
                {
                        name: "QuoteGarden",
                        handler: async () => {
                                const data = await fetchJSONWithTimeout("https://quote-garden.onrender.com/api/v3/quotes/random");
                                const item = data?.data && data.data[0] ? data.data[0] : null;
                                return {
                                        text: item?.quoteText || item?.quote || "Progress is built one step at a time.",
                                        author: item?.quoteAuthor || item?.author || "Unknown",
                                        category: "general"
                                };
                        }
                },
                {
                        name: "Stoic Quotes",
                        handler: async () => {
                                const data = await fetchJSONWithTimeout("https://stoic-quotes.com/api/quote");
                                return {
                                        text: data?.text || data?.quote || "The obstacle is the way.",
                                        author: data?.author || "Stoic",
                                        category: "wisdom"
                                };
                        }
                },
                {
                        name: "TypeFit",
                        handler: async () => {
                                const data = await getTypefitQuotes();
                                if (!data.length) throw new Error("typefit-empty");

                                const item = data[Math.floor(Math.random() * Math.min(120, data.length))] || {};

                                return {
                                        text: item.text || "Be yourself; everyone else is already taken.",
                                        author: (item.author || "Oscar Wilde").replace(", type.fit", ""),
                                        category: "inspiration"
                                };
                        }
                }
        ],
        categoryAPIs: {
                motivation: [
                        "https://api.quotable.io/random?tags=motivation",
                        "https://api.quotable.io/random?tags=inspirational"
                ],
                wisdom: [
                        "https://api.quotable.io/random?tags=wisdom",
                        "https://api.quotable.io/random?tags=philosophy"
                ],
                life: [
                        "https://api.quotable.io/random?tags=life",
                        "https://api.quotable.io/random?tags=experience"
                ],
                love: ["https://api.quotable.io/random?tags=love"],
                success: ["https://api.quotable.io/random?tags=success"],
                inspiration: ["https://api.quotable.io/random?tags=inspirational"],
                funny: ["https://api.quotable.io/random?tags=humor"]
        },
        backupQuotes: [
                { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivation" },
                { text: "Life is what happens to you while you are busy making other plans.", author: "John Lennon", category: "life" },
                { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "inspiration" },
                { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "wisdom" },
                { text: "Whoever is happy will make others happy too.", author: "Anne Frank", category: "life" },
                { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi", category: "wisdom" },
                { text: "Spread love everywhere you go.", author: "Mother Teresa", category: "love" },
                { text: "Be yourself. Everyone else is already taken.", author: "Oscar Wilde", category: "funny" },
                { text: "The only thing we have to fear is fear itself.", author: "Franklin D. Roosevelt", category: "success" },
                { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", category: "wisdom" }
        ]
};

const state = {
        currentTheme: "default",
        currentCategory: "all",
        quotesViewed: 0,
        sessionStart: Date.now(),
        isTyping: false,
        currentQuote: null,
        quoteHistory: [],
        usedQuotes: new Set(),
        autoThemeInterval: null,
        lastSource: "Local",
        bgRequestId: 0,
        currentQuoteBgUrl: null,
        recentBackgroundUrls: [],
        failedBackgroundUrls: new Set(),
        prefetchedBackgrounds: [],
        prefetchInFlight: false
};

const elements = {
        quoteText: document.getElementById("quoteText"),
        quoteAuthor: document.getElementById("quoteAuthor"),
        generateBtn: document.getElementById("generateBtn"),
        copyBtn: document.getElementById("copyBtn"),
        shareBtn: document.getElementById("shareBtn"),
        downloadBtn: document.getElementById("downloadBtn"),
        loadingContainer: document.getElementById("loadingContainer"),
        loadingText: document.getElementById("loadingText"),
        quoteSection: document.querySelector(".quote-section"),
        activeCategoryBadge: document.getElementById("activeCategoryBadge"),
        quoteMeta: document.getElementById("quoteMeta"),
        toast: document.getElementById("toast"),
        toastMessage: document.getElementById("toastMessage"),
        viewedCount: document.getElementById("viewedCount"),
        categoriesCount: document.getElementById("categoriesCount"),
        sessionTime: document.getElementById("sessionTime"),
        historyEmpty: document.getElementById("historyEmpty"),
        quoteHistory: document.getElementById("quoteHistory"),
        particlesContainer: document.getElementById("particles"),
        shapesContainer: document.getElementById("geometricShapes"),
        quoteCanvas: document.getElementById("quoteCanvas")
};

function normalizeQuote(text, author, category = "general") {
        const cleanText = String(text || "")
                .trim()
                .replace(/^[\s"'`“”‘’]+/, "")
                .replace(/[\s"'`“”‘’]+$/, "");
        const cleanAuthor = String(author || "Unknown")
                .trim()
                .replace(/^[\s"'`“”‘’]+/, "")
                .replace(/[\s"'`“”‘’]+$/, "");

        return {
                text: cleanText,
                author: cleanAuthor,
                category
        };
}

function normalizeCategory(category) {
        return String(category || "general").toLowerCase();
}

function scoreQuoteCandidate(quote) {
        const text = String(quote.text || "").trim();
        const author = String(quote.author || "").trim();
        const source = String(quote.source || "");
        const category = normalizeCategory(quote.category);
        const words = text.split(/\s+/).filter(Boolean);
        const wordCount = words.length;
        const quoteKey = `${text}::${author}`;

        if (!text || wordCount < 4) return -999;

        let score = 0;

        if (wordCount >= 10 && wordCount <= 34) score += 28;
        else if (wordCount >= 7 && wordCount <= 46) score += 18;
        else score -= 8;

        if (author && !/^unknown$/i.test(author)) score += 20;
        else score -= 10;

        if (/https?:\/\//i.test(text)) score -= 30;
        if (/[<>{}]/.test(text)) score -= 16;
        if (/^[A-Z0-9\s\W]+$/.test(text)) score -= 10;

        if (/[.!?]$/.test(text)) score += 4;
        if (/[,;]/.test(text)) score += 2;

        if (state.currentCategory !== "all" && category === normalizeCategory(state.currentCategory)) {
                score += 14;
        }

        score += QUOTE_SOURCE_WEIGHT[source] || 10;

        if (state.usedQuotes.has(quoteKey)) score -= 60;

        const recentHistory = state.quoteHistory.slice(-4);
        if (recentHistory.some((item) => item.text === text && item.author === author)) {
                score -= 45;
        }

        return score;
}

function pickBestQuote(candidates) {
        if (!Array.isArray(candidates) || !candidates.length) return null;

        const scored = candidates
                .map((quote) => ({ quote, score: scoreQuoteCandidate(quote) }))
                .sort((a, b) => b.score - a.score);

        return scored[0]?.quote || null;
}

async function fetchJSONWithTimeout(url, timeoutMs = FETCH_TIMEOUT_MS) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
                const response = await fetch(url, { signal: controller.signal });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
        } finally {
                clearTimeout(timer);
        }
}

async function getTypefitQuotes() {
        if (typefitCache) return typefitCache;

        const data = await fetchJSONWithTimeout("https://type.fit/api/quotes", 4200);
        typefitCache = Array.isArray(data) ? data : [];
        return typefitCache;
}

function warmTypefitCache() {
        getTypefitQuotes().catch(() => {
                typefitCache = [];
        });
}

function normalizeKeyword(word) {
        let token = String(word || "").toLowerCase().replace(/[^a-z]/g, "");
        if (!token) return "";

        // Light stemming so "provokes" -> "provoke", "restrained" -> "restrain".
        if (token.length > 6 && token.endsWith("ing")) token = token.slice(0, -3);
        else if (token.length > 5 && token.endsWith("ed")) token = token.slice(0, -2);
        else if (token.length > 5 && token.endsWith("es")) token = token.slice(0, -2);
        else if (token.length > 4 && token.endsWith("s")) token = token.slice(0, -1);

        if (token.length < 4) return "";
        return token;
}

function randomInt(max) {
        if (max <= 0) return 0;
        if (window.crypto && window.crypto.getRandomValues) {
                const arr = new Uint32Array(1);
                window.crypto.getRandomValues(arr);
                return arr[0] % max;
        }
        return Math.floor(Math.random() * max);
}

function randomToken() {
        return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

function extractQuoteKeywords(text) {
        const cleaned = String(text || "")
                .toLowerCase()
                .replace(/[^a-z\s]/g, " ");
        const words = cleaned.split(/\s+/).filter(Boolean);
        const unique = [];
        const seen = new Set();

        for (const word of words) {
                if (QUOTE_STOPWORDS.has(word)) continue;
                if (word.endsWith("ly")) continue; // skip many adverbs like "frequently"

                const token = normalizeKeyword(word);
                if (!token || QUOTE_STOPWORDS.has(token) || seen.has(token)) continue;

                seen.add(token);
                unique.push(token);
        }

        return unique.slice(0, 8);
}

function getImageTopicsForQuote(text) {
        const keywords = extractQuoteKeywords(text);
        const topics = new Set();

        for (const [topic, triggers] of Object.entries(IMAGE_TOPIC_KEYWORDS)) {
                if (triggers.some((trigger) => {
                        const normalizedTrigger = normalizeKeyword(trigger);
                        return keywords.some((key) =>
                                key === normalizedTrigger ||
                                key.startsWith(normalizedTrigger) ||
                                normalizedTrigger.startsWith(key)
                        );
                })) {
                        topics.add(topic);
                }
        }

        return Array.from(topics);
}

function getCategoryImagePool(category, quoteText = "") {
        const key = String(category || "").toLowerCase();
        const categoryPool = QUOTE_BG_IMAGES_BY_CATEGORY[key] || [];
        const topicPools = ENABLE_KEYWORD_MATCHING
                ? getImageTopicsForQuote(quoteText).flatMap((topic) => IMAGE_TOPIC_POOLS[topic] || [])
                : [];

        // Category-first, then global curated set, all deduplicated.
        return Array.from(new Set([...categoryPool, ...topicPools, ...QUOTE_BG_IMAGES]));
}

function buildImageQuery(category, quoteText = "") {
        const normalizedCategory = String(category || "all").toLowerCase();
        const categoryQuery = CATEGORY_IMAGE_QUERY[normalizedCategory] || CATEGORY_IMAGE_QUERY.all;

        if (!ENABLE_KEYWORD_MATCHING) return categoryQuery;

        const keywords = extractQuoteKeywords(quoteText);
        if (!keywords.length) return categoryQuery;

        const keywordQuery = keywords.slice(0, 3).join(",");
        return `${keywordQuery},${categoryQuery}`;
}

function buildDynamicImageCandidates(category, quoteText = "") {
        const query = encodeURIComponent(buildImageQuery(category, quoteText));
        const urls = [];

        for (let i = 0; i < DYNAMIC_IMAGE_CANDIDATES_PER_PROVIDER; i += 1) {
                const seed = randomToken();
                urls.push(`https://source.unsplash.com/1600x900/?${query}&sig=${seed}`);
                urls.push(`https://picsum.photos/seed/${seed}/1600/900`);
                urls.push(`https://picsum.photos/1600/900?random=${seed}`);
        }

        // Best-quality curated fallback sources (dedup handled later).
        urls.push(...getCategoryImagePool(category, quoteText));
        return Array.from(new Set(urls));
}

function rememberBackgroundUrl(url) {
        if (!url) return;
        state.recentBackgroundUrls.push(url);
        if (state.recentBackgroundUrls.length > BACKGROUND_RECENT_LIMIT) {
                state.recentBackgroundUrls.shift();
        }
}

function takePrefetchedBackground(category) {
        const normalizedCategory = String(category || "all").toLowerCase();
        const index = state.prefetchedBackgrounds.findIndex(
                (item) => item.category === normalizedCategory || item.category === "all"
        );
        if (index === -1) return null;

        const [prefetched] = state.prefetchedBackgrounds.splice(index, 1);
        return prefetched;
}

function pickUniqueBackgroundUrl(pool) {
        const fresh = pool.filter(
                (url) => !state.recentBackgroundUrls.includes(url) && !state.failedBackgroundUrls.has(url)
        );

        if (fresh.length) {
                return fresh[randomInt(fresh.length)];
        }

        const retryPool = pool.filter((url) => !state.failedBackgroundUrls.has(url));
        if (retryPool.length) {
                return retryPool[randomInt(retryPool.length)];
        }

        return pool[randomInt(pool.length)];
}

function loadImage(url) {
        return new Promise((resolve, reject) => {
                const image = new Image();
                image.crossOrigin = "anonymous";
                image.referrerPolicy = "no-referrer";
                image.onload = () => resolve(image);
                image.onerror = () => reject(new Error("image-load-failed"));
                image.src = url;
        });
}

async function getRandomBackgroundImage(category, quoteText = "", maxAttempts = 3) {
        const tried = new Set();
        const pool = buildDynamicImageCandidates(category, quoteText);
        const attempts = Math.min(maxAttempts, Math.max(pool.length, 1));

        for (let attempt = 0; attempt < attempts; attempt += 1) {
                let url = pickUniqueBackgroundUrl(pool);
                while (tried.has(url) && tried.size < pool.length) {
                        url = pickUniqueBackgroundUrl(pool);
                }
                tried.add(url);

                try {
                        const image = await loadImage(url);
                        rememberBackgroundUrl(url);
                        return { image, url };
                } catch (error) {
                        state.failedBackgroundUrls.add(url);
                        continue;
                }
        }

        return null;
}

async function prefetchBackgrounds(category, quoteText = "", targetCount = 2) {
        if (state.prefetchInFlight) return;
        if (state.prefetchedBackgrounds.length >= targetCount) return;

        state.prefetchInFlight = true;
        const normalizedCategory = String(category || "all").toLowerCase();

        try {
                const needed = targetCount - state.prefetchedBackgrounds.length;
                for (let i = 0; i < needed; i += 1) {
                        const bgResult = await getRandomBackgroundImage(normalizedCategory, quoteText, 8);
                        if (!bgResult?.image || !bgResult?.url) continue;

                        const exists = state.prefetchedBackgrounds.some((item) => item.url === bgResult.url);
                        if (!exists) {
                                state.prefetchedBackgrounds.push({
                                        category: normalizedCategory,
                                        url: bgResult.url,
                                        image: bgResult.image
                                });
                        }
                }
        } catch (error) {
        } finally {
                state.prefetchInFlight = false;
        }
}

async function applyQuoteBackground(category, quoteText = "") {
        if (!elements.quoteSection) return;

        const requestId = ++state.bgRequestId;

        try {
                const prefetched = takePrefetchedBackground(category);
                const bgResult = prefetched || await getRandomBackgroundImage(category, quoteText, 8);
                if (requestId !== state.bgRequestId) return;

                if (bgResult?.url) {
                        const safeUrl = String(bgResult.url).replace(/"/g, '\\"');
                        elements.quoteSection.style.setProperty("--quote-bg-image", `url("${safeUrl}")`);
                        elements.quoteSection.classList.add("has-photo");
                        state.currentQuoteBgUrl = bgResult.url;
                        prefetchBackgrounds(category, "", 2);
                        return;
                }
        } catch (error) {
        }

        if (requestId === state.bgRequestId) {
                elements.quoteSection.classList.remove("has-photo");
                elements.quoteSection.style.removeProperty("--quote-bg-image");
                state.currentQuoteBgUrl = null;
        }
}

function drawCoverImage(ctx, image, canvasWidth, canvasHeight) {
        const imageRatio = image.width / image.height;
        const canvasRatio = canvasWidth / canvasHeight;
        let drawWidth = canvasWidth;
        let drawHeight = canvasHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (imageRatio > canvasRatio) {
                drawHeight = canvasHeight;
                drawWidth = drawHeight * imageRatio;
                offsetX = (canvasWidth - drawWidth) / 2;
        } else {
                drawWidth = canvasWidth;
                drawHeight = drawWidth / imageRatio;
                offsetY = (canvasHeight - drawHeight) / 2;
        }

        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

function wrapTextLines(ctx, text, maxWidth) {
        const words = String(text).split(" ");
        const lines = [];
        let line = words[0] || "";

        for (let i = 1; i < words.length; i += 1) {
                const testLine = `${line} ${words[i]}`;
                if (ctx.measureText(testLine).width <= maxWidth) {
                        line = testLine;
                } else {
                        lines.push(line);
                        line = words[i];
                }
        }

        lines.push(line);
        return lines;
}

async function fetchRandomQuote() {
        if (state.isTyping) return;

        state.isTyping = true;
        showLoading();
        setBusyState(true);
        prefetchBackgrounds(state.currentCategory, "", 2);

        try {
                let quote = null;

                if (state.currentCategory !== "all") {
                        quote = await tryCategoryAPIs();
                }
                if (!quote) {
                        quote = await tryWorkingAPIs();
                }
                if (!quote) {
                        quote = getBackupQuote();
                }

                const source = quote.source || state.lastSource || "Local";
                quote = normalizeQuote(quote.text, quote.author, quote.category);
                quote.source = source;
                state.lastSource = source;

                const quoteKey = `${quote.text}::${quote.author}`;
                if (state.usedQuotes.has(quoteKey)) {
                        quote = getBackupQuote();
                        state.lastSource = quote.source || state.lastSource;
                }

                state.usedQuotes.add(`${quote.text}::${quote.author}`);
                addToHistory(quote);
                applyQuoteBackground(quote.category, quote.text);

                await typeQuote(quote.text, quote.author, quote.category);

                state.quotesViewed += 1;
                updateStats();
                persistState();
                showToast("New quote loaded", "success");
        } catch (error) {
                const backup = getBackupQuote();
                displayQuote(backup.text, backup.author, backup.category, false);
                showToast("Using backup quotes", "error");
        } finally {
                hideLoading();
                state.isTyping = false;
                setBusyState(false);
        }
}

async function tryCategoryAPIs() {
        const urls = API_CONFIG.categoryAPIs[state.currentCategory] || [];

        for (const url of urls) {
                try {
                        const data = await fetchJSONWithTimeout(url);

                        if (Array.isArray(data.results) && data.results.length) {
                                const item = data.results[Math.floor(Math.random() * data.results.length)];
                                const quote = normalizeQuote(
                                        item.content || item.quote || item.text,
                                        item.author,
                                        state.currentCategory
                                );
                                quote.source = "Quotable";
                                return quote;
                        }

                        const quote = normalizeQuote(
                                data.content || data.quote || data.text,
                                data.author,
                                state.currentCategory
                        );
                        quote.source = "Quotable";
                        return quote;
                } catch (error) {
                        continue;
                }
        }

        return null;
}

async function tryWorkingAPIs() {
        async function runAPI(api) {
                const result = await api.handler();
                if (!result || !result.text) throw new Error(`${api.name}-empty`);
                const quote = normalizeQuote(result.text, result.author, result.category || "general");
                quote.source = api.name;
                return quote;
        }

        const results = await Promise.allSettled(API_CONFIG.workingAPIs.map((api) => runAPI(api)));
        const candidates = results
                .filter((result) => result.status === "fulfilled")
                .map((result) => result.value);

        return pickBestQuote(candidates);
}

function getBackupQuote() {
        let quotePool = API_CONFIG.backupQuotes;

        if (state.currentCategory !== "all") {
                quotePool = quotePool.filter((quote) => quote.category === state.currentCategory);
        }

        if (!quotePool.length) {
                quotePool = API_CONFIG.backupQuotes;
        }

        const availableQuotes = quotePool.filter(
                (quote) => !state.usedQuotes.has(`${quote.text}::${quote.author}`)
        );

        const finalPool = availableQuotes.length ? availableQuotes : quotePool;
        const quote = finalPool[Math.floor(Math.random() * finalPool.length)];
        return {
                ...quote,
                source: "Backup"
        };
}

async function typeQuote(text, author, category = "all") {
        if (PREFERS_REDUCED_MOTION || text.length > TYPEWRITER_MAX_CHARS) {
                elements.quoteText.textContent = text;
                elements.quoteAuthor.textContent = author;
                state.currentQuote = { text, author, category };
                updateQuoteMeta(text, category);
                return;
        }

        elements.quoteText.textContent = "";
        elements.quoteAuthor.textContent = "";

        const content = text;
        const typingSpeed = window.innerWidth < 768 ? 5 : 4;
        const step = content.length > 130 ? 3 : content.length > 90 ? 2 : 1;

        for (let i = 0; i < content.length; i += step) {
                const safeFragment = content
                        .slice(0, i + 1)
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;");
                elements.quoteText.innerHTML = `${safeFragment}<span class="typing-cursor"></span>`;
                await new Promise((resolve) => setTimeout(resolve, typingSpeed));
        }

        elements.quoteText.textContent = content;

        for (let i = 0; i < author.length; i += 2) {
                elements.quoteAuthor.textContent = author.slice(0, i + 1);
                await new Promise((resolve) => setTimeout(resolve, 7));
        }

        state.currentQuote = { text, author, category };
        updateQuoteMeta(text, category);
}

function displayQuote(text, author, category = "all", notify = true) {
        elements.quoteText.textContent = text;
        elements.quoteAuthor.textContent = author;
        state.currentQuote = { text, author, category };
        updateQuoteMeta(text, category);
        applyQuoteBackground(category, text);

        if (notify) {
                showToast("Quote restored", "info");
        }
}

function addToHistory(quote) {
        state.quoteHistory.push({
                text: quote.text,
                author: quote.author,
                category: quote.category || state.currentCategory,
                timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                })
        });

        if (state.quoteHistory.length > 10) {
                state.quoteHistory.shift();
        }

        updateHistoryDisplay();
}

function updateHistoryDisplay() {
        elements.quoteHistory.innerHTML = "";
        elements.historyEmpty.classList.toggle("hidden", state.quoteHistory.length > 0);

        [...state.quoteHistory].reverse().forEach((quote) => {
                const card = document.createElement("div");
                card.className = "history-item";

                const meta = document.createElement("div");
                meta.className = "history-meta";
                meta.textContent = `${quote.timestamp} | ${quote.category}`;

                const preview = document.createElement("div");
                preview.className = "history-text";
                preview.textContent = `${quote.text.slice(0, 70)}${quote.text.length > 70 ? "..." : ""}`;

                const author = document.createElement("div");
                author.className = "history-author";
                author.textContent = `-- ${quote.author}`;

                card.appendChild(meta);
                card.appendChild(preview);
                card.appendChild(author);
                card.addEventListener("click", () => displayQuote(quote.text, quote.author, quote.category, false));

                elements.quoteHistory.appendChild(card);
        });
}

async function copyQuote() {
        if (!state.currentQuote) {
                showToast("Generate a quote first", "error");
                return;
        }

        const text = `${state.currentQuote.text} -- ${state.currentQuote.author}`;

        try {
                await navigator.clipboard.writeText(text);
                showToast("Copied to clipboard", "success");
        } catch (error) {
                const area = document.createElement("textarea");
                area.value = text;
                document.body.appendChild(area);
                area.select();
                document.execCommand("copy");
                document.body.removeChild(area);
                showToast("Copied", "success");
        }
}

async function renderQuoteCardToCanvas() {
        const canvas = elements.quoteCanvas;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let bgImage = null;

        if (state.currentQuoteBgUrl) {
                try {
                        bgImage = await loadImage(state.currentQuoteBgUrl);
                } catch (error) {
                        bgImage = null;
                }
        }

        if (!bgImage) {
                const categoryForImage = state.currentQuote?.category || state.currentCategory || "all";
                const quoteText = state.currentQuote?.text || "";
                const bgResult = await getRandomBackgroundImage(categoryForImage, quoteText, 8);
                if (bgResult?.image) {
                        bgImage = bgResult.image;
                }
        }

        if (bgImage) {
                drawCoverImage(ctx, bgImage, canvas.width, canvas.height);
        } else {
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, "#0c2233");
                gradient.addColorStop(0.5, "#175676");
                gradient.addColorStop(1, "#2ec4b6");
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0, 0, 0, .72)";
        ctx.shadowBlur = 18;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;

        const fullQuote = state.currentQuote.text;
        const maxLineWidth = canvas.width - 220;
        let fontSize = 62;
        let lines = [];
        let lineHeight = 72;

        while (fontSize >= 36) {
                ctx.font = `700 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
                lines = wrapTextLines(ctx, fullQuote, maxLineWidth);
                lineHeight = Math.round(fontSize * 1.18);

                if (lines.length <= 6) {
                        break;
                }

                fontSize -= 4;
        }

        const blockHeight = lines.length * lineHeight;
        const startY = canvas.height / 2 - blockHeight / 2 - 20;

        lines.forEach((currentLine, index) => {
                ctx.fillText(currentLine, canvas.width / 2, startY + index * lineHeight);
        });

        ctx.font = '600 34px "Space Grotesk", "Segoe UI", sans-serif';
        ctx.fillStyle = "#f3fbff";
        ctx.fillText(`-- ${state.currentQuote.author}`, canvas.width / 2, startY + blockHeight + 46);
        ctx.shadowBlur = 0;

        return canvas;
}

async function shareQuote() {
        if (!state.currentQuote) {
                showToast("Generate a quote first", "error");
                return;
        }

        const textPayload = `${state.currentQuote.text} -- ${state.currentQuote.author}\n${window.location.href}`;

        try {
                if (navigator.share) {
                        // Use text-only payload for widest native share-sheet compatibility.
                        await navigator.share({ text: textPayload });
                        showToast("Shared quote text + link", "success");
                } else {
                        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textPayload)}`;
                        window.open(url, "_blank");
                        showToast("Opened share tab", "info");
                }
        } catch (error) {
                if (error.name !== "AbortError") {
                        try {
                                await navigator.clipboard.writeText(textPayload);
                                showToast("Share not available. Copied quote + link instead.", "info");
                        } catch (clipboardError) {
                                showToast("Share canceled", "error");
                        }
                }
        }
}

async function downloadQuoteAsImage() {
        if (!state.currentQuote) {
                showToast("Generate a quote first", "error");
                return;
        }

        const originalButtonContent = elements.downloadBtn.innerHTML;
        elements.downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>Rendering';
        elements.downloadBtn.disabled = true;

        try {
                const canvas = await renderQuoteCardToCanvas();

                const link = document.createElement("a");
                link.download = `baiza-quote-${Date.now()}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();

                showToast("Image downloaded", "success");
        } catch (error) {
                showToast("Image creation failed", "error");
        } finally {
                elements.downloadBtn.innerHTML = originalButtonContent;
                elements.downloadBtn.disabled = false;
        }
}

function setTheme(theme) {
        if (!theme || theme === "auto") return;

        state.currentTheme = theme;
        document.documentElement.setAttribute("data-theme", theme);

        document.querySelectorAll(".theme-btn").forEach((button) => {
                button.classList.toggle("active", button.dataset.theme === theme);
        });

        persistState();
}

function setCategory(category) {
        state.currentCategory = category;
        state.usedQuotes.clear();
        updateCategoryBadge(category);
        state.prefetchedBackgrounds = [];

        document.querySelectorAll(".category-btn").forEach((button) => {
                button.classList.toggle("active", button.dataset.category === category);
        });

        persistState();
        fetchRandomQuote();
        showToast(`Category set to ${category}`, "info");
}

function applyThemeByTime() {
        const hour = new Date().getHours();
        let theme = "default";

        if (hour >= 6 && hour < 11) {
                theme = "sunrise";
        } else if (hour >= 11 && hour < 17) {
                theme = "light";
        } else if (hour >= 22 || hour < 5) {
                theme = "midnight";
        }

        setTheme(theme);
}

function setupAutoTheme(enabled = false) {
        if (state.autoThemeInterval) {
                clearInterval(state.autoThemeInterval);
        }
        state.autoThemeInterval = null;

        if (!enabled) return;

        applyThemeByTime();
        state.autoThemeInterval = setInterval(applyThemeByTime, 3600000);
}

function toggleAutoTheme() {
        const autoButton = document.getElementById("autoTheme");
        const enabled = !autoButton.classList.contains("active");

        autoButton.classList.toggle("active", enabled);
        setupAutoTheme(enabled);
        showToast(enabled ? "Auto theme enabled" : "Auto theme disabled", "info");

        localStorage.setItem("baiza_auto_theme", enabled ? "1" : "0");
}

function showLoading() {
        elements.loadingContainer.style.display = "flex";
        document.querySelector(".quote-section").classList.add("is-loading");

        const loadingMessages = [
                "Composing your next line...",
                "Searching smart quote feeds...",
                "Picking something worth reading...",
                "Calibrating inspiration..."
        ];

        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        elements.loadingText.textContent = loadingMessages[randomIndex];
}

function hideLoading() {
        elements.loadingContainer.style.display = "none";
        document.querySelector(".quote-section").classList.remove("is-loading");
}

function setBusyState(isBusy) {
        elements.generateBtn.disabled = isBusy;
        document.querySelectorAll(".category-btn").forEach((button) => {
                button.disabled = isBusy;
        });
}

function formatCategoryLabel(category) {
        if (!category || category === "all") return "All";
        return category.charAt(0).toUpperCase() + category.slice(1);
}

function updateCategoryBadge(category) {
        elements.activeCategoryBadge.textContent = formatCategoryLabel(category);
}

function updateQuoteMeta(text, category) {
        const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
        const readTime = Math.max(1, Math.ceil(words / 200));
        const source = state.lastSource || "Local";
        elements.quoteMeta.textContent = `${formatCategoryLabel(category)} | ${readTime} min read | ${source}`;
}

function showToast(message, type = "info") {
        elements.toastMessage.textContent = message;
        elements.toast.className = `toast ${type}`;
        elements.toast.classList.add("show");

        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => {
                elements.toast.classList.remove("show");
        }, 2600);
}

function updateStats() {
        elements.viewedCount.textContent = String(state.quotesViewed);
        elements.categoriesCount.textContent = "8";
}

function startSessionTimer() {
        setInterval(() => {
                const elapsedSeconds = Math.floor((Date.now() - state.sessionStart) / 1000);
                const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
                const seconds = String(elapsedSeconds % 60).padStart(2, "0");

                elements.sessionTime.textContent = `${minutes}:${seconds}`;
        }, 1000);
}

function createParticles() {
        const isMobile = window.matchMedia("(max-width: 780px)").matches;
        const total = isMobile ? 14 : 22;

        for (let i = 0; i < total; i += 1) {
                const particle = document.createElement("div");
                particle.className = "particle";

                const size = Math.random() * 5 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 140}%`;
                particle.style.background = i % 2 ? "var(--accent2)" : "var(--mint)";
                particle.style.animationDuration = `${12 + Math.random() * 18}s`;
                particle.style.animationDelay = `${Math.random() * 6}s`;

                elements.particlesContainer.appendChild(particle);
        }
}

function createGeometricShapes() {
        const isMobile = window.matchMedia("(max-width: 780px)").matches;
        const total = isMobile ? 3 : 5;

        for (let i = 0; i < total; i += 1) {
                const shape = document.createElement("div");
                shape.className = "geometric-shape";

                const size = 40 + Math.random() * 120;
                shape.style.width = `${size}px`;
                shape.style.height = `${size}px`;
                shape.style.left = `${Math.random() * 100}%`;
                shape.style.top = `${Math.random() * 100}%`;
                shape.style.animationDuration = `${16 + Math.random() * 16}s`;
                shape.style.animationDelay = `${Math.random() * 8}s`;

                elements.shapesContainer.appendChild(shape);
        }
}

function handleSwipe(startX, endX) {
        const distance = startX - endX;
        if (Math.abs(distance) < 50) return;

        if (distance > 0) {
                fetchRandomQuote();
        } else if (state.quoteHistory.length > 1) {
                const previousQuote = state.quoteHistory[state.quoteHistory.length - 2];
                displayQuote(previousQuote.text, previousQuote.author, previousQuote.category, false);
        }
}

function persistState() {
        localStorage.setItem("baiza_theme", state.currentTheme);
        localStorage.setItem("baiza_category", state.currentCategory);
        localStorage.setItem("baiza_count", String(state.quotesViewed));
        localStorage.setItem("baiza_history", JSON.stringify(state.quoteHistory.slice(-10)));
}

function restoreState() {
        const savedTheme = localStorage.getItem("baiza_theme");
        const savedCategory = localStorage.getItem("baiza_category");
        const savedCount = Number(localStorage.getItem("baiza_count") || "0");
        const savedAutoTheme = localStorage.getItem("baiza_auto_theme");
        const savedHistory = localStorage.getItem("baiza_history");

        if (savedTheme) {
                setTheme(savedTheme);
        }

        if (savedCategory) {
                state.currentCategory = savedCategory;
                updateCategoryBadge(savedCategory);
                document.querySelectorAll(".category-btn").forEach((button) => {
                        button.classList.toggle("active", button.dataset.category === savedCategory);
                });
        } else {
                updateCategoryBadge("all");
        }

        if (!Number.isNaN(savedCount)) {
                state.quotesViewed = savedCount;
        }

        if (savedHistory) {
                try {
                        state.quoteHistory = JSON.parse(savedHistory);
                        updateHistoryDisplay();
                } catch (error) {
                        state.quoteHistory = [];
                }
        }

        if (savedAutoTheme === "1") {
                document.getElementById("autoTheme").classList.add("active");
                setupAutoTheme(true);
        }
}

function setupEventListeners() {
        document.querySelectorAll(".theme-btn").forEach((button) => {
                button.addEventListener("click", (event) => {
                        const selectedTheme = event.currentTarget.dataset.theme;

                        if (selectedTheme === "auto") {
                                toggleAutoTheme();
                        } else {
                                document.getElementById("autoTheme").classList.remove("active");
                                localStorage.setItem("baiza_auto_theme", "0");
                                setupAutoTheme(false);
                                setTheme(selectedTheme);
                                showToast(`Theme changed to ${selectedTheme}`, "success");
                        }
                });
        });

        document.querySelectorAll(".category-btn").forEach((button) => {
                button.addEventListener("click", (event) => {
                        setCategory(event.currentTarget.dataset.category);
                });
        });

        elements.generateBtn.addEventListener("click", fetchRandomQuote);
        elements.copyBtn.addEventListener("click", copyQuote);
        elements.shareBtn.addEventListener("click", shareQuote);
        elements.downloadBtn.addEventListener("click", downloadQuoteAsImage);

        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener("touchstart", (event) => {
                touchStartX = event.changedTouches[0].screenX;
        });

        document.addEventListener("touchend", (event) => {
                touchEndX = event.changedTouches[0].screenX;
                handleSwipe(touchStartX, touchEndX);
        });

        document.addEventListener("keydown", (event) => {
                if (event.code === "Space") {
                        event.preventDefault();
                        fetchRandomQuote();
                        return;
                }

                if (event.code === "ArrowRight") {
                        fetchRandomQuote();
                        return;
                }

                if ((event.ctrlKey || event.metaKey) && event.code === "KeyC") {
                        event.preventDefault();
                        copyQuote();
                        return;
                }

                if ((event.ctrlKey || event.metaKey) && event.code === "KeyD") {
                        event.preventDefault();
                        downloadQuoteAsImage();
                }
        });
}

function init() {
        createParticles();
        createGeometricShapes();
        warmTypefitCache();
        prefetchBackgrounds(state.currentCategory, "", 2);
        setupEventListeners();
        restoreState();
        updateCategoryBadge(state.currentCategory);
        updateStats();
        startSessionTimer();
        fetchRandomQuote();
        showToast("Quote engine loaded", "success");
}

window.addEventListener("DOMContentLoaded", init);
