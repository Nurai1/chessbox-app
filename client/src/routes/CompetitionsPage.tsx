import { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { HorizontalTabs, Loader } from 'src/ui'
import { fetchCompetitions } from 'src/store/slices/competitionsSlice'
import { CompetitionCard } from '../components'
import { CompetitionSchema } from '../types'
import { isPast } from '../helpers/datetime'
import { authorizedUserId } from '../mock/authorizedUserId' // имитация залогиненного юзера

export const CompetitionsPage = (): ReactElement => {
	const dispatch = useAppDispatch()
	const isLoading = useAppSelector(competition => competition.competitions.loading)
	const [activeCompetitions, setActiveCompetitions] = useState<{
		activeIndex: number
		competitionsData: CompetitionSchema[] | []
	}>({
		activeIndex: 0,
		competitionsData: []
	})

	const competitions = useAppSelector(competition => competition.competitions.data)
	const getActiveCompetitions = () => competitions.filter(competition => !isPast(competition.endDate as string))
	const getCurrentUserCompetitions = () =>
		getActiveCompetitions().filter(competition => competition.participants?.includes(authorizedUserId))
	const getExpiredCompetitions = () => competitions.filter(competition => isPast(competition.endDate as string))

	useEffect(() => {
		dispatch(fetchCompetitions())
	}, [dispatch])

	useEffect(() => {
		setActiveCompetitions({
			...activeCompetitions,
			competitionsData: getActiveCompetitions()
		})
		// eslint-disable-next-line
	}, [competitions])

	return (
		<main className='container m-auto px-[17px] pt-[15px] md:px-7 md:pt-[25px] lg:px-10 lg:pt-[33px] 2xl:px-[40px]'>
			<h1 className='2xl:[mb-40px] mb-[13px] text-[24px] font-semibold xl:mb-[17px] xl:text-[54px] xl:font-bold'>
				Competitions
			</h1>
			{isLoading && <Loader classes='h-[80vh]' />}
			{!isLoading && (
				<div
					className='xl:rounded-3xl xl:border xl:border-[#DADADA] xl:px-[25px] xl:pt-[20px] xl:pb-[5px]
			2xl:px-[10px] 2xl:pt-[30px] 2xl:pb-[12px]'
				>
					<HorizontalTabs
						tabMinWidth='155'
						classes='pb-[30px] md:border-[#DADADA] md:border-b lg:border-0 lg:pb-[17px] xl:pb-[20px] xl:border-b 2xl:pb-[28px] 2xl:px-[24px]'
						tabs={[
							{
								isActive: activeCompetitions.activeIndex === 0,
								title: 'Active',
								onClick: () => {
									setActiveCompetitions({
										activeIndex: 0,
										competitionsData: getActiveCompetitions()
									})
								}
							},
							{
								isActive: activeCompetitions.activeIndex === 1,
								title: 'My competitions',
								onClick: () => {
									setActiveCompetitions({
										activeIndex: 1,
										competitionsData: getCurrentUserCompetitions()
									})
								}
							},
							{
								isActive: activeCompetitions.activeIndex === 2,
								title: 'Archive',
								onClick: () => {
									setActiveCompetitions({
										activeIndex: 2,
										competitionsData: getExpiredCompetitions()
									})
								}
							}
						]}
					/>
					<div className='lg:rounded-3xl lg:border lg:border-[#DADADA] lg:px-[30px] lg:pb-[8px] xl:border-0 xl:p-0'>
						{activeCompetitions.competitionsData.map(competition => (
							<CompetitionCard competition={competition} key={competition._id} />
						))}
					</div>
				</div>
			)}
		</main>
	)
}
