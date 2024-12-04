export default async function imageToInlineSvg(url: string) {
  try {
    const response = await fetch(url)
    const svgContent = await response.text()
    return svgContent
  } catch (error) {
    throw new Error(`Error fetching SVG: ${error}`)
  }
}
