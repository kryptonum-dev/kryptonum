import type { PortableTextValue } from '@repo/ui/portable-text'
import sanityFetch from '@repo/utils/sanity.fetch'

const getInternalSlug = async (ref: string) => {
  const data = await sanityFetch<string>({
    query: `*[_type == $type][0].slug.current`,
    params: { type: ref },
  })
  return data
}

const handleMarks = async (text: string, marks: string[] = [], markDefs: any[] = []) => {
  const processedMarks = await marks.reduce(async (promise, mark) => {
    const acc = await promise
    const markDef = markDefs.find((def) => def._key === mark)

    if (markDef?._type === 'link') {
      let href = ''
      if (markDef.linkType === 'internal' && markDef.internal?._ref) {
        const slug = await getInternalSlug(markDef.internal._ref)
        href = slug
      } else if (markDef.linkType === 'external') {
        href = markDef.external
      }

      const target = markDef.linkType === 'external' ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${href}"${target}>${acc}</a>`
    }

    const markTags: Record<string, [string, string]> = {
      strong: ['<strong>', '</strong>'],
      em: ['<em>', '</em>'],
      underline: ['<u>', '</u>'],
    }

    const [openTag, closeTag] = markTags[mark] || ['', '']
    return `${openTag}${acc}${closeTag}`
  }, Promise.resolve(text))

  return processedMarks
}

const renderBlock = (style: string, content: string): string => {
  const blockTags: Record<string, [string, string]> = {
    h1: ['<h1>', '</h1>'],
    h2: ['<h2>', '</h2>'],
    h3: ['<h3>', '</h3>'],
    h4: ['<h4>', '</h4>'],
    blockquote: ['<blockquote>', '</blockquote>'],
    normal: ['<p>', '</p>'],
  }
  const [openTag, closeTag] = blockTags[style] || blockTags.normal
  return `${openTag}${content}${closeTag}`
}

const handleListTransition = (currentType: string | null, newType: string | null): string => {
  let html = ''
  if (currentType && currentType !== newType) {
    html += `</${currentType === 'bullet' ? 'ul' : 'ol'}>`
  }
  if (newType && currentType !== newType) {
    html += `<${newType === 'bullet' ? 'ul' : 'ol'}>`
  }
  return html
}

export const portableTextToHTML = async (blocks: PortableTextValue): Promise<string> => {
  if (!Array.isArray(blocks)) {
    blocks = [blocks]
  }

  let currentListType: string | null = null
  let html = ''

  for (const [index, block] of blocks.entries()) {
    if (block._type === 'block' && block.children) {
      const processedChildren = await Promise.all(
        block.children.map((child: any) => handleMarks(child.text, child.marks, block.markDefs))
      )
      const text = processedChildren.join('')

      if (block.listItem) {
        html += handleListTransition(currentListType, block.listItem)
        currentListType = block.listItem
        html += `<li>${text}</li>`

        if (index === blocks.length - 1 || blocks[index + 1]?.listItem !== block.listItem) {
          html += handleListTransition(currentListType, null)
          currentListType = null
        }
      } else {
        if (currentListType) {
          html += handleListTransition(currentListType, null)
          currentListType = null
        }
        html += renderBlock(block.style || 'normal', text)
      }
    } else if (block._type === 'image') {
      html += `<img src="${(block as any).asset?.url}" alt="${(block as any).alt || ''}" />`
    }
  }

  return html
}
