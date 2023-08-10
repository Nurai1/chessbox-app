import { ReactElement, useEffect, useState } from 'react'
import { AppRoute } from 'src/constants/appRoute'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Loader, TableBody, Button, Alert } from 'src/ui'
import { ReactComponent as ArrowLeftIcon } from 'src/assets/arrow-left.svg'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import {
	fetchCompetitionById,
	setCompetitionJudges,
	resetCompetitionJudgesSuccess
} from 'src/store/slices/competitionSlice'
import { fetchAllJudges } from 'src/store/slices/usersSlice'
import { getFormattedDate } from 'src/helpers/datetime'
import { tableSchemaJudges } from 'src/helpers/tableSchemas/tableSchemaJudges'

const MAX_JUDGES = 2

export const JudgeChoicePage = (): ReactElement => {
	const { competitionId } = useParams()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [selectedJudges, setSelectedJudges] = useState<string[]>([])
	const competitionDataFromCompetitionsList = useAppSelector(s => s.competitions.data).find(
		({ _id }) => _id === competitionId
	)
	const competitionDataFromCompetition = useAppSelector(s => s.competition.data)
	const judges = useAppSelector(s => s.users.allJudges)
	const isSubmiting = useAppSelector(s => s.competition.loading)
	const submitSuccess = useAppSelector(s => s.competition.setCompetitionJudgesSuccess)
	const submitError = useAppSelector(s => s.competition.setCompetitionJudgesError)
	const competitionData = competitionDataFromCompetitionsList || competitionDataFromCompetition
	const dateStart = competitionData && getFormattedDate(competitionData.startDate, 'MMM D, HH:mm')
	const maxJudgesReached = selectedJudges.length >= MAX_JUDGES

	useEffect(() => {
		if (!competitionData) {
			dispatch(fetchCompetitionById(competitionId as string))
		}
		if (!judges) {
			dispatch(fetchAllJudges())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (submitSuccess) {
			navigate(`../${AppRoute.CreateGroup}`)
			dispatch(resetCompetitionJudgesSuccess())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submitSuccess])

	const handleSelectJudge = (value?: boolean, name?: string) => {
		if (selectedJudges.includes(name as string)) {
			setSelectedJudges(selectedJudges.filter(judgeId => judgeId !== name))
		} else {
			setSelectedJudges([...selectedJudges, name as string])
		}
	}

	const handleSubmit = () => {
		dispatch(
			setCompetitionJudges({
				judgesIds: selectedJudges,
				competitionId: competitionId as string
			})
		)
	}

	const judgesTable =
		judges &&
		tableSchemaJudges({
			judges,
			onSelect: handleSelectJudge,
			selectedJudges,
			disableCheckboxes: maxJudgesReached
		})

	return (
		<main className='container relative mx-auto grow px-4 py-8 md:py-9 xl:py-14 xl:pl-[6.5rem] xl:pr-[3.125rem]'>
			{competitionData ? (
				<div className='mb-6 xl:mb-[4.375rem] xl:max-w-[34.375rem]'>
					<h1 className='mb-1.5 text-lg font-medium xl:text-xl'>{competitionData.name}</h1>
					<p className='mb-6 text-[#6C6A6C] xl:mb-11'>{dateStart}</p>
					<div className='relative mb-1.5'>
						<h2 className='text-2xl font-semibold xl:text-4xl xl:font-bold'>Assign judges 1/3</h2>
						<Link
							to={`/${AppRoute.Competitions}/${competitionId}`}
							className='hidden transition hover:opacity-70 xl:absolute xl:left-[-3.5rem] xl:top-0 xl:block'
						>
							<ArrowLeftIcon />
						</Link>
					</div>
				</div>
			) : (
				<Loader />
			)}

			<h2 className='mb-2 text-2xl font-semibold leading-normal xl:text-[3.125rem] xl:font-bold'>Judges</h2>
			{judgesTable && (
				<div className='border-b border-zinc-300 pb-6  xl:pb-12'>
					<TableBody rows={judgesTable} />
					<Button
						onClick={handleSubmit}
						classes='w-full mt-4 md:w-[223px] xl:mt-11'
						disabled={!maxJudgesReached}
						loading={isSubmiting}
					>
						Continue
					</Button>
					{submitError && <Alert type='error' subtitle={submitError} classes='mt-6 w-fit xl:mt-9' />}
				</div>
			)}
		</main>
	)
}
