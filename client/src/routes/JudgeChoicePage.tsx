import { ReactElement, useEffect, useState } from 'react'
import { AppRoute } from 'src/constants/appRoute'
import { Link, useParams } from 'react-router-dom'
import { Loader, TableBody, Button, Alert } from 'src/ui'
import { ReactComponent as ArrowLeft } from 'src/assets/arrow-left.svg'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { fetchCompetitionById, fetchCompetitionJudges, setCompetitionJudges } from 'src/store/slices/competitionSlice'
import { getFormattedDate } from 'src/helpers/datetime'
import { tableSchemaJudges } from 'src/helpers/tableSchemas/tableSchemaJudges'

const MAX_JUDGES = 2

export const JudgeChoicePage = (): ReactElement => {
    const { competitionId } = useParams()
    const dispatch = useAppDispatch()
    const [selectedJudges, setSelectedJudges] = useState<string[]>([])
    const [maxJudgesReached, setMaxJudgesReached] = useState(false)
    const competitionDataFromCompetitionsList = useAppSelector(s => s.competitions.data).find(({ _id }) => _id === competitionId)
    const competitionDataFromCompetition = useAppSelector(s => s.competition.data)
    const judges = useAppSelector(s => s.competition.judges[competitionId as string])
    const isSubmiting = useAppSelector(s => s.competition.loading)
    const submitSuccess = useAppSelector(s => s.competition.setCompetitionJudgesSuccess)
    const submitError = useAppSelector(s => s.competition.setCompetitionJudgesError)

    const competitionData = competitionDataFromCompetitionsList || competitionDataFromCompetition
    const dateStart = competitionData && getFormattedDate(competitionData.startDate, 'MMM D, HH:mm')

    useEffect(() => {
        if (!competitionData) {
            dispatch(fetchCompetitionById(competitionId as string))
        }
        dispatch(fetchCompetitionJudges(competitionId as string))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (selectedJudges.length >= MAX_JUDGES) {
            setMaxJudgesReached(true)
        } else {
            setMaxJudgesReached(false)
        }
    }, [selectedJudges])

    const handleSelectJudge = (value?: boolean, name?: string) => {
        if (selectedJudges.includes(name as string)) {
            setSelectedJudges(selectedJudges.filter(judgeId => judgeId !== name))
        } else {
            setSelectedJudges([...selectedJudges, name as string])
        }
    }

    const handleSubmit = () => {
        dispatch(setCompetitionJudges({
            judgesIds: selectedJudges,
            competitionId: competitionId as string
        }))
    }

    const judgesTable = judges && tableSchemaJudges({
        judges,
        onSelect: handleSelectJudge,
        selectedJudges,
        disableCheckboxes: maxJudgesReached
    })

    return (
        <main
            className="container relative mx-auto grow px-[17px] pt-[30px] md:pt-[38px] xl:pl-[103px] xl:pr-[50px] xl:pt-[55px]">
            <Link
                to={`/${AppRoute.Competitions}/${competitionId}`}
                className="hidden transition hover:opacity-70 xl:absolute xl:left-[38px] xl:top-[77px] xl:block"
            >
                <ArrowLeft/>
            </Link>
            {competitionData
                ? <>
                    <h1 className="mb-4 text-2xl font-semibold xl:text-[2rem] leading-normal">
                        {competitionData.name}
                    </h1>
                    <p className="mb-[2.5rem] text-sm text-[#6C6A6C] xl:mb-[4.375rem] xl:text-xl xl:font-medium">
                        {dateStart}
                    </p>
                </>
                : <Loader/>
            }
            <h2 className='mb-2 text-2xl font-semibold xl:text-[3.125rem] xl:font-bold leading-normal'>
                Judges
            </h2>
            {judgesTable && (
                <div className='pb-6 xl:pb-12 border-b  border-zinc-300'>
                    <TableBody rows={judgesTable}/>
                    <Button onClick={handleSubmit} classes='w-full mt-4 md:w-[223px] xl:mt-11' disabled={!maxJudgesReached} loading={isSubmiting}>Done</Button>
                    {submitSuccess && <Alert type='success' subtitle='Succesfull' classes='mt-6 w-fit xl:mt-9'/>}
                    {submitError && <Alert type='error' subtitle={submitError} classes='mt-6 w-fit xl:mt-9'/>}
                </div>
            )}
        </main>
    )
}
