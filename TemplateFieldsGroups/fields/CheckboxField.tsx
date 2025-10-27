import React, { useMemo } from 'react'

import { Checkbox, CheckboxGroup } from '@design-system'

import { TemplateFieldProps } from 'src/types'

const CheckboxField = ({ values, ...props }: TemplateFieldProps) => {
  const selectedOptionsName = useMemo(
    () => values?.filter(({ value }) => props.value?.includes(value)).map(({ label }) => label),
    [JSON.stringify({ values, value: props.value })]
  )

  return (
    <CheckboxGroup {...props} format="toggled" value={selectedOptionsName}>
      {values?.map(option => (
        <Checkbox content={option.label} key={option.value} name={option.label} />
      ))}
    </CheckboxGroup>
  )
}

export default CheckboxField
