export declare const LANGUAGES: readonly ["pl", "en"];
export type Language = typeof LANGUAGES[number];
declare const translations: {
    pl: {
        breadcrumbsName: string;
        skipLink: string;
        'header.services': string;
        'header.caseStudies': string;
        'header.about': string;
    };
    en: {
        breadcrumbsName: string;
        skipLink: string;
        'header.services': string;
        'header.caseStudies': string;
        'header.about': string;
    };
};
export declare function useTranslations(lang: Language): (key: keyof (typeof translations)["pl"]) => string;
export declare const getLocaleFromPath: (pathname: string) => "pl" | "en";
export {};
