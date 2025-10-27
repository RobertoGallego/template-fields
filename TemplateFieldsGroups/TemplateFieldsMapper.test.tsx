import userEvent from '@testing-library/user-event'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import * as labelsHook from 'src/components/presentationals/shared/fields/LabelSelector/useLabels'
import {
  MOCK_CHECKBOX_ATTRIBUTE,
  MOCK_DATEPICKER_ATTRIBUTE,
  MOCK_FISHING_METHOD_ID_ATTRIBUTE,
  MOCK_INPUT_ATTRIBUTE,
  MOCK_INPUT_NUMBER_ATTRIBUTE,
  MOCK_LABEL_IDS_ATTRIBUTE,
  MOCK_MULTI_SELECT_ATTRIBUTE,
  MOCK_QUALITY_ATTRIBUTE,
  MOCK_RADIO_ATTRIBUTE,
  MOCK_RANGE_DATEPICKER_ATTRIBUTE,
  MOCK_SINGLE_SELECT_ATTRIBUTE,
  MOCK_STORE_LABELS,
  MOCK_TOGGLE_ATTRIBUTE,
  MOCK_TRANSLATED_INPUT_ATTRIBUTE,
  MOCK_VARIETY_ID_ATTRIBUTE,
  render,
  waitFor,
} from 'src/testing'
import { FormattedPermission } from 'src/types'

import TemplateFieldsMapper, { TemplateFieldsMapperProps } from './TemplateFieldsMapper'

