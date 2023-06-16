import { FC, useState } from 'react'
import { HorizontalTabs } from '../../ui'

const initialTabsData = [
	{
		isActive: true,
		title: 'Active competitions'
	},
	{
		isActive: false,
		title: 'My competitions'
	},
	{
		isActive: false,
		title: 'Archive'
	}
]

const tabsContent = ['first tab data', 'second tab data', 'third tab data']

export const CompetitionRating: FC = () => {
	const [tabsData, setTabsData] = useState(initialTabsData)
	const [activeIndex, setActiveIndex] = useState(0)

	const handleTabClick = (index: number) => {
		const newTabsData = [...tabsData]
		newTabsData.forEach(item => {
			item.isActive = false
		})
		newTabsData[index].isActive = !tabsData[index].isActive
		setTabsData(newTabsData)
		setActiveIndex(index)
	}

	return (
		<>
			<HorizontalTabs tabs={tabsData} handleClick={handleTabClick} />
			<h1>{tabsContent[activeIndex]}</h1>
		</>
	)
}
