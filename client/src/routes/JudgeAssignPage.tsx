import { ReactElement, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'
import { ReactComponent as ArrowLeftIcon } from 'src/assets/arrow-left.svg'
import { ReactComponent as WhatsAppIcon } from 'src/assets/whatsapp.svg'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { Loader, TableBody, TableWrapper, Button, BottomFixedContainer, Alert, Accordion } from 'src/ui'
import { getFormattedDate } from 'src/helpers/datetime'
import {
	fetchCompetitionById,
	fetchCompetitionJudges,
	fetchCompetitionParticipants,
	setPairJudges,
	resetPairJudgeAndGroupSuccessStatus,
	setCompetitionGroupsOrders,
	setCompetitionData
} from 'src/store/slices/competitionSlice'
import { tableSchemaJudgeToPairs } from 'src/helpers/tableSchemas/tableSchemaJudgeToPairs'
import { SetJudgesToPairsSchema, CompetitionGroupSchema, CompetitionGroupsOrders, CompetitionSchema } from 'src/types'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { swapArray } from 'src/helpers/swapArray'

export type SelectedJudge = {
	id: string
	pairs: {
		id: string
		judgeId: string
	}[]
}

export const JudgeAssignPage = (): ReactElement => {
    const { competitionId } = useParams()
    const [selectedJudges, setSelectedJudges] = useState<SetJudgesToPairsSchema>()
	const [isAccordionOpen, setIsAccordionOpen] = useState<boolean | undefined>()
	const [groups, setGroups] = useState<CompetitionGroupSchema[] | undefined>()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const competitionData = useAppSelector(s => s.competition.data)
    const judges = useAppSelector(s => s.competition.judges[competitionId as string])
    const participants = useAppSelector(s => competitionId && s.competition.participants[competitionId])
    const dateStart = competitionData && getFormattedDate(competitionData.startDate, 'MMM D, HH:mm')
    const pairJudgesAssignPending = useAppSelector(s => s.competition.setPairJudgesPending)
    const pairJudgesAssignSuccess = useAppSelector(s => s.competition.setPairJudgesSuccess)
    const pairJudgesAssignError = useAppSelector(s => s.competition.setPairJudgesError)
	const groupOrderAssignPending = useAppSelector(s => s.competition.groupOrderAssignPending)
    const groupOrderAssignSuccess = useAppSelector(s => s.competition.groupOrderAssignSuccess)
    const groupOrderAssignError = useAppSelector(s => s.competition.groupOrderAssignError)

	console.log(groups)

	useEffect(() => {
		if (!competitionData) {
			dispatch(fetchCompetitionById(competitionId as string))
		}

		if (!judges) {
			dispatch(fetchCompetitionJudges(competitionId as string))
		}

		if (!participants) {
			dispatch(fetchCompetitionParticipants(competitionId as string))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const getChosenJudgeId = (pairJudge: string, i: number) => {
		const existingJudgeMatchChosen = judges?.find(({ _id }) => _id === pairJudge)
		if (existingJudgeMatchChosen) {
			return existingJudgeMatchChosen._id
		}
		return judges && judges[i % 2 === 0 ? 0 : 1]._id
	}

	useEffect(() => {
		setGroups(competitionData?.groups)
	}, [competitionData])

	useEffect(() => {
		const selectedJudgesData = {
			judgesByGroups: groups?.map(({ _id, currentRoundPairs }) => ({
				id: _id,
				pairs: currentRoundPairs?.map((pair, i) => ({
					id: pair._id,
					judgeId: getChosenJudgeId(pair.judge as string, i)
				}))
			})),
			competitionId: competitionId as string
		}

		setSelectedJudges(selectedJudgesData as SetJudgesToPairsSchema)
	}, [groups])

	useEffect(() => {
		if (pairJudgesAssignSuccess && groupOrderAssignSuccess) {
			navigate(`/${AppRoute.Competitions}/${competitionId}`)
			dispatch(resetPairJudgeAndGroupSuccessStatus())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pairJudgesAssignSuccess, groupOrderAssignSuccess])

	const handleJudgeSelect = (updatedJudgeData: SelectedJudge) => {
		const newSelectJudge = selectedJudges?.judgesByGroups?.map(group => {
			if (group.id === updatedJudgeData.id) {
				group.pairs = updatedJudgeData.pairs
			}
			return group
		})

		const groupIndex = groups?.findIndex(group => group._id === updatedJudgeData.id) as number

		if (groups) {
			const groupsCopy = groups[groupIndex].currentRoundPairs?.slice()
			const updatedGroupData = groupsCopy?.map((pair, i) => {
				return {
					...pair,
					judge: updatedJudgeData.pairs[i].judgeId
				}
			})

			setGroups([
				...groups.slice(0, groupIndex),
				{
					...groups[groupIndex],
					currentRoundPairs: updatedGroupData
				},
				...groups.slice(groupIndex + 1)
			])
		}

		setSelectedJudges({
			competitionId: competitionId as string,
			judgesByGroups: newSelectJudge
		})
	}

    const handleDoneClick = () => {
		const groupOrder = groups?.reduce((acc, group, i) => {
			acc.push({
				groupId: group._id as string,
				order: i
			})
			return acc
		}, [] as CompetitionGroupsOrders)

		dispatch(setCompetitionData({
			...competitionData,
			groups: groups as CompetitionGroupSchema[]
		} as CompetitionSchema))

		dispatch(setCompetitionGroupsOrders({
			orders: groupOrder as CompetitionGroupsOrders,
			id: competitionId as string
		}))

        dispatch(setPairJudges(selectedJudges as SetJudgesToPairsSchema))
    }

	const handleBackClick = () => {
		dispatch(setCompetitionData({
			...competitionData,
			groups: groups as CompetitionGroupSchema[]
		} as CompetitionSchema))

		navigate(`../${AppRoute.CreateGroup}`)
	}

    const sortItems = (dragIndex: number, hoverIndex: number) => {
		setGroups(swapArray(groups as CompetitionGroupSchema[], dragIndex, hoverIndex))
	}

    return (
        <main className="container mx-auto grow px-[17px] pt-8 pb-[5.5rem] md:pb-28 md:py-9 xl:pt-14 xl:pl-[7.5rem] xl:pr-[7.5rem]">
            <div className='mb-8 xl:flex xl:justify-between xl:gap-6 xl:mb-12'>
                {competitionData
                    ? <div className='mb-6 xl:mb-0 xl:max-w-[34.375rem]'>
                        <h1 className="mb-1.5 text-lg font-medium xl:text-xl">{competitionData.name}</h1>
                        <p className="text-[#6C6A6C] mb-6 xl:mb-11">
                            {dateStart}
                        </p>
                        <div className='mb-1.5 relative'>
                            <h2 className='text-2xl font-semibold xl:text-4xl xl:font-bold'>
                                Connect judges to pairs and assign orders to groups 3/3
                            </h2>
                            <button
                                className="hidden transition hover:opacity-70 xl:absolute xl:left-[-3.5rem] xl:top-0 xl:block"
                                onClick={() => navigate(-1)}
                                type='button'
                            >
                                <ArrowLeftIcon/>
                            </button>
                        </div>
                    </div>
                    : <Loader/>
                }
                <div className='mb-5 md:mb-8 xl:mb-12 xl:ml-8'>
                    <h3 className='mb-1 font-semibold xl:text-right lg:mb-3 xl:text-2xl'>Judges</h3>
                    <div className='flex flex-wrap gap-3 lg:gap-6 xl:justify-between'>
                        {judges && judges.map(judge => (
                            <div className='flex flex-col' key={judge._id} >
                                <a className="flex items-center gap-4 font-medium text-black text-sm hover:opacity-70 transition md:text-base xl:text-xl"
                                    href={`https://wa.me/${judge.socialNetworks?.whatsup}`}
									target='_blank'
								    rel="noreferrer"
								>
                                    <WhatsAppIcon className="min-w-[0.875rem] w-3.5 lg:min-w-[1.5rem] lg:w-6"/>
                                    {judge.fullName}
                                </a>
                                <span className='text-sm text-neutral-500 md:text-base'>{judge.fightClub?.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {groups && (
                <TableWrapper classes='py-4 xl:py-7'>
                    <DndProvider backend={HTML5Backend}>
                        {groups.map(({ _id: groupId, gender, ageCategory, weightCategory, currentRoundPairs }, i) => (
                            <Accordion
								id={groupId as string}
								index={i}
								key={groupId} classes='last:pb-0'
								isDraggable
								sortItems={sortItems}
								isOpenDefault={isAccordionOpen}
								// должен происходить ререндер, возможная поричина в том что его нет, DndProvider обвернут в useMemo
								closeAccordion={() => setIsAccordionOpen(false)}
								title={
                                <h3 className='font-bold xl:text-2xl [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-[24px]'>
                                    <span className='capitalize'>{gender}</span> {ageCategory?.from}-{ageCategory?.to} age,{' '}
                                    {weightCategory?.from}-{weightCategory?.to}kg
                                    {currentRoundPairs?.length && <span className='text-zinc-400'> {currentRoundPairs?.length} {`pair${currentRoundPairs?.length === 1 ? '' : 's'}`}</span>}
                                </h3>
                            }>
                                {currentRoundPairs && participants && judges ? (
                                    <TableBody rows={tableSchemaJudgeToPairs({
                                        tableData: currentRoundPairs,
                                        participants,
                                        judges,
                                        groupId,
                                        selectedJudges: selectedJudges?.judgesByGroups && selectedJudges?.judgesByGroups[i],
                                        onSelect: handleJudgeSelect
                                    })} />
                                ) : (
                                    <Loader />
                                )}
                            </Accordion>
                        ))}
                    </DndProvider>
                </TableWrapper>
            )}
            <BottomFixedContainer classes='xl:pl-[7.5rem] xl:pr-[7.5rem]'>
                <div className='flex flex-wrap gap-2.5'>
                    <Button type='outlined' onClick={handleBackClick}>Previous step</Button>
                    <Button classes='min-w-[8rem] xl:min-w-[15.625rem]' onClick={handleDoneClick} loading={pairJudgesAssignPending && groupOrderAssignPending}>Done</Button>
                    {pairJudgesAssignError && <Alert type='error' subtitle={pairJudgesAssignError}/>}
                    {groupOrderAssignError && <Alert type='error' subtitle={groupOrderAssignError}/>}
                </div>
            </BottomFixedContainer>
        </main>
    )
}
