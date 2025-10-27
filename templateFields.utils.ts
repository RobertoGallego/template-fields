import { RegisterOptions, SetValueConfig } from 'react-hook-form'

import { ProductTemplateFieldType } from 'src/types'
import { REQUIRED_MESSAGE } from 'src/utils/form/validationRules.utils'

export const shouldValidateNotDirtyConfig: SetValueConfig = {
  shouldDirty: false,
  shouldValidate: true,
}

export const shouldValidateAndDirtyConfig: SetValueConfig = {
  shouldDirty: true,
  shouldValidate: true,
}

export const REQUIRED_AT_VALIDATION_MESSAGE = gettext('This field is required for validation')

export const requiredArrayValueRule: RegisterOptions = {
  validate: {
    nonEmpty: (arrayValue?: (Id | string)[] | null) =>
      (arrayValue && arrayValue.length > 0) || REQUIRED_MESSAGE,
  },
}

export const isArrayField = (fieldType: ProductTemplateFieldType) =>
  fieldType === ProductTemplateFieldType.CHECKBOX ||
  fieldType === ProductTemplateFieldType.LABEL_SELECT ||
  fieldType === ProductTemplateFieldType.MULTI_SELECT

export const isSelectField = (fieldType: ProductTemplateFieldType) =>
  [
    ProductTemplateFieldType.SINGLE_SELECT,
    ProductTemplateFieldType.MULTI_SELECT,
    ProductTemplateFieldType.INPUT_NUMBER_SELECT,
  ].includes(fieldType)
