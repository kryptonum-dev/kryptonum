/**
 * Server-side cookie getter
 *
 * @param name - The name of the cookie to retrieve
 * @param source - Server cookie string, headers, or request object
 * @returns The cookie value or empty string if not found
 */
export const getCookie = (
  name: string,
  source: string | Headers | Request
): string => {
  let cookieString = '';

  if (typeof source === 'string') {
    cookieString = source;
  } else if (source instanceof Headers) {
    cookieString = source.get('cookie') || '';
  } else if (source instanceof Request) {
    cookieString = source.headers.get('cookie') || '';
  }

  if (!cookieString) return '';

  const cookies = cookieString.split(';').map(cookie => cookie.trim());
  const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));

  if (cookie) {
    const cookieValue = cookie.substring(name.length + 1);
    return decodeURIComponent(cookieValue);
  }

  return '';
};
