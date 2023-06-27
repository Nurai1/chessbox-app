import { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { HorizontalTabs } from 'src/ui'
import { fetchCompetitions } from 'src/store/slices/competitionsSlice'
import { CompetitionCard } from '../components'
import { competitionsMock } from '../mock'

const tabsContent = ['Active competitions', 'My competitions', 'Archive']
export const CompetitionsPage = (): ReactElement => {
	const dispatch = useAppDispatch()
	const [activeIndex, setActiveIndex] = useState(0)
	useEffect(() => {
		dispatch(fetchCompetitions())
	},[dispatch])

	const competitions = useAppSelector(competition => competition.competitions.data)

	return (
		<main className='container m-auto px-[17px] md:px-7 lg:px-10 pt-[15px] md:pt-[25px] lg:pt-[33px] 2xl:px-[40px]'>
			<h1 className='text-[24px] mb-[13px] font-semibold xl:text-[54px] xl:mb-[17px] xl:font-bold 2xl:[mb-40px]'>Competitions</h1>

			<HorizontalTabs
				tabMinWidth='155'
				classes='pb-[30px]'
				tabs={[
					{
						isActive: activeIndex === 0,
						title: 'Active',
						onClick: () => setActiveIndex(0)
					},
					{
						isActive: activeIndex === 1,
						title: 'My competitions',
						onClick: () => setActiveIndex(1)
					},
					{
						isActive: activeIndex === 2,
						title: 'Archive',
						onClick: () => setActiveIndex(2)
					}
				]}
			/>
			<h3 className='mt-2'>{tabsContent[activeIndex]}</h3>

				<CompetitionCard competition={competitionsMock[0]} isParticipant={false} />
				<CompetitionCard competition={competitionsMock[1]} isParticipant />
				<CompetitionCard competition={competitionsMock[2]} isParticipant={false} />
				<CompetitionCard competition={competitionsMock[3]} isParticipant />

		</main>
	)
}
