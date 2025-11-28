import { LinkItem } from '../@types/user-defined'
import LayoutUtils from './layoutUtils'

describe('LayoutUtils', () => {
  it('adds additional links to the footer links', () => {
    const footerLinks = [
      { href: '/1', text: 'first' },
      { href: '/2', text: 'second' },
    ]
    const result = LayoutUtils.getFooterItems(footerLinks)

    expect(result).toEqual([
      { href: '/1', text: 'first' },
      { href: '/2', text: 'second' },
      {
        href: '/cookies',
        text: 'Cookies policy',
      },
      {
        href: '/privacy-notice',
        text: 'Privacy notice',
      },
    ])
  })

  it.each([[undefined], [[]]])(
    'returns original footer links if passed empty or undefined',
    (links: LinkItem[] | undefined) => {
      const result = LayoutUtils.getFooterItems(links)

      expect(result).toEqual([
        {
          href: '/cookies',
          text: 'Cookies policy',
        },
        {
          href: '/privacy-notice',
          text: 'Privacy notice',
        },
      ])
    },
  )
})
