import { isValidProfileLink } from './profile-link'

export type RtGateInput = {
  socialMediaLinks?: string
  totalFollowers?: string
  salesRange?: string
}

/**
 * qualified — real profile link plus either any sales or 300k+ reach;
 * below-threshold — real profile link but neither; junk — no usable link
 * (only possible by bypassing the form's client-side validation).
 */
export type RtGateResult = 'qualified' | 'below-threshold' | 'junk'

export function evaluateRtGate(data: RtGateInput): RtGateResult {
  const hasValidLink = !!data.socialMediaLinks && isValidProfileLink(data.socialMediaLinks)
  if (!hasValidLink) return 'junk'
  const sellsAlready = !!data.salesRange && data.salesRange !== 'Jeszcze nie sprzedaję'
  const hasBigReach = data.totalFollowers === '300 000 – 500 000' || data.totalFollowers === '500 000+'
  return sellsAlready || hasBigReach ? 'qualified' : 'below-threshold'
}
