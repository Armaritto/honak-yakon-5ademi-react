export const FONT_STORAGE_KEY = 'preferredArabicFont';

export const ARABIC_FONT_OPTIONS = [
    {
        id: 'cairo',
        label: 'القاهرة',
        value: "'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    },
    {
        id: 'tajawal',
        label: 'تجوال',
        value: "'Tajawal', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    },
    {
        id: 'amiri',
        label: 'أميري',
        value: "'Amiri', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', serif",
    },
    {
        id: 'Roboto',
        label: 'روبوتو',
        value: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    }
];

const getOptionById = (fontId) => ARABIC_FONT_OPTIONS.find((option) => option.id === fontId);

export const getDefaultFontId = () => ARABIC_FONT_OPTIONS[0].id;

export const getStoredFontId = () => {
    const savedFontId = localStorage.getItem(FONT_STORAGE_KEY);
    if (savedFontId && getOptionById(savedFontId)) {
        return savedFontId;
    }
    return getDefaultFontId();
};

export const setStoredFontId = (fontId) => {
    if (getOptionById(fontId)) {
        localStorage.setItem(FONT_STORAGE_KEY, fontId);
    }
};

export const applyFontById = (fontId) => {
    const selectedOption = getOptionById(fontId) || ARABIC_FONT_OPTIONS[0];
    document.documentElement.style.setProperty('--app-font-family', selectedOption.value);
};

export const initializeStoredFont = () => {
    const fontId = getStoredFontId();
    applyFontById(fontId);
    return fontId;
};