describe('TemplateFieldsMapper', () => {
  const defaultProps: TemplateFieldsMapperProps = {
    attribute: MOCK_CHECKBOX_ATTRIBUTE,
    isValidation: false,
  }

  const MockFormProvider = ({
    defaultValues,
    props = defaultProps,
  }: {
    defaultValues?: any
    props?: TemplateFieldsMapperProps
  }) => {
    const form = useForm({ defaultValues })

    return (
      <FormProvider {...form}>
        <TemplateFieldsMapper {...props} />
      </FormProvider>
    )
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return a checkbox if the attribute has fieldType equals to "CHECKBOX"', () => {
    const view = render(<MockFormProvider />)
    expect(view.getByTestId('checkbox-field')).toBeInTheDocument()
  })

  it('should return a datepicker if the attribute has fieldType equals to "DATEPICKER"', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_DATEPICKER_ATTRIBUTE,
    }
    const view = render(<MockFormProvider props={customProps} />)
    expect(view.getByTestId('datepicker-field')).toBeInTheDocument()
  })

  it('should return a fishing method selector if the attribute has fieldType equals to "FISHING_METHOD_SELECT"', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_FISHING_METHOD_ID_ATTRIBUTE,
    }
    const view = render(<MockFormProvider props={customProps} />)
    expect(view.getByTestId('fishingMethodId-field')).toBeInTheDocument()
  })

  it('should return an input if the attribute has fieldType equals to "INPUT"', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_INPUT_ATTRIBUTE,
    }
    const view = render(<MockFormProvider props={customProps} />)
    expect(view.getByTestId('input-field')).toBeInTheDocument()
  })

  it('should return an input number if the attribute has fieldType equals to "INPUT_NUMBER"', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_INPUT_NUMBER_ATTRIBUTE,
    }
    const view = render(<MockFormProvider props={customProps} />)
    expect(view.getByTestId('inputNumber-field')).toBeInTheDocument()
  })

  it('should return a label selector if the attribute has fieldType equals to "LABEL_SELECT", and seller has labels', () => {
    jest.spyOn(labelsHook, 'useLabels').mockReturnValue({
      labels: MOCK_STORE_LABELS,
      isInitialLoading: false,
    })

    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_LABEL_IDS_ATTRIBUTE,
    }
    const view = render(<MockFormProvider props={customProps} />)
    expect(view.getByTestId('labelIds-field')).toBeInTheDocument()
  })

  it('should return a multi select if the attribute has fieldType equals to "MULTI_SELECT"', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_MULTI_SELECT_ATTRIBUTE,
    }
    const view = render(<MockFormProvider props={customProps} />)
    expect(view.getByTestId('multiSelect-field')).toBeInTheDocument()
  })

  it('should return a quality selector if the attribute has fieldType equals to "QUALITY_SELECT"', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_QUALITY_ATTRIBUTE,
    }
    const view = render(<MockFormProvider props={customProps} />)
    expect(view.getByTestId('quality-field')).toBeInTheDocument()
  })

  it('should return a radio if the attribute has fieldType equals to "RADIO"', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_RADIO_ATTRIBUTE,
    }
    const view = render(<MockFormProvider props={customProps} />)
    expect(view.getByTestId('radio-field')).toBeInTheDocument()
  })

  it('should return a range datepicker if the attribute has fieldType equals to "RANGE_DATEPICKER"', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_RANGE_DATEPICKER_ATTRIBUTE,
    }
    const view = render(<MockFormProvider props={customProps} />)
    expect(view.getByTestId('rangeDatepicker-field')).toBeInTheDocument()
  })

  it('should return a single select if the attribute has fieldType equals to "SINGLE_SELECT"', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_SINGLE_SELECT_ATTRIBUTE,
    }
    const view = render(<MockFormProvider props={customProps} />)
    expect(view.getByTestId('singleSelect-field')).toBeInTheDocument()
  })

  it('should return a toggle if the attribute has fieldType equals to "TOGGLE"', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_TOGGLE_ATTRIBUTE,
    }
    const view = render(<MockFormProvider props={customProps} />)
    expect(view.getByTestId('toggle-field')).toBeInTheDocument()
  })

  it('should return a translated input if the attribute has fieldType equals to "TRANSLATED_INPUT"', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_TRANSLATED_INPUT_ATTRIBUTE,
    }
    const view = render(<MockFormProvider props={customProps} />)
    expect(view.getByTestId('translatedInput-field')).toBeInTheDocument()
  })

  it('should return a variety select if the attribute has fieldType equals to "VARIETY_SELECT"', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_VARIETY_ID_ATTRIBUTE,
    }
    const view = render(<MockFormProvider props={customProps} />)
    expect(view.getByTestId('varietyId-field')).toBeInTheDocument()
  })

  it('should display a warning message, given an attribute required at validation with no value provided with "isValidation" also equals to true', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: { ...MOCK_INPUT_ATTRIBUTE, requiredAtValidation: true },
      isValidation: true,
    }

    const view = render(<MockFormProvider props={customProps} />)

    expect(view.getByTestId('input-warning-message')).toBeInTheDocument()
  })

  it('should not display a warning message, given an attribute required at validation with a value provided with "isValidation" also equals to true', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: { ...MOCK_INPUT_ATTRIBUTE, requiredAtValidation: true },
      isValidation: true,
    }

    const view = render(<MockFormProvider props={customProps} defaultValues={{ input: 'input' }} />)

    expect(view.queryByTestId('input-warning-message')).not.toBeInTheDocument()
  })

  it('should not display a warning message, given an attribute required at validation with no value provided with "isValidation" also equals to false', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: { ...MOCK_INPUT_ATTRIBUTE, requiredAtValidation: true },
      isValidation: false,
    }

    const view = render(<MockFormProvider props={customProps} />)

    expect(view.queryByTestId('input-warning-message')).not.toBeInTheDocument()
  })

  it('should return a field if the permission is missing', () => {
    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_INPUT_ATTRIBUTE,
      permission: undefined,
    }

    const view = render(<MockFormProvider props={customProps} />)

    expect(view.getByTestId('input-field')).toBeInTheDocument()
  })

  it('should return a field, given a permission with visible set to true', () => {
    const permission: FormattedPermission = {
      disabledReason: 'This field cannot be edited',
      enabled: false,
      visible: true,
    }

    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_INPUT_ATTRIBUTE,
      permission,
    }

    const view = render(<MockFormProvider props={customProps} />)

    expect(view.getByTestId('input-field')).toBeInTheDocument()
  })

  it('should not return a field, given a permission with visible set to false', () => {
    const permission: FormattedPermission = {
      disabledReason: 'This field cannot be edited',
      enabled: false,
      visible: false,
    }

    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_INPUT_ATTRIBUTE,
      permission,
    }

    const view = render(<MockFormProvider props={customProps} />)

    expect(view.queryByTestId('input-field')).not.toBeInTheDocument()
  })

  it('should return a disabled field with the correct reason, if the permission is set with enabled equals to false', async () => {
    const disabledReason = 'this field is disabled'

    const permission: FormattedPermission = {
      disabledReason: 'this field is disabled',
      enabled: false,
      visible: true,
    }

    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_INPUT_ATTRIBUTE,
      permission,
    }
    const view = render(<MockFormProvider props={customProps} />)

    expect(view.getByTestId('input-field')).toBeDisabled()

    await waitFor(() => {
      userEvent.hover(view.getByTestId('input-field--label--helpText'))
      expect(view.getByText(disabledReason)).toBeInTheDocument()
    })
  })

  it('should return an enabled field, if the permission is set with enabled equals to true', () => {
    const permission: FormattedPermission = {
      disabledReason: '',
      enabled: true,
      visible: true,
    }

    const customProps: TemplateFieldsMapperProps = {
      ...defaultProps,
      attribute: MOCK_INPUT_ATTRIBUTE,
      permission,
    }

    const view = render(<MockFormProvider props={customProps} />)

    expect(view.getByTestId('input-field')).toBeEnabled()

    expect(view.queryByTestId('input-field--label--helpText')).not.toBeInTheDocument()
  })
})
