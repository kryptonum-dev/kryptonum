/** Meta browser ids, saved with the lead so a conversion can be matched to the ad click. */
export const getMetaIdsForSheet = () => {
  if (typeof document === 'undefined') return '';
  const getCookie = (name: string) =>
    document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))?.slice(name.length + 1) || '';
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc');
  return [fbp && `fbp=${fbp}`, fbc && `fbc=${fbc}`].filter(Boolean).join('\n');
};

export const shouldTrackAnalytics = () => {
  if (typeof window !== 'undefined') {
    return !window.location.hostname.startsWith('kryptonum.eu');
  }
  return false;
};
