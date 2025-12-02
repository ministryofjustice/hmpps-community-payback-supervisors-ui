import { LinkItem } from '../@types/user-defined'

export const staticFooterLinks = [
  {
    href: '/cookies',
    text: 'Cookies policy',
  },
  {
    href: '/privacy-notice',
    text: 'Privacy notice',
  },
  {
    href: '/accessibility-statement',
    text: 'Accessibility statement',
  },
]

export default class LayoutUtils {
  static getFooterItems(footerLinks: LinkItem[] = []): LinkItem[] {
    return [...footerLinks, ...staticFooterLinks]
  }
}
