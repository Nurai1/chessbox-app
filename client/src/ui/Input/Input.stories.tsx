import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'

import { Input, InputPropsType } from './Input'

export default {
	title: 'Input',
	component: Input
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = (args: InputPropsType) => <Input {...args} />

export const Simple = Template.bind({})
Simple.args = {
	label: 'Text Input label',
	placeholder: '',
	isRequired: true
}

export const WithValidationMessage = Template.bind({})
WithValidationMessage.args = {
	label: 'Text Input label',
	placeholder: '',
	isRequired: true,
	validationErrorText: 'This field is required'
}

export const SearchInput = Template.bind({})
SearchInput.args = {
	label: 'Search Input label',
	placeholder: 'Search active services',
	isSearch: true
}

export const Textarea: ComponentStory<typeof Input> = (args: InputPropsType) => {
	const [text, setText] = useState<string>()
	return <Input {...args} isTextarea onChange={val => setText(val)} value={text} />
}
Textarea.args = {
	label: 'Textarea label',
	placeholder: 'Enter your notes here',
	isRequired: false
}
