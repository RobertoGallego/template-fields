import { camelCase, isNil } from 'lodash'
import React, { Fragment, memo, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { Card, Inline, Stack } from '@procsea/design-system'

import { FormattedPermissions, ProductTemplate } from 'src/types'
import { requiredRule } from 'src/utils/form/validationRules.utils'

import { CardSubtitle, CardTitle } from '../../display'
import {
  isArrayField,
  requiredArrayValueRule,
  shouldValidateNotDirtyConfig,
} from '../templateFields.utils'
import TemplateFieldsMapper from './TemplateFieldsMapper'

export interface TemplateFieldsGroupProps<ItemType> {
  isPanel?: boolean
  isValidation?: boolean
  item?: ItemType
  template?: ProductTemplate
  permissions?: FormattedPermissions<string, string>
  productId?: Id
}

const TemplateFieldsGroups = <ItemType extends unknown>({
  isPanel,
  isValidation = false,
  item,
  template,
  permissions,
  productId,
}: TemplateFieldsGroupProps<ItemType>) => {
  const form = useFormContext()

  useEffect(() => {
    template?.groups.forEach(group =>
      group.attributes.forEach(attribute => {
        const formFieldName = camelCase(attribute.fieldName)
        const formFieldNameSelect = camelCase(attribute.fieldNameSelect ?? undefined)
        const itemValue = item?.[formFieldName as keyof ItemType] ?? undefined
        const rule = isArrayField(attribute.fieldType) ? requiredArrayValueRule : requiredRule

        form.unregister(formFieldName)
        form.register(formFieldName, attribute.requiredAtCreation ? rule : undefined)

        if (!isNil(itemValue)) {
          form.setValue(formFieldName, itemValue, shouldValidateNotDirtyConfig)
        }

        if (!!formFieldNameSelect) {
          const formFieldNameSelectValue =
            item?.[formFieldNameSelect as keyof ItemType] ?? undefined
          form.unregister(formFieldNameSelect)
          form.register(formFieldNameSelect, attribute.requiredAtCreation ? rule : undefined)
          if (!isNil(formFieldNameSelectValue)) {
            form.setValue(
              formFieldNameSelect,
              formFieldNameSelectValue,
              shouldValidateNotDirtyConfig
            )
          }
        }
      })
    )
  }, [JSON.stringify({ item, template })])

  if (!template?.groups) return null

  if (isPanel) {
    return (
      <Stack spacing="large">
        {template.groups.map(group => (
          <Fragment key={group.name}>
            <CardSubtitle bold subtitle={group.name} />

            <Stack spacing="medium">
              {group.attributes.map(attribute => (
                <TemplateFieldsMapper
                  attribute={attribute}
                  fluid={isPanel}
                  key={attribute.fieldName}
                  isValidation={isValidation}
                  permission={permissions?.attributes?.[camelCase(attribute.fieldName)]}
                  productId={productId}
                  template={template}
                />
              ))}
            </Stack>
          </Fragment>
        ))}
      </Stack>
    )
  }

  return (
    <Stack spacing="large">
      {template.groups.map(group => (
        <Card data-e2e={`${group.name}-card`} key={group.name} shadow="low" spacing="medium">
          <CardTitle hasMarginBottom title={group.name} />

          <Inline spacing="large" alignment="flex-end">
            {group.attributes.map(attribute => (
              <TemplateFieldsMapper
                attribute={attribute}
                key={attribute.fieldName}
                isValidation={isValidation}
                permission={permissions?.attributes?.[camelCase(attribute.fieldName)]}
                productId={productId}
                template={template}
              />
            ))}
          </Inline>
        </Card>
      ))}
    </Stack>
  )
}

export default memo(TemplateFieldsGroups)
