export const htmlToString = (html: string) =>
  html
    .replace(/<style([\s\S]*?)<\/style>/gi, '')
    .replace(/<script([\s\S]*?)<\/script>/gi, '')
    .replace(/<\/div>/ig, '\n')
    .replace(/<\/li>/ig, '\n')
    .replace(/<li>/ig, '  *  ')
    .replace(/<\/ul>/ig, '\n')
    .replace(/<\/p>/ig, '\n')
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<[^>]+>/ig, '')
