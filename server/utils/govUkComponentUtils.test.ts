import { GovUkSummaryListItem } from '../@types/user-defined'
import GovUKComponentUtils from './govUkComponentUtils'

describe('GovUKComponentUtils', () => {
  describe('summaryListRowsWithAndWithoutActions', () => {
    it('should return items unchanged when all items have action items', () => {
      const items: Array<GovUkSummaryListItem> = [
        {
          key: { text: 'Name' },
          value: { text: 'John Doe' },
          actions: { items: [{ text: 'Edit', href: '/edit', visuallyHiddenText: 'name' }] },
        },
        {
          key: { text: 'Age' },
          value: { text: '30' },
          actions: { items: [{ text: 'Change', href: '/change', visuallyHiddenText: 'age' }] },
        },
      ]

      const result = GovUKComponentUtils.summaryListRowsWithAndWithoutActions(items)

      expect(result).toEqual(items)
    })

    it('should add no-actions class to items without action items when some items have action items', () => {
      const items: Array<GovUkSummaryListItem> = [
        {
          key: { text: 'Name' },
          value: { text: 'John Doe' },
          actions: { items: [{ text: 'Edit', href: '/edit', visuallyHiddenText: 'name' }] },
        },
        {
          key: { text: 'Age' },
          value: { text: '30' },
          actions: { items: [] },
        },
      ]

      const result = GovUKComponentUtils.summaryListRowsWithAndWithoutActions(items)

      expect(result[0].classes).toBeUndefined()
      expect(result[1].classes).toBe('govuk-summary-list__row--no-actions')
    })

    it('should add no-actions class when item has empty actions items array', () => {
      const items: Array<GovUkSummaryListItem> = [
        {
          key: { text: 'Status' },
          value: { text: 'Active' },
          actions: { items: [] },
        },
      ]

      const result = GovUKComponentUtils.summaryListRowsWithAndWithoutActions(items)

      expect(result[0].classes).toBe('govuk-summary-list__row--no-actions')
    })

    it('should add no-actions class when item has undefined actions', () => {
      const items: Array<GovUkSummaryListItem> = [
        {
          key: { text: 'Status' },
          value: { text: 'Active' },
          actions: undefined,
        },
      ]

      const result = GovUKComponentUtils.summaryListRowsWithAndWithoutActions(items)

      expect(result[0].classes).toBe('govuk-summary-list__row--no-actions')
    })

    it('should add no-actions class when item has no action items and no existing classes', () => {
      const items: Array<GovUkSummaryListItem> = [
        {
          key: { text: 'Status' },
          value: { text: 'Active' },
        },
        {
          key: { text: 'Status' },
          value: { text: 'Active' },
          classes: '',
        },
        {
          key: { text: 'Status' },
          value: { text: 'Active' },
          classes: undefined,
        },
        {
          key: { text: 'Status' },
          value: { text: 'Active' },
          classes: null,
        },
      ]

      const results = GovUKComponentUtils.summaryListRowsWithAndWithoutActions(items)

      results.forEach(result => {
        expect(result.classes).toBe('govuk-summary-list__row--no-actions')
      })
    })

    it('should append no-actions class when item has no action items and existing classes', () => {
      const items: Array<GovUkSummaryListItem> = [
        {
          key: { text: 'Status' },
          value: { text: 'Active' },
          classes: 'custom-class another-class',
        },
      ]

      const result = GovUKComponentUtils.summaryListRowsWithAndWithoutActions(items)

      expect(result[0].classes).toBe('custom-class another-class govuk-summary-list__row--no-actions')
    })
  })

  describe('buildSummaryListItem', () => {
    it('should build summary list item with text content by default', () => {
      const result = GovUKComponentUtils.buildSummaryListItem({ label: 'Name', content: 'John Doe' })

      expect(result).toEqual({
        key: { text: 'Name' },
        value: { text: 'John Doe' },
      })
    })

    it('should build summary list item with text content when contentIsHtml is false', () => {
      const result = GovUKComponentUtils.buildSummaryListItem({
        label: 'Name',
        content: 'John Doe',
        contentIsHtml: false,
      })

      expect(result).toEqual({
        key: { text: 'Name' },
        value: { text: 'John Doe' },
      })
    })

    it('should build summary list item with html content when contentIsHtml is true', () => {
      const htmlContent = '<strong>Important</strong>'
      const result = GovUKComponentUtils.buildSummaryListItem({
        label: 'Status',
        content: htmlContent,
        contentIsHtml: true,
      })

      expect(result).toEqual({
        key: { text: 'Status' },
        value: { html: htmlContent },
      })
    })

    it('should build summary list item with undefined value when content is undefined', () => {
      const result = GovUKComponentUtils.buildSummaryListItem({ label: 'Notes', content: undefined })

      expect(result).toEqual({
        key: { text: 'Notes' },
        value: { text: undefined },
      })
    })

    it('should build summary list item with undefined html value when content is undefined and contentIsHtml is true', () => {
      const result = GovUKComponentUtils.buildSummaryListItem({
        label: 'Notes',
        content: undefined,
        contentIsHtml: true,
      })

      expect(result).toEqual({
        key: { text: 'Notes' },
        value: { html: undefined },
      })
    })
  })

  describe('buildSummaryListItems', () => {
    it('should build multiple summary list items', () => {
      const items = [
        { label: 'Name', content: 'John Doe' },
        { label: 'Age', content: '30' },
        { label: 'Status', content: '<strong>Active</strong>', contentIsHtml: true },
        { label: 'Notes', content: undefined },
      ]

      const result = GovUKComponentUtils.buildSummaryListItems(items)

      expect(result).toEqual([
        {
          key: { text: 'Name' },
          value: { text: 'John Doe' },
        },
        {
          key: { text: 'Age' },
          value: { text: '30' },
        },
        {
          key: { text: 'Status' },
          value: { html: '<strong>Active</strong>' },
        },
        {
          key: { text: 'Notes' },
          value: { text: undefined },
        },
      ])
    })

    it('should remove empty rows if required', () => {
      const items = [
        { label: 'Name', content: 'John Doe' },
        { label: 'Age', content: '' },
        { label: 'Status', content: null },
        { label: 'Notes', content: undefined },
      ]

      const result = GovUKComponentUtils.buildSummaryListItems(items, true)

      expect(result).toEqual([
        {
          key: { text: 'Name' },
          value: { text: 'John Doe' },
        },
      ])
    })
  })
})
