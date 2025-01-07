export const getLocaleFromPath = (pathname: string) => {
  const [, locale] = pathname.split('/');
  return locale === "en" ? "en" : "pl";
}
