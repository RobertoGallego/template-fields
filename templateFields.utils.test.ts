import { ProductTemplateFieldType } from 'src/types'

import { isArrayField, isSelectField } from './templateFields.utils'

describe('templateFields.utils', () => {
  describe('isArrayField', () => {
    it('should return true, given a "fieldType" equals to "CHECKBOX", "LABEL_SELECT" or "MULTI_SELECT"', () => {
      expect(isArrayField(ProductTemplateFieldType.CHECKBOX)).toBe(true)
      expect(isArrayField(ProductTemplateFieldType.LABEL_SELECT)).toBe(true)
      expect(isArrayField(ProductTemplateFieldType.MULTI_SELECT)).toBe(true)
    })

    it('should return false, given a "fieldType" different from "CHECKBOX", "LABEL_SELECT" or "MULTI_SELECT', () => {
      expect(isArrayField(ProductTemplateFieldType.DATEPICKER)).toBe(false)
      expect(isArrayField(ProductTemplateFieldType.RADIO)).toBe(false)
    })
  })

  describe('isSelectField', () => {
    it('should return true, given a "fieldType" equals to "SINGLE_SELECT" or "MULTI_SELECT"', () => {
      expect(isSelectField(ProductTemplateFieldType.SINGLE_SELECT)).toBe(true)
      expect(isSelectField(ProductTemplateFieldType.MULTI_SELECT)).toBe(true)
    })

    it('should return false, given a "fieldType" different from "SINGLE_SELECT" or "MULTI_SELECT"', () => {
      expect(isSelectField(ProductTemplateFieldType.CHECKBOX)).toBe(false)
      expect(isSelectField(ProductTemplateFieldType.RADIO)).toBe(false)
    })
  })
})
