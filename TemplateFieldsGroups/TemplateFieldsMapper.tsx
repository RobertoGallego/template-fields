import { camelCase, isNil, isString } from 'lodash'
import React, { memo, useCallback, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import {
  Datepicker,
  FormOnChange,
  Input,
  InputNumberSelector,
  InputSelect,
  QualitySelector,
  Select,
  Toggle,
} from '@procsea/design-system'

import { shouldNotValidateButDirtyConfig } from 'src/components/presentationals/seller-dashboard/market/shared/product-instance-form/SellerProductInstanceForm.utils'
// @TODO: Those kind of field should not be linked to a buyer or a seller
import { FishingMethodSelector } from 'src/components/presentationals/seller-dashboard/shared/fields'
import { useLocale } from 'src/hooks'
import {
  AttributeValue,
  FormattedPermission,
  ProductTemplate,
  ProductTemplateAttribute,
  ProductTemplateFieldType,
  TemplateFieldProps,
} from 'src/types'

import { ExpandTextarea, LabelSelector, TranslatedInput, VarietySelector } from '../../fields'
import {
  REQUIRED_AT_VALIDATION_MESSAGE,
  isSelectField,
  shouldValidateAndDirtyConfig,
} from '../templateFields.utils'
import { CheckboxField, RadioField } from './fields'

export interface TemplateFieldsMapperProps {
  attribute: ProductTemplateAttribute
  fluid?: boolean
  isValidation: boolean
  permission?: FormattedPermission
  productId?: Id
  template?: ProductTemplate
}
type Field = (props: TemplateFieldProps) => JSX.Element | null
const Fields: Record<ProductTemplateFieldType, Field> = {
  [ProductTemplateFieldType.CHECKBOX]: CheckboxField,
  [ProductTemplateFieldType.DATEPICKER]: Datepicker,
  [ProductTemplateFieldType.FISHING_METHOD_SELECT]: FishingMethodSelector,
  [ProductTemplateFieldType.INPUT]: Input,
  [ProductTemplateFieldType.INPUT_NUMBER]: InputNumberSelector,
  [ProductTemplateFieldType.INPUT_NUMBER_SELECT]: ({ options = [], ...props }) => (
    <InputSelect options={options} isSingleOptionReadOnly={false} clearable {...props} />
  ),
  [ProductTemplateFieldType.LABEL_SELECT]: LabelSelector,
  [ProductTemplateFieldType.MULTI_SELECT]: ({ options = [], ...props }) => (
    <Select<Id, true> {...props} multiple options={options} searchable />
  ),
  [ProductTemplateFieldType.QUALITY_SELECT]: QualitySelector,
  [ProductTemplateFieldType.RADIO]: RadioField,
  [ProductTemplateFieldType.RANGE_DATEPICKER]: props => <Datepicker {...props} withRange />,
  [ProductTemplateFieldType.SINGLE_SELECT]: ({ options = [], ...props }) => (
    <Select<Id, false> clearable {...props} options={options} />
  ),
  [ProductTemplateFieldType.TEXTAREA]: props => (
    <ExpandTextarea {...props} maxLength={320} buttonLabel={props.label} />
  ),
  [ProductTemplateFieldType.TOGGLE]: Toggle,
  [ProductTemplateFieldType.TRANSLATED_INPUT]: TranslatedInput,
  [ProductTemplateFieldType.VARIETY_SELECT]: VarietySelector,
}

type FormFieldValue = [
  FormValue: unknown,
  relatedFieldValuesIds?: Id[],
  fieldNameSelectValue?: unknown,
]

const TemplateFieldsMapper = ({
  attribute,
  fluid,
  isValidation,
  permission,
  productId,
  template,
}: TemplateFieldsMapperProps) => {
  const locale = useLocale()
  const form = useFormContext()
  const formFieldName = camelCase(attribute.fieldName)
  const fieldNameSelect = camelCase(attribute.fieldNameSelect ?? undefined)
  const relatedFieldName = camelCase(attribute.relatedFieldName ?? undefined)
  const fields = useWatch({
    control: form.control,
    name: [formFieldName, relatedFieldName, fieldNameSelect],
  })
  const [formValue, relatedFieldValuesIds, fieldNameSelectValue] = Object.values(
    fields
  ) as FormFieldValue
  const isEmptyValue =
    isNil(formValue) ||
    ((Array.isArray(formValue) || isString(formValue)) && formValue.length === 0)

  const getValues = useCallback(() => {
    if (!!relatedFieldName) {
      const allAttributes = template?.groups
        .flatMap(group => group)
        .flatMap(({ attributes }) => attributes)
      const relatedField = allAttributes?.find(
        attr => attr.fieldName === attribute.relatedFieldName
      )
      if (!!relatedField && !!relatedField.values) {
        return relatedField?.values.reduce((total, current) => {
          if (relatedFieldValuesIds?.find((id: Id) => id === current.value)) total.push(current)
          return total
        }, [] as AttributeValue[])
      }
    }
    return attribute.values ?? undefined
  }, [
    relatedFieldName,
    JSON.stringify({ relatedFieldValuesIds, template, values: attribute.values }),
  ])

  const warningMessage =
    attribute.requiredAtValidation && !attribute.requiredAtCreation && isEmptyValue && isValidation
      ? REQUIRED_AT_VALIDATION_MESSAGE
      : undefined

  useEffect(() => {
    if (relatedFieldValuesIds?.length === 1) {
      form.setValue(formFieldName, relatedFieldValuesIds[0])
    }
  }, [JSON.stringify(relatedFieldValuesIds)])

  const handleCheckboxChange: FormOnChange<string[]> = useCallback(
    ({ value: newValue }) => {
      const selectedOptionsId =
        attribute.values
          ?.filter(({ label }) => newValue.includes(label))
          .map(({ value }) => value) || []
      form.setValue(formFieldName, selectedOptionsId, shouldValidateAndDirtyConfig)
    },
    [formFieldName, JSON.stringify(attribute.values)]
  )

  const handleChange = useCallback(
    ({ value: newValue }) => form.setValue(formFieldName, newValue, shouldValidateAndDirtyConfig),
    [formFieldName]
  )

  const handleOnOptionChange = useCallback(
    ({ value: newValue }) => {
      if (fieldNameSelect) form.setValue(fieldNameSelect, newValue, shouldNotValidateButDirtyConfig)
    },
    [fieldNameSelect]
  )

  const shouldDisplayTheTemplateField = !permission || permission.visible

  const isFieldDisabled = () => {
    if (!!permission) return !permission.enabled
    if (isValidation && !attribute.displayedAtValidation) return true
    return undefined
  }

  const sharedProps: TemplateFieldProps = {
    'data-e2e': `${formFieldName}-field`,
    defaultLocale: ProductTemplateFieldType.TRANSLATED_INPUT ? locale : undefined,
    disabled: isFieldDisabled(),
    errorMessage: form.errors[fieldNameSelect]?.message || form.errors[formFieldName]?.message,
    helpText: permission?.disabledReason,
    key: formFieldName,
    fluid,
    label: attribute.label,
    name: formFieldName,
    onChange:
      attribute.fieldType === ProductTemplateFieldType.CHECKBOX
        ? handleCheckboxChange
        : handleChange,
    onOptionChange:
      attribute.fieldType === ProductTemplateFieldType.INPUT_NUMBER_SELECT
        ? handleOnOptionChange
        : undefined,
    options: isSelectField(attribute.fieldType) ? getValues() : undefined,
    selectedOption:
      attribute.fieldType === ProductTemplateFieldType.INPUT_NUMBER_SELECT
        ? fieldNameSelectValue
        : undefined,
    productId:
      attribute.fieldType === ProductTemplateFieldType.FISHING_METHOD_SELECT ||
      attribute.fieldType === ProductTemplateFieldType.VARIETY_SELECT
        ? productId
        : undefined,
    required: attribute.requiredAtCreation,
    value: formValue,
    values: getValues(),
    warningMessage,
  }
  const TemplateField = Fields[attribute.fieldType]
  return shouldDisplayTheTemplateField ? <TemplateField {...sharedProps} /> : null
}
export default memo(TemplateFieldsMapper)
