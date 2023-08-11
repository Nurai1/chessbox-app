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
    setPairJudgeSuccessDefault
} from 'src/store/slices/competitionSlice'
import { tableSchemaJudgeToPairs } from 'src/helpers/tableSchemas/tableSchemaJudgeToPairs'
import { SetJudgesToPairsSchema } from 'src/types'

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
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const competitionDataFromCompetitionsList = useAppSelector(s => s.competitions.data).find(({ _id }) => _id === competitionId)
    const competitionDataFromCompetition = useAppSelector(s => s.competition.data)
    const judges = useAppSelector(s => s.competition.judges[competitionId as string])
    const competitionData = competitionDataFromCompetitionsList || competitionDataFromCompetition
    const participants = useAppSelector(s => competitionId && s.competition.participants[competitionId])
    const dateStart = competitionData && getFormattedDate(competitionData.startDate, 'MMM D, HH:mm')
    const pending = useAppSelector(s => s.competition.judgeAssignPending)
    const judgeAssignSuccess = useAppSelector(s => s.competition.setPairJudgeSuccess)
    const submitError = useAppSelector(s => s.competition.setPairJudgeError)

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

    useEffect(() => {
        const selectedJudgesData = {
            judgesByGroups: competitionData?.groups?.map(({_id, currentRoundPairs}) => ({
                id: _id,
                pairs: currentRoundPairs?.map((pair, i) => ({
                    id: pair._id,
                    judgeId: pair.judge ? pair.judge : competitionData.judges && competitionData.judges[i % 2 === 0 ? 0 : 1]
                }))
            })),
            competitionId: competitionId as string
        }

        setSelectedJudges(selectedJudgesData as SetJudgesToPairsSchema)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[competitionData])

    useEffect(() => {
        if (judgeAssignSuccess) {
            // Todo: add redirect to groups and pairs list page
            // navigate()
            // dispatch(setPairJudgeSuccessDefault())
        }
    },[judgeAssignSuccess])

    const handleJudgeSelect = (updatedJudgeData: SelectedJudge) => {
        const newSelectJudge = selectedJudges?.judgesByGroups?.map(group => {
            if (group.id === updatedJudgeData.id) {
                group.pairs = updatedJudgeData.pairs
            }
            return group
        })

        setSelectedJudges({
            competitionId: competitionId as string,
            judgesByGroups: newSelectJudge
        })
    }

    const handleDoneClick = () => {
        dispatch(setPairJudges(selectedJudges as SetJudgesToPairsSchema))
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
                            <div className='flex flex-col' key={judge._id}>
                                <a className="flex items-center gap-4 font-medium text-black text-sm hover:opacity-70 transition md:text-base xl:text-xl"
                                   href={`https://wa.me/${judge.socialNetworks?.whatsup}`}>
                                    <WhatsAppIcon className="min-w-[0.875rem] w-3.5 lg:min-w-[1.5rem] lg:w-6"/>
                                    {judge.fullName}
                                </a>
                                <span className='text-sm text-neutral-500 md:text-base'>{judge.fightClub?.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {competitionData && (
                <TableWrapper classes='py-4 xl:py-7'>
                    {competitionData.groups?.map(({ _id: groupId, gender, ageCategory, weightCategory, currentRoundPairs }, i) => (
                        <Accordion key={groupId} classes='last:pb-0' isDragable title={
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
                </TableWrapper>
            )}
            <BottomFixedContainer classes='xl:pl-[7.5rem] xl:pr-[7.5rem]'>
                <div className='flex flex-wrap gap-2.5'>
                    <Button type='outlined' onClick={() => navigate(`../${AppRoute.CreateGroup}`)}>Previous step</Button>
                    <Button classes='min-w-[8rem] xl:min-w-[15.625rem]' onClick={handleDoneClick} loading={pending}>Done</Button>
                    {submitError && <Alert type='error' subtitle={submitError}/>}
                </div>
            </BottomFixedContainer>
        </main>
    )
}
