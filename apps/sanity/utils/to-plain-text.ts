export function toPlainText(blocks = []) {
  return blocks
    .map((block: { _type?: string; children?: { text: string }[] }) => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return block.children.map(child => child.text).join('')
    })
    .join('\n\n')
}
