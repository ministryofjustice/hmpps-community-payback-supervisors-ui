import { LinkItem } from '../@types/user-defined'

export default class LayoutUtils {
  static getFooterItems(footerLinks: LinkItem[] = []): LinkItem[] {
    return [
      ...footerLinks,
      {
        href: '/cookies',
        text: 'Cookies policy',
      },
      {
        href: '/privacy-notice',
        text: 'Privacy notice',
      },
    ]
  }
}
