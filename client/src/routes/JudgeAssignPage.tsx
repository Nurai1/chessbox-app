import { ReactElement, useEffect, useState, Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'
import { ReactComponent as ArrowLeftIcon } from 'src/assets/arrow-left.svg'
import { ReactComponent as WhatsAppIcon } from 'src/assets/whatsapp.svg'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { Loader, Select, TableBody, TableWrapper } from 'src/ui'
import { getFormattedDate } from 'src/helpers/datetime'
import { fetchCompetitionById, fetchCompetitionJudges, fetchCompetitionParticipants } from 'src/store/slices/competitionSlice'
import { tableSchemaJudgeToPairs } from 'src/helpers/tableSchemas/tableSchemaJudgeToPairs'

export const JudgeAssignPage = (): ReactElement => {
    const { competitionId } = useParams()
    const [selectedGender, setSelectedGender] = useState<string| undefined>()
    const dispatch = useAppDispatch()
    const competitionDataFromCompetitionsList = useAppSelector(s => s.competitions.data).find(({ _id }) => _id === competitionId)
    const competitionDataFromCompetition = useAppSelector(s => s.competition.data)
    const judges = useAppSelector(s => s.competition.judges[competitionId as string])
    const competitionData = competitionDataFromCompetitionsList || competitionDataFromCompetition
    const participants = useAppSelector(s => competitionId && s.competition.participants[competitionId])
    const dateStart = competitionData && getFormattedDate(competitionData.startDate, 'MMM D, HH:mm')


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
        if (!participants) {
            dispatch(fetchCompetitionParticipants(competitionId as string))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <main
            className="container relative mx-auto grow px-[17px] pt-[30px] md:pt-[38px] xl:pl-[103px] xl:pr-[50px] xl:pt-[55px]">
            <Link
                to={`/${AppRoute.Competitions}/${competitionId}`}
                className="hidden transition hover:opacity-70 xl:absolute xl:left-[38px] xl:top-[77px] xl:block"
            >
                <ArrowLeftIcon/>
            </Link>
            <div className='lg:grid lg:grid-cols-2 lg:gap-7 xl:grid-cols-[auto_27rem]'>
                {competitionData
                    ? <div className='mb-4 xl:mb-[4.375rem]'>
                        <h1 className="mb-4 text-2xl font-semibold xl:text-[2rem] leading-normal">
                            {competitionData.name}
                        </h1>
                        <p className="text-sm text-[#6C6A6C]  xl:text-xl xl:font-medium">
                            {dateStart}
                        </p>
                    </div>
                    : <Loader/>
                }
                <div className='xl:mt-[-2.25rem]'>
                    <div className='mb-6 xl:mb-12 xl:max-w-[23.375rem]'>
                        <Select
                            onChange={(value) => setSelectedGender(value)}
                            menuOptions={[
                                { value: 'Man', id: 'man' },
                                { value: 'Woman', id: 'woman' }
                            ]}
                            dropdownPlaceholder='Select gender'
                            placeholder='Select gender'
                            chosenId={selectedGender}
                        />
                    </div>
                    <div className='mb-5 md:mb-8 xl:mb-12 xl:ml-8'>
                        <h3 className='mb-1 font-semibold lg:text-right lg:mb-3 xl:text-2xl'>Judges</h3>
                        <div className='flex flex-wrap gap-3 lg:justify-between'>
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
            </div>
            {competitionData && (
                <TableWrapper>
                    {competitionData.groups?.map(({ _id, gender, ageCategory, weightCategory, passedPairs }) => (
                        <Fragment key={_id}>
                            <h3 className='mb-[17px] font-bold md:mb-[32px] xl:text-2xl [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-[24px]'>
                                <span className='capitalize'>{gender}</span> {ageCategory?.from}-{ageCategory?.to} age,{' '}
                                {weightCategory?.from}-{weightCategory?.to}kg
                                <span className='text-zinc-400'> {passedPairs?.length} pairs</span>
                            </h3>
                            {passedPairs && participants && judges ? (
                                <TableBody rows={tableSchemaJudgeToPairs(passedPairs, participants, judges)} />
                            ) : (
                                <Loader />
                            )}
                        </Fragment>
                    ))}
                </TableWrapper>

            )}

        </main>
    )
}
