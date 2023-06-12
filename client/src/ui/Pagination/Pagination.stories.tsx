import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

import { Pagination, PaginationPropsType } from './Pagination'

export default {
	title: 'Pagination',
	component: Pagination,
	argTypes: {
		offset: {
			disable: true
		},
		setOffset: {
			disable: true
		}
	}
} as ComponentMeta<typeof Pagination>

const Template: ComponentStory<typeof Pagination> = (args: Omit<PaginationPropsType, 'offset' | 'setOffset'>) => {
	const [offset, setOffset] = useState(0)

	return <Pagination {...args} offset={offset} setOffset={setOffset} />
}

export const SmallAmountPages = Template.bind({})

SmallAmountPages.args = {
	total: 30,
	itemsPerPage: 5
}

export const BigAmountPages = Template.bind({})

BigAmountPages.args = {
	total: 300,
	itemsPerPage: 5
}
