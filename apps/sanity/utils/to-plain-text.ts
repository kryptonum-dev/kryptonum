export function toPlainText(blocks = []) {
  if (!Array.isArray(blocks)) return blocks
  return blocks
    .map((block: { _type?: string; children?: { text: string }[] }) => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return block.children.map(child => child.text).join('')
    })
    .join('\n\n')
}
