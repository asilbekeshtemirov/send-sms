/**
 * Universal SMS template - qaysi til kelsa ham shu shablon ishlatiladi
 * @param {string} languageName - Til nomi (masalan: "RUS TILI", "INGLIZ TILI")
 * @returns {string} SMS matni
 */
function createUniversalTemplate(languageName) {
    return `${languageName} kurslari! 3 oyda natija. PROMO: SALOM30 -30% chegirma. To'lov: https://q.me-qr.com/nFNxNYGL`;
}

/**
 * Get SMS template for ANY language
 * Accepts any language name and converts it to uppercase + " TILI"
 * @param {string} language - Language name (e.g., 'rus', 'ingliz', 'italyan', etc.)
 * @returns {string} SMS template
 */
function getTemplate(language) {
    // Any language name is accepted
    const normalizedLang = language.toLowerCase().trim();

    if (!normalizedLang) {
        return null;
    }

    // Convert to uppercase and add " TILI"
    const languageName = normalizedLang.toUpperCase() + ' TILI';

    return createUniversalTemplate(languageName);
}

/**
 * Get all available languages
 * Since we accept ANY language, return empty array or common examples
 * @returns {Array} Array of example language codes
 */
function getAvailableLanguages() {
    // Return common examples, but API accepts ANY language
    return [
        'rus', 'ingliz', 'turk', 'koreys', 'nemis',
        'fransuz', 'xitoy', 'ispan', 'arab', 'yapon', 'qozoq'
    ];
}

/**
 * Get language name for display
 * Converts any input to "LANGUAGE TILI" format
 * @param {string} language - Language code
 * @returns {string} Language name in format "XXX TILI"
 */
function getLanguageName(language) {
    const normalizedLang = language.toLowerCase().trim();

    if (!normalizedLang) {
        return null;
    }

    return normalizedLang.toUpperCase() + ' TILI';
}

module.exports = {
    getTemplate,
    getAvailableLanguages,
    getLanguageName,
    createUniversalTemplate
};
