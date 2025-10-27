import userEvent from '@testing-library/user-event'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import {
  MOCK_MULTI_SELECT_ATTRIBUTE,
  MOCK_PRODUCT_TEMPLATE,
  MOCK_PRODUCT_TEMPLATE_GROUP,
  MOCK_PROPS_SELLER_PRODUCT_INSTANCE,
  MOCK_RADIO_ATTRIBUTE,
  render,
} from 'src/testing'
import {
  FormattedPermissions,
  ProductTemplate,
  ProductTemplateAttribute,
  ProductTemplateFieldType,
  ProductTemplateGroup,
  SellerProductInstance,
} from 'src/types'

import TemplateFieldsGroups, { TemplateFieldsGroupProps } from './TemplateFieldsGroups'

describe('TemplateFieldsGroups', () => {
  const defaultProps: TemplateFieldsGroupProps<SellerProductInstance> = {
    isValidation: false,
    item: MOCK_PROPS_SELLER_PRODUCT_INSTANCE,
    template: MOCK_PRODUCT_TEMPLATE,
  }

  const MockFormProvider = ({
    props = defaultProps,
  }: {
    props?: TemplateFieldsGroupProps<SellerProductInstance>
  }) => {
    const form = useForm()

    return (
      <FormProvider {...form}>
        <TemplateFieldsGroups {...props} />
      </FormProvider>
    )
  }

  it('should return a card matching with the group in the template', () => {
    const view = render(<MockFormProvider />)
    expect(view.getByTestId(`${MOCK_PRODUCT_TEMPLATE_GROUP.name}-card`)).toBeInTheDocument()
  })

  it('should return a card matching with the group in the template with a disabled input, given a permission with enabled set to false', () => {
    const mockAttribute: ProductTemplateAttribute = {
      code: 'input',
      fieldName: 'input',
      fieldNameSelect: null,
      fieldType: ProductTemplateFieldType.INPUT,
      label: 'Input',
      relatedFieldName: '',
      requiredAtCreation: false,
      requiredAtValidation: false,
      displayedAtValidation: true,
      values: null,
    }

    const mockTemplateGroup: ProductTemplateGroup = {
      attributes: [mockAttribute],
      name: 'group',
    }

    const mockTemplate: ProductTemplate = {
      groups: [mockTemplateGroup],
      name: 'template',
    }

    const disabledReason = 'This field is disabled'

    const mockPermissions: FormattedPermissions<never, string> = {
      actions: {},
      attributes: {
        input: {
          disabledReason,
          enabled: false,
          visible: true,
        },
      },
    }

    const view = render(
      <MockFormProvider
        props={{ ...defaultProps, template: mockTemplate, permissions: mockPermissions }}
      />
    )

    expect(view.getByTestId(`input-field`)).toBeDisabled()
  })

  it('should return a card matching with the group in the template with an enabled input, given a permission with enabled set to true', () => {
    const mockAttribute: ProductTemplateAttribute = {
      code: 'input',
      fieldName: 'input',
      fieldNameSelect: null,
      fieldType: ProductTemplateFieldType.INPUT,
      label: 'Input',
      relatedFieldName: '',
      requiredAtCreation: false,
      requiredAtValidation: false,
      displayedAtValidation: true,
      values: null,
    }

    const mockTemplateGroup: ProductTemplateGroup = {
      attributes: [mockAttribute],
      name: 'group',
    }

    const mockTemplate: ProductTemplate = {
      groups: [mockTemplateGroup],
      name: 'template',
    }

    const mockPermissions: FormattedPermissions<never, string> = {
      actions: {},
      attributes: {
        input: {
          disabledReason: '',
          enabled: true,
          visible: true,
        },
      },
    }

    const view = render(
      <MockFormProvider
        props={{ ...defaultProps, template: mockTemplate, permissions: mockPermissions }}
      />
    )

    expect(view.getByTestId(`input-field`)).toBeEnabled()
  })

  it('should return a card matching with the group in the template with a hidden input, given a permission with visible set to false', () => {
    const mockAttribute: ProductTemplateAttribute = {
      code: 'input',
      fieldName: 'input',
      fieldNameSelect: null,
      fieldType: ProductTemplateFieldType.INPUT,
      label: 'Input',
      relatedFieldName: '',
      requiredAtCreation: false,
      requiredAtValidation: false,
      displayedAtValidation: true,
      values: null,
    }

    const mockTemplateGroup: ProductTemplateGroup = {
      attributes: [mockAttribute],
      name: 'group',
    }

    const mockTemplate: ProductTemplate = {
      groups: [mockTemplateGroup],
      name: 'template',
    }

    const mockPermissions: FormattedPermissions<never, string> = {
      actions: {},
      attributes: {
        input: {
          disabledReason: 'This field cannot be edited',
          enabled: false,
          visible: false,
        },
      },
    }

    const view = render(
      <MockFormProvider
        props={{ ...defaultProps, template: mockTemplate, permissions: mockPermissions }}
      />
    )

    expect(view.queryByTestId(`input-field`)).not.toBeInTheDocument()
  })

  it('should set the values of a field as the selected values of its related field', () => {
    const mockRelatedAttribute: ProductTemplateAttribute = {
      ...MOCK_MULTI_SELECT_ATTRIBUTE,
      fieldName: 'related',
    }

    const mockAttribute: ProductTemplateAttribute = {
      ...MOCK_RADIO_ATTRIBUTE,
      relatedFieldName: 'related',
    }

    const mockTemplateGroup: ProductTemplateGroup = {
      attributes: [mockRelatedAttribute, mockAttribute],
      name: 'group',
    }

    const mockTemplate: ProductTemplate = {
      groups: [mockTemplateGroup],
      name: 'template',
    }

    const view = render(<MockFormProvider props={{ ...defaultProps, template: mockTemplate }} />)
    const select = view.getByRole('combobox')
    userEvent.click(select)
    userEvent.click(view.getByText('aa'))

    expect(view.getByTestId('radio-field')).toHaveTextContent('aa')
  })
})
