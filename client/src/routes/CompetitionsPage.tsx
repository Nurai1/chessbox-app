import { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { HorizontalTabs, Loader } from 'src/ui'
import { fetchCompetitions } from 'src/store/slices/competitionsSlice'
import {
	activeCompetitionsSelector,
	currentUserCompetitionsSelector,
	expiredCompetitionsSelector
} from 'src/store/selectors/competitions'
import { CompetitionCard } from 'src/components'
import { CompetitionSchema } from 'src/types'

export const CompetitionsPage = (): ReactElement => {
	const dispatch = useAppDispatch()
	const { data: competitionData, loading: isLoading } = useAppSelector(state => state.competitions)
	const [competitions, setCompetitions] = useState<{
		activeIndex: number
		competitionsData: CompetitionSchema[] | []
	}>({
		activeIndex: 0,
		competitionsData: []
	})
	const authorizedUserId = useAppSelector(state => state.user.authorizedUser?._id)
	const competitionsActive = useAppSelector(activeCompetitionsSelector)
	const currentUserCompetitions = useAppSelector(currentUserCompetitionsSelector(authorizedUserId))
	const expiredCompetitions = useAppSelector(expiredCompetitionsSelector)

	useEffect(() => {
		dispatch(fetchCompetitions())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch])

	useEffect(() => {
		setCompetitions({
			...competitions,
			competitionsData: competitionsActive
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, competitionData])

	return (
		<main className='container m-auto grow px-[17px] pt-[15px] md:px-7 md:pt-[25px] lg:px-10 lg:pt-[33px] 2xl:px-[40px]'>
			<h1 className='2xl:[mb-40px] mb-[13px] text-heading-4 xl:mb-[17px] xl:text-heading-1'>Competitions</h1>
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
								isActive: competitions.activeIndex === 0,
								title: 'Active',
								onClick: () => {
									setCompetitions({
										activeIndex: 0,
										competitionsData: competitionsActive
									})
								}
							},
							{
								isActive: competitions.activeIndex === 1,
								title: 'My competitions',
								onClick: () => {
									setCompetitions({
										activeIndex: 1,
										competitionsData: currentUserCompetitions
									})
								}
							},
							{
								isActive: competitions.activeIndex === 2,
								title: 'Archive',
								onClick: () => {
									setCompetitions({
										activeIndex: 2,
										competitionsData: expiredCompetitions
									})
								}
							}
						]}
					/>
					<div className='lg:rounded-3xl lg:border lg:border-[#DADADA] lg:px-[30px] lg:pb-[8px] xl:border-0 xl:p-0'>
						{competitions.competitionsData.map(competition => (
							<CompetitionCard competition={competition} key={competition._id} />
						))}
					</div>
				</div>
			)}
		</main>
	)
}
