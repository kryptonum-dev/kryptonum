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

/**
 * Extract plain text from portable text blocks (for nested portable text fields)
 */
const extractPlainText = (blocks: any[] | undefined): string => {
  if (!blocks || !Array.isArray(blocks)) return ''
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) return ''
      return block.children.map((child: { text: string }) => child.text).join('')
    })
    .join(' ')
    .trim()
}

/**
 * Render nested portable text blocks to HTML
 */
const renderNestedPortableText = async (blocks: any[] | undefined): Promise<string> => {
  if (!blocks || !Array.isArray(blocks)) return ''
  return portableTextToHTML(blocks)
}

/**
 * Handle Quote component
 * Schema: { text: PortableText, person: { name, headline, img } }
 */
const handleQuote = async (block: any): Promise<string> => {
  const quoteText = await renderNestedPortableText(block.text)
  const personName = block.person?.name || ''
  const personHeadline = block.person?.headline || ''

  let html = `<blockquote>${quoteText}`
  if (personName) {
    html += `<footer><cite>${personName}`
    if (personHeadline) {
      html += `, ${personHeadline}`
    }
    html += `</cite></footer>`
  }
  html += `</blockquote>`
  return html
}

/**
 * Handle ListWithIcon component
 * Schema: { list: [{ heading, paragraph, sublist }] }
 */
const handleListWithIcon = async (block: any): Promise<string> => {
  if (!block.list || !Array.isArray(block.list)) return ''

  let html = '<ul>'
  for (const item of block.list) {
    const heading = extractPlainText(item.heading)
    const paragraph = await renderNestedPortableText(item.paragraph)

    html += `<li><strong>${heading}</strong>`
    if (paragraph) {
      html += paragraph
    }

    // Handle nested sublist
    if (item.sublist && Array.isArray(item.sublist)) {
      html += '<ul>'
      for (const subitem of item.sublist) {
        const subHeading = extractPlainText(subitem.heading)
        const subParagraph = await renderNestedPortableText(subitem.paragraph)
        html += `<li><strong>${subHeading}</strong>`
        if (subParagraph) html += subParagraph
        html += '</li>'
      }
      html += '</ul>'
    }
    html += '</li>'
  }
  html += '</ul>'
  return html
}

/**
 * Handle NumberedStepsList component
 * Schema: { paragraph: PortableText, list: [{ heading, paragraph }] }
 */
const handleNumberedStepsList = async (block: any): Promise<string> => {
  let html = ''

  // Intro paragraph
  const introParagraph = await renderNestedPortableText(block.paragraph)
  if (introParagraph) {
    html += introParagraph
  }

  // Numbered list
  if (block.list && Array.isArray(block.list)) {
    html += '<ol>'
    for (const item of block.list) {
      const heading = extractPlainText(item.heading)
      const paragraph = await renderNestedPortableText(item.paragraph)
      html += `<li><strong>${heading}</strong>`
      if (paragraph) html += paragraph
      html += '</li>'
    }
    html += '</ol>'
  }
  return html
}

/**
 * Handle ProsAndCons component
 * Schema: { pros: { heading, items: string[] }, cons: { heading, items: string[] } }
 */
const handleProsAndCons = (block: any): string => {
  let html = ''

  // Pros
  if (block.pros) {
    const prosHeading = extractPlainText(block.pros.heading)
    html += `<h4>${prosHeading}</h4><ul>`
    if (block.pros.items && Array.isArray(block.pros.items)) {
      for (const item of block.pros.items) {
        html += `<li>${item}</li>`
      }
    }
    html += '</ul>'
  }

  // Cons
  if (block.cons) {
    const consHeading = extractPlainText(block.cons.heading)
    html += `<h4>${consHeading}</h4><ul>`
    if (block.cons.items && Array.isArray(block.cons.items)) {
      for (const item of block.cons.items) {
        html += `<li>${item}</li>`
      }
    }
    html += '</ul>'
  }

  return html
}

/**
 * Handle DoAndDonts component
 * Schema: { elements: [{ isDo: boolean, heading, paragraph }] }
 */
const handleDoAndDonts = async (block: any): Promise<string> => {
  if (!block.elements || !Array.isArray(block.elements)) return ''

  let html = '<ul>'
  for (const item of block.elements) {
    const heading = extractPlainText(item.heading)
    const paragraph = await renderNestedPortableText(item.paragraph)
    const prefix = item.isDo ? '✓' : '✗'
    html += `<li><strong>${prefix} ${heading}</strong>`
    if (paragraph) html += paragraph
    html += '</li>'
  }
  html += '</ul>'
  return html
}

