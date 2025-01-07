export const getLocaleFromPath = (pathname: string) => {
  const [, locale] = pathname.split('/');
  return locale || "pl"
}
