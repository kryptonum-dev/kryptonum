export default async function imageToInlineSvg(url: string) {
  try {
    const response = await fetch(url)
    const contentType = response.headers.get('content-type')
    if (contentType !== 'image/svg+xml') return null
    const svgContent = await response.text()
    return svgContent
  } catch (error) {
    throw new Error(`Error fetching SVG: ${error}`)
  }
}
