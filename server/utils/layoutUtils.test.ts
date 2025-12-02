import { LinkItem } from '../@types/user-defined'
import LayoutUtils, { staticFooterLinks } from './layoutUtils'

describe('LayoutUtils', () => {
  it('prepends additional links to the static footer links', () => {
    const footerLinks = [
      { href: '/1', text: 'first' },
      { href: '/2', text: 'second' },
    ]
    const result = LayoutUtils.getFooterItems(footerLinks)

    expect(result).toEqual([{ href: '/1', text: 'first' }, { href: '/2', text: 'second' }, ...staticFooterLinks])
  })

  it.each([[undefined], [[]]])(
    'returns original static footer links if passed empty or undefined',
    (links: LinkItem[] | undefined) => {
      const result = LayoutUtils.getFooterItems(links)

      expect(result).toEqual(staticFooterLinks)
    },
  )
})
