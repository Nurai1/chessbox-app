import { ReactElement, useEffect, useState } from 'react'
import { AppRoute } from 'src/constants/appRoute'
import { useParams, useNavigate } from 'react-router-dom'
import { TableBody, Button, Alert } from 'src/ui'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { fetchCompetitionById, setCompetitionJudges, setJudgesToCompetition } from 'src/store/slices/competitionSlice'
import { updateCompetitionsList } from 'src/store/slices/competitionsSlice'
import { fetchAllJudges } from 'src/store/slices/usersSlice'
import { tableSchemaJudges } from 'src/helpers/tableSchemas/tableSchemaJudges'
import { UserSchema } from 'src/types'
import { CompetitionCreateHeader } from 'src/components'

const MAX_JUDGES = 2

export const JudgeChoicePage = (): ReactElement => {
	const { competitionId } = useParams()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [selectedJudgesId, setSelectedJudgesId] = useState<string[]>([])
	const competitionData = useAppSelector(s => s.competition.data)
	const judges = useAppSelector(s => s.users.allJudges)
	const pending = useAppSelector(s => s.competition.setCompetitionJudgesPending)
	const assignSuccess = useAppSelector(s => s.competition.setCompetitionJudgesSuccess)
	const submitError = useAppSelector(s => s.competition.setCompetitionJudgesError)
	const maxJudgesReached = selectedJudgesId.length >= MAX_JUDGES

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
		if (assignSuccess) {
			const selectedJudges = selectedJudgesId.map(judgeId => judges?.find(judge => judge._id === judgeId))
			navigate(`../${AppRoute.CreateGroup}`)
			dispatch(
				setJudgesToCompetition({
					competitionId: competitionId as string,
					judges: selectedJudges as UserSchema[]
				})
			)
			dispatch(
				updateCompetitionsList({
					selectedJudges: selectedJudgesId,
					competitionId: competitionId as string
				})
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [assignSuccess])

	const handleSelectJudge = (value?: boolean | string, name?: string) => {
		if (selectedJudgesId.includes(name as string)) {
			setSelectedJudgesId(selectedJudgesId.filter(judgeId => judgeId !== name))
		} else {
			setSelectedJudgesId([...selectedJudgesId, name as string])
		}
	}

	const handleSubmit = () => {
		dispatch(
			setCompetitionJudges({
				judgesIds: selectedJudgesId,
				competitionId: competitionId as string
			})
		)
	}

	const judgesTable =
		judges &&
		tableSchemaJudges({
			judges,
			onSelect: handleSelectJudge,
			selectedJudgesId,
			disableCheckboxes: maxJudgesReached
		})

	return (
		<main className='container relative mx-auto grow px-4 py-8 md:py-9 xl:py-14 xl:pl-[6.5rem] xl:pr-[3.125rem]'>
			<CompetitionCreateHeader
				title='Assign judges 1/4'
				competitionData={competitionData}
				backArrowPath={`/${AppRoute.Competitions}/${competitionId}`}
			/>
			<h2 className='mb-2 text-2xl font-semibold leading-normal xl:text-[3.125rem] xl:font-bold'>Judges</h2>
			{judgesTable && (
				<div className='border-b border-zinc-300 pb-6  xl:pb-12'>
					<TableBody rows={judgesTable} />
					<Button
						onClick={handleSubmit}
						classes='w-full mt-4 md:w-[223px] xl:mt-11'
						disabled={!maxJudgesReached}
						loading={pending}
					>
						Continue
					</Button>
					{submitError && <Alert type='error' subtitle={submitError} classes='mt-6 w-fit xl:mt-9' />}
				</div>
			)}
		</main>
	)
}