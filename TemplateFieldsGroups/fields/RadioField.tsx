import React from 'react'

import { Radio, RadioGroup } from '@design-system'

import { TemplateFieldProps } from 'src/types'

const RadioField = ({ values, ...props }: TemplateFieldProps) => (
  <RadioGroup
    {...props}
    allowDeselection
    format="toggled"
    label={!!values && values.length > 0 ? props.label : ''}
  >
    {values?.map(option => (
      <Radio content={option.label} key={option.value} name={option.label} value={option.value} />
    ))}
  </RadioGroup>
)

export default RadioField
