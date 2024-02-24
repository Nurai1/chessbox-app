import { ReactElement, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactComponent as DragIcon } from 'src/assets/drag-icon.svg'
import { CompetitionCreateHeader } from 'src/components'
import { AppRoute } from 'src/constants/appRoute'
import { swapArray } from 'src/helpers/swapArray'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import {
	fetchCompetitionById,
	fetchCompetitionJudges,
	resetCompetitionGroupsOrdersStatus,
	setCompetitionData,
	setCompetitionGroupsOrders
} from 'src/store/slices/competitionSlice'
import { CompetitionGroupSchema, CompetitionGroupsOrders, CompetitionSchema } from 'src/types'
import { Alert, BottomFixedContainer, Button, DragAndDropProvider, DragSortItem, RoundedBorderWrapper } from 'src/ui'
import { twMerge } from 'tailwind-merge'

export const OrdersToGroupAssignPage = (): ReactElement => {
	const { competitionId } = useParams()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const [groups, setGroups] = useState<CompetitionGroupSchema[] | undefined>()
	const competitionData = useAppSelector(s => s.competition.data)
	const judges = useAppSelector(s => s.competition.judges[competitionId as string])
	const { groupOrderAssignPending, groupOrderAssignSuccess, groupOrderAssignError } = useAppSelector(s => s.competition)

	useEffect(() => {
		if (!competitionData) {
			dispatch(fetchCompetitionById(competitionId as string))
		}

		if (!judges) {
			dispatch(fetchCompetitionJudges(competitionId as string))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (competitionData?.groups?.length === 0) {
			navigate(`../${AppRoute.CreateGroup}`)
		} else {
			setGroups(competitionData?.groups)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [competitionData])

	useEffect(() => {
		if (groupOrderAssignSuccess) {
			navigate(`../${AppRoute.JudgeAssign}`)
			dispatch(resetCompetitionGroupsOrdersStatus())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groupOrderAssignSuccess])

	const sortItems = (dragIndex: number, hoverIndex: number) => {
		setGroups(swapArray(groups as CompetitionGroupSchema[], dragIndex, hoverIndex))
	}

	const handleDoneClick = () => {
		const groupOrder = groups?.reduce((acc, group, i) => {
			acc.push({
				groupId: group._id as string,
				order: i
			})
			return acc
		}, [] as CompetitionGroupsOrders)

		dispatch(
			setCompetitionData({
				...competitionData,
				groups: groups as CompetitionGroupSchema[]
			} as CompetitionSchema)
		)

		dispatch(
			setCompetitionGroupsOrders({
				orders: {
					orders: groupOrder as CompetitionGroupsOrders
				},
				id: competitionId as string
			})
		)
	}

	const handleBackClick = () => {
		dispatch(
			setCompetitionData({
				...competitionData,
				groups: groups as CompetitionGroupSchema[]
			} as CompetitionSchema)
		)

		navigate(`../${AppRoute.CreatePairs}`)
	}

	return (
		<main className='container mx-auto grow px-[17px] pt-8 pb-[5.5rem] md:py-9 md:pb-28 xl:pt-14 xl:pl-[7.5rem] xl:pr-[7.5rem]'>
			<CompetitionCreateHeader
				title='Assign orders to groups 3/4'
				backArrowPath={`../${AppRoute.CreatePairs}`}
				competitionData={competitionData}
				judges={judges}
			/>
			{groups && (
				<RoundedBorderWrapper classes='py-4 xl:py-7'>
					<DragAndDropProvider>
						{groups.map(({ _id: groupId, gender, ageCategory, weightCategory, currentRoundPairs }, i) => (
							<DragSortItem
								key={groupId}
								index={i}
								sortItems={sortItems}
								classes={twMerge(
									'flex items-center relative py-4 xl:py-[1.62rem] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-300'
								)}
							>
								<DragIcon className='mr-5' />
								<h3 className='mr-2 font-bold text-grey xl:text-2xl'>{i + 1}</h3>
								<h3 className='font-bold xl:text-2xl'>
									<span className='capitalize'>{gender}</span> {ageCategory?.from}-{ageCategory?.to} age,{' '}
									{weightCategory?.from}-{weightCategory?.to}kg
									{currentRoundPairs?.length && (
										<span className='text-zinc-400'>
											{' '}
											{currentRoundPairs?.length} {`pair${currentRoundPairs?.length === 1 ? '' : 's'}`}
										</span>
									)}
								</h3>
							</DragSortItem>
						))}
					</DragAndDropProvider>
				</RoundedBorderWrapper>
			)}
			<BottomFixedContainer classes='xl:pl-[7.5rem] xl:pr-[7.5rem]'>
				<div className='flex flex-wrap gap-2.5'>
					<Button type='outlined' onClick={handleBackClick}>
						Previous step
					</Button>
					<Button
						classes='min-w-[8rem] xl:min-w-[15.625rem]'
						onClick={handleDoneClick}
						loading={groupOrderAssignPending}
					>
						Done
					</Button>
					{groupOrderAssignError && <Alert type='error' subtitle={groupOrderAssignError} />}
				</div>
			</BottomFixedContainer>
		</main>
	)
}
