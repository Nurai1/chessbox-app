import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { FC, useState } from 'react'

import { GeneralSelectProps, MultipleSelectProps, Select, SingleSelectProps } from './Select'

export default {
	title: 'Select',
	component: Select
} as ComponentMeta<typeof Select>

const options = [
	{ value: 'RockStar Gaming', id: 'RockStar Gaming ID' },
	{ value: 'CD Project Red', id: 'CD Project Red ID' },
	{ value: 'Van Hellsing', id: 'Van Hellsing ID' },
	{ value: 'Future Is Now', id: 'Future Is Now ID' },
	{ value: 'Rebuild The Consciousness', id: 'Rebuild The Consciousness ID' },
	{ value: 'Literally Nothing But The Biggest String Here', id: 'Literally Nothing But The Biggest String Here ID' }
]
const Template: ComponentStory<FC<GeneralSelectProps & SingleSelectProps>> = args => {
	const [chosenId, setChosenId] = useState<string>()
	return (
		<div className='w-full'>
			<Select {...args} chosenId={chosenId} onChange={id => setChosenId(id)} />
		</div>
	)
}

export const Default = Template.bind({})
Default.args = {
	label: 'Select label',
	isRequired: true,
	menuOptions: options
}

export const WithPlaceholder = Template.bind({})
WithPlaceholder.args = {
	label: 'Select label',
	isRequired: false,
	placeholder: 'Please select',
	menuOptions: options
}

const MultipleTemplate: ComponentStory<FC<GeneralSelectProps & MultipleSelectProps>> = args => {
	const [chosenIds, setChosenIds] = useState<string[]>([])
	return (
		<div className='w-full'>
			<Select
				{...args}
				placeholder='Please select'
				multiple
				chosenIds={chosenIds}
				onChange={ids => setChosenIds(ids)}
			/>
		</div>
	)
}

export const MultipleDefault = MultipleTemplate.bind({})
MultipleDefault.args = {
	label: 'Multiple Select Label',
	menuOptions: options
}

export const MultipleWithSearch = MultipleTemplate.bind({})
MultipleWithSearch.args = {
	label: 'Multiple With UsersSearch Select Label',
	withSearch: true,
	menuOptions: options
}