/**
 * Handle FAQ component
 * Schema: { heading: PortableText, list: [{ question, answer } | reference] }
 */
const handleFaq = async (block: any): Promise<string> => {
  let html = ''

  // FAQ heading
  const heading = extractPlainText(block.heading)
  if (heading) {
    html += `<h3>${heading}</h3>`
  }

  // FAQ items
  if (block.list && Array.isArray(block.list)) {
    html += '<dl>'
    for (const item of block.list) {
      // Handle inline FAQ items
      if (item._type === 'inline_item' && item.question) {
        const answer = await renderNestedPortableText(item.answer)
        html += `<dt>${item.question}</dt><dd>${answer}</dd>`
      }
      // Note: References would need separate fetching, skip for simplicity
    }
    html += '</dl>'
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
    // Standard block (paragraphs, headings)
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
    }
    // Image block
    else if (block._type === 'image' || block._type === 'Image') {
      html += `<img src="${(block as any).asset?.url}" alt="${(block as any).alt || ''}" />`
    }
    // Quote component
    else if (block._type === 'Quote') {
      html += await handleQuote(block)
    }
    // ListWithIcon component
    else if (block._type === 'ListWithIcon') {
      html += await handleListWithIcon(block)
    }
    // NumberedStepsList component
    else if (block._type === 'NumberedStepsList') {
      html += await handleNumberedStepsList(block)
    }
    // ProsAndCons component
    else if (block._type === 'ProsAndCons') {
      html += handleProsAndCons(block)
    }
    // DoAndDonts component
    else if (block._type === 'DoAndDonts') {
      html += await handleDoAndDonts(block)
    }
    // FAQ component
    else if (block._type === 'Faq') {
      html += await handleFaq(block)
    }
    // Skip non-content blocks (Video, Author, CTAs)
    // These are intentionally not rendered for articleBody
  }

  return html
}

/**
 * Calculate word count from portable text blocks
 * Uses `any` type because portable text blocks include many custom component types
 */
export const calculateWordCount = (blocks: any): number => {
  if (!blocks) return 0
  if (!Array.isArray(blocks)) {
    blocks = [blocks]
  }

  let wordCount = 0

  for (const block of blocks) {
    if (block._type === 'block' && block.children) {
      const text = block.children.map((child: any) => child.text || '').join(' ')
      wordCount += text.split(/\s+/).filter((word: string) => word.length > 0).length
    } else if (block._type === 'Quote') {
      wordCount += calculateWordCount(block.text || [])
    } else if (block._type === 'NumberedStepsList') {
      wordCount += calculateWordCount(block.paragraph || [])
      if (block.list && Array.isArray(block.list)) {
        for (const item of block.list) {
          wordCount += calculateWordCount(item.heading || [])
          wordCount += calculateWordCount(item.paragraph || [])
        }
      }
    } else if (block._type === 'ListWithIcon' && block.list) {
      for (const item of block.list) {
        wordCount += calculateWordCount(item.heading || [])
        wordCount += calculateWordCount(item.paragraph || [])
        if (item.sublist) {
          for (const subitem of item.sublist) {
            wordCount += calculateWordCount(subitem.heading || [])
            wordCount += calculateWordCount(subitem.paragraph || [])
          }
        }
      }
    } else if (block._type === 'ProsAndCons') {
      if (block.pros?.heading) wordCount += calculateWordCount(block.pros.heading)
      if (block.pros?.items) wordCount += block.pros.items.join(' ').split(/\s+/).length
      if (block.cons?.heading) wordCount += calculateWordCount(block.cons.heading)
      if (block.cons?.items) wordCount += block.cons.items.join(' ').split(/\s+/).length
    } else if (block._type === 'DoAndDonts' && block.elements) {
      for (const item of block.elements) {
        wordCount += calculateWordCount(item.heading || [])
        wordCount += calculateWordCount(item.paragraph || [])
      }
    } else if (block._type === 'Faq' && block.list) {
      wordCount += calculateWordCount(block.heading || [])
      for (const item of block.list) {
        if (item._type === 'inline_item') {
          wordCount += (item.question || '').split(/\s+/).length
          wordCount += calculateWordCount(item.answer || [])
        }
      }
    }
  }

  return wordCount
}
