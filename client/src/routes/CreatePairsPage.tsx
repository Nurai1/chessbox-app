import { ReactElement, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CompetitionCreateHeader } from 'src/components'
import { AppRoute } from 'src/constants/appRoute'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import {
	fetchCompetitionById,
	fetchCompetitionJudges,
	fetchCompetitionParticipants,
	setParticipantsOrdersByGroup
} from 'src/store/slices/competitionSlice'
import { Accordion, Alert, BottomFixedContainer, Button, Loader, RoundedBorderWrapper, TableBody } from 'src/ui'
import { AlertPropTypes } from 'src/ui/Alert/Alert'
import { getObjectsFromIds } from '../helpers/getObjectFromId'
import { tableSchemaGroupParticipants } from '../helpers/tableSchemas/tableSchemaGroupParticipants'

type AlertType = {
	show: boolean
} & AlertPropTypes
export const CreatePairsPage = (): ReactElement => {
	const { competitionId } = useParams()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const competitionData = useAppSelector(s => s.competition.data)
	const judges = useAppSelector(s => s.competition.judges[competitionId as string])
	const allParticipantsData = useAppSelector(s => s.competition.participants[competitionId as string])
	const { error, loading, setParticipantsOrdersByGroupSuccess } = useAppSelector(s => s.competition)
	const [alertData, setAlertData] = useState<AlertType>({ show: false, type: 'success' })

	useEffect(() => {
		if (error) setAlertData({ show: true, type: 'error', subtitle: error })
	}, [error])

	const [usersOlympicGridPlacesByGroupIds, setUsersOlympicGridPlacesByGroupIds] = useState<
		Record<string, Record<string, string | undefined> | undefined>
	>({})

	useEffect(() => {
		const keyedGroupIds = competitionData?.groups?.reduce((acc, group) => {
			return { ...acc, [group._id as string]: {} }
		}, {})
		if (keyedGroupIds) setUsersOlympicGridPlacesByGroupIds(keyedGroupIds)
	}, [competitionData?.groups])

	useEffect(() => {
		if (judges?.length === 0) {
			navigate(`../${AppRoute.JudgeChoice}`)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [judges])

	useEffect(() => {
		if (!competitionData) {
			dispatch(fetchCompetitionById(competitionId as string))
		}
		if (!judges) {
			dispatch(fetchCompetitionJudges(competitionId as string))
		}
		dispatch(fetchCompetitionParticipants(competitionId as string))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (error) setAlertData({ show: true, type: 'error', subtitle: error })
	}, [error])

	useEffect(() => {
		if (setParticipantsOrdersByGroupSuccess) {
			navigate(`../${AppRoute.OrdersGroupAssign}`)
		}
	}, [setParticipantsOrdersByGroupSuccess, navigate])

	return (
		<main className='container mx-auto grow px-[17px] pt-8 pb-[5.5rem] md:py-9 md:pb-28 xl:pt-14 xl:pl-[7.5rem] xl:pr-[7.5rem]'>
			<Alert
				title={alertData.title}
				subtitle={alertData.subtitle}
				type={alertData.type}
				classes={`fixed -right-56 w-56 transition-[right] duration-300 ${alertData.show && 'right-8'}`}
			/>
			<CompetitionCreateHeader
				title='Create pairs 3/5'
				backArrowPath={`../${AppRoute.CreateGroup}`}
				competitionData={competitionData}
				judges={judges}
			/>

			<h2 className='mb-8 text-heading-3'>Order for olympic grid</h2>

			{competitionData?.groups?.length !== 0 && (
				<RoundedBorderWrapper classes='!py-2'>
					{competitionData?.groups?.map(
						({ _id: groupId, gender, ageCategory, weightCategory, allParticipants: allParticipantsGroupIds }) => (
							<Accordion
								key={groupId}
								title={
									<h3 className='font-bold xl:text-2xl [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-[24px]'>
										<span className='capitalize'>{gender}</span> {ageCategory?.from}-{ageCategory?.to} age,{' '}
										{weightCategory?.from}-{weightCategory?.to} kg
										<span className='text-zinc-400'> {allParticipantsGroupIds?.length}</span>
									</h3>
								}
							>
								{groupId && allParticipantsData && allParticipantsGroupIds ? (
									<TableBody
										rows={tableSchemaGroupParticipants(
											getObjectsFromIds(allParticipantsGroupIds, allParticipantsData).map(user => ({
												...user,
												userGridPlace: user?._id && usersOlympicGridPlacesByGroupIds[groupId]?.[user?._id],
												setUserGridPlace: (place: string | undefined) => {
													if (user?._id)
														setUsersOlympicGridPlacesByGroupIds(state => ({
															...state,
															[groupId]: { ...state[groupId], [user?._id as string]: place }
														}))
												}
											}))
										)}
									/>
								) : (
									<Loader />
								)}
							</Accordion>
						)
					)}
				</RoundedBorderWrapper>
			)}
			<BottomFixedContainer classes='xl:pl-[7.5rem] xl:pr-[7.5rem]'>
				<div className='flex flex-wrap gap-2.5'>
					<Button type='outlined' onClick={() => navigate(`../${AppRoute.CreateGroup}`)}>
						Previous step
					</Button>
					<Button
						classes='min-w-[8rem] xl:min-w-[15.625rem]'
						loading={loading}
						onClick={() => {
							let someInputNotFilled = false
							competitionData?.groups?.forEach(group => {
								const groupParticipants = group.allParticipants
								groupParticipants?.forEach(groupParticipantId => {
									if (group._id && !usersOlympicGridPlacesByGroupIds[group._id]?.[groupParticipantId]) {
										someInputNotFilled = true
									}
								})
							})

							if (someInputNotFilled) {
								setAlertData({ show: true, type: 'error', subtitle: 'All fields must be filled.' })
								return
							}

							if (usersOlympicGridPlacesByGroupIds && competitionId) {
								const data = Object.entries(usersOlympicGridPlacesByGroupIds).reduce(
									(acc, [groupId, usersOlympicGridPlaces]) => {
										return {
											...acc,
											[groupId]:
												usersOlympicGridPlaces &&
												Object.entries(usersOlympicGridPlaces)
													.sort(([, placeA], [, placeB]) => Number(placeA) - Number(placeB))
													.map(userOlympicGridPlace => userOlympicGridPlace[0])
										}
									},
									{}
								)

								dispatch(setParticipantsOrdersByGroup({ data, id: competitionId }))
							}
						}}
					>
						Confirm the pairs
					</Button>
				</div>
			</BottomFixedContainer>
		</main>
	)
}
