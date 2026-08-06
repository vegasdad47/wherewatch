/**
 * Locale detection for TMDB API calls.
 * Parses Accept-Language header and matches against TMDB's supported languages.
 * Falls back to "en-US" for unsupported or missing languages.
 */

// TMDB-supported languages (subset of ISO 639-1 + region where needed)
// Full list: https://developers.themoviedb.org/3/configuration/get-primary-translations
const TMDB_LANGUAGES = new Set([
  "ar", "bg", "ca", "cs", "da", "de", "el", "en", "es", "eu", "fa",
  "fi", "fr", "gl", "he", "hi", "hr", "hu", "id", "it", "ja", "ko",
  "lt", "lv", "nb", "nl", "pl", "pt", "ro", "ru", "sk", "sl", "sr",
  "sv", "th", "tr", "uk", "vi", "zh",
]);

// Map common region variants to TMDB language codes
const REGION_MAP: Record<string, string> = {
  "en-us": "en-US",
  "en-gb": "en-GB",
  "pt-br": "pt-BR",
  "pt-pt": "pt-PT",
  "zh-cn": "zh-CN",
  "zh-tw": "zh-TW",
  "zh-hk": "zh-HK",
  "fr-ca": "fr-CA",
  "fr-fr": "fr-FR",
  "es-es": "es-ES",
  "es-mx": "es-MX",
  "de-de": "de-DE",
  "de-at": "de-AT",
  "de-ch": "de-CH",
  "it-it": "it-IT",
  "ja-jp": "ja-JP",
  "ko-kr": "ko-KR",
  "nl-nl": "nl-NL",
  "nl-be": "nl-BE",
  "sv-se": "sv-SE",
  "nb-no": "nb-NO",
  "da-dk": "da-DK",
  "fi-fi": "fi-FI",
  "pl-pl": "pl-PL",
  "ru-ru": "ru-RU",
  "th-th": "th-TH",
  "vi-vn": "vi-VN",
  "id-id": "id-ID",
  "hi-in": "hi-IN",
  "tr-tr": "tr-TR",
  "ar-sa": "ar-SA",
  "he-il": "he-IL",
  "el-gr": "el-GR",
  "cs-cz": "cs-CZ",
  "ro-ro": "ro-RO",
  "hu-hu": "hu-HU",
  "sk-sk": "sk-SK",
  "uk-ua": "uk-UA",
  "bg-bg": "bg-BG",
  "hr-hr": "hr-HR",
  "sr-rs": "sr-RS",
  "lt-lt": "lt-LT",
  "lv-lv": "lv-LV",
  "sl-si": "sl-SI",
  "ca-es": "ca-ES",
  "eu-es": "eu-ES",
  "gl-es": "gl-ES",
  "fa-ir": "fa-IR",
};

/**
 * Parse Accept-Language header and return the best TMDB language code.
 * Falls back to "en-US" if no match.
 */
export function getTmdbLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return "en-US";

  const locales = acceptLanguage
    .split(",")
    .map((entry) => {
      const [tag, qPart] = entry.trim().split(";");
      const quality = qPart ? parseFloat(qPart.replace(/^q=/, "")) : 1.0;
      return { tag: tag.toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of locales) {
    // Exact match in region map (e.g., "zh-cn" → "zh-CN")
    if (REGION_MAP[tag]) return REGION_MAP[tag];

    // Try the base language (e.g., "ja" from "ja-jp")
    const base = tag.split("-")[0];
    if (TMDB_LANGUAGES.has(base)) {
      // For "en", default to "en-US"
      if (base === "en") return "en-US";
      // For "zh", default to "zh-CN"
      if (base === "zh") return "zh-CN";
      // For "pt", default to "pt-BR"
      if (base === "pt") return "pt-BR";
      // For "fr", default to "fr-FR"
      if (base === "fr") return "fr-FR";
      // For "es", default to "es-ES"
      if (base === "es") return "es-ES";
      // For "de", default to "de-DE"
      if (base === "de") return "de-DE";
      return `${base}-${base.toUpperCase()}`;
    }
  }

  return "en-US";
}
