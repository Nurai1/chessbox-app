import { ReactElement, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { Button, BottomFixedContainer } from 'src/ui'
import { CompetitionRequirements, GroupParameters, CompetitionCreateHeader } from 'src/components'
import { fetchCompetitionById, fetchCompetitionJudges } from 'src/store/slices/competitionSlice'

export const CreateGroupPage = (): ReactElement => {
	const { competitionId } = useParams()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const competitionData = useAppSelector(s => s.competition.data)
	const judges = useAppSelector(s => s.competition.judges[competitionId as string])

	if (judges?.length === 0) {
		navigate(`../${AppRoute.JudgeChoice}`)
	}

	useEffect(() => {
		if (!competitionData) {
			dispatch(fetchCompetitionById(competitionId as string))
		}

		if (!judges) {
			dispatch(fetchCompetitionJudges(competitionId as string))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleDoneClick = () => {}

	const handleBackClick = () => {}

	return (
		<main className='container mx-auto grow px-[17px] pt-8 pb-[5.5rem] md:py-9 md:pb-28 xl:pt-14 xl:pl-[7.5rem] xl:pr-[7.5rem]'>
			<CompetitionCreateHeader
				title='Create groups 2/4'
				backArrowPath={`../${AppRoute.JudgeChoice}`}
				competitionData={competitionData}
				judges={judges}
			/>
			<div className='max-h-[54.625rem] rounded-3xl border border-pale-grey pt-6 pl-6'>
				{competitionData?.requirements && (
					<>
						<GroupParameters requirements={competitionData.requirements} classes='mb-6' />
						<CompetitionRequirements competitionRequirements={competitionData.requirements} classes='mb-6' />
					</>
				)}
			</div>

			<BottomFixedContainer classes='xl:pl-[7.5rem] xl:pr-[7.5rem]'>
				<div className='flex flex-wrap gap-2.5'>
					<Button type='outlined' onClick={handleBackClick}>
						Previous step
					</Button>
					<Button
						classes='min-w-[8rem] xl:min-w-[15.625rem]'
						onClick={handleDoneClick}
						// loading={pairJudgesAssignPending}
					>
						Done
					</Button>
					{/* {pairJudgesAssignError && <Alert type='error' subtitle={pairJudgesAssignError} />} */}
				</div>
			</BottomFixedContainer>
		</main>
	)
}
