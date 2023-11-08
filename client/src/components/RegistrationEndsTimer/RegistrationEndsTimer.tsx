import { FC, ReactNode, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { useNavigate } from 'react-router-dom'
import { addNewParticipant, addCompetitionParticipant } from 'src/store/slices/competitionSlice'
import { Button, Timer } from 'src/ui'
import { CompetitionSchema, UserSchema } from 'src/types'
import { AppRoute } from 'src/constants/appRoute'
import { checkParticipantFitRequirements } from 'src/helpers/checkParticipantFitRequirements'
import { updateCompetitionsListParticipants } from 'src/store/slices/competitionsSlice'

type RegistrationEndsTimerPropsType = {
	competitionData: CompetitionSchema
	competitionId: string
	onTimeOver?: () => void
	classes?: string
	children?: ReactNode
}

export const RegistrationEndsTimer: FC<RegistrationEndsTimerPropsType> = ({
	competitionData,
	onTimeOver,
	classes,
	children,
	competitionId
}) => {
	const { addNewParticipantPending, addNewParticipantSuccess } = useAppSelector(s => s.competition)
	const { authorizedUser } = useAppSelector(state => state.user)
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const isParticipant =
		competitionData?.participants && competitionData.participants.includes(authorizedUser?._id ?? '')

	useEffect(() => {
		if (addNewParticipantSuccess && !isParticipant) {
			dispatch(
				updateCompetitionsListParticipants({
					newParticipant: authorizedUser?._id as string,
					competitionId: competitionId as string
				})
			)
			dispatch(
				addCompetitionParticipant({
					newParticipant: authorizedUser as UserSchema,
					competitionId: competitionId as string
				})
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [addNewParticipantSuccess])

	const fitCompetitionParametersCheck = checkParticipantFitRequirements(competitionData, authorizedUser as UserSchema)

	const handleParticipateClick = () => {
		if (!authorizedUser) {
			navigate(`/${AppRoute.SignIn}`)
		} else {
			dispatch(addNewParticipant({ userId: authorizedUser._id as string, id: competitionId as string }))
		}
	}

	return (
		<div className={`mb-6 lg:mb-0 ${classes}`}>
			<div className='mb-6 flex items-center lg:flex-col lg:items-baseline lg:gap-4'>
				<h3 className='mr-auto text-sm text-grey lg:text-base xl:text-[32px] xl:font-semibold xl:leading-[48px]'>
					Registration ends in:
				</h3>
				<Timer
					time={competitionData.registrationEndsAt}
					containerClasses='lg:w-14 lg:h-14 xl:h-[6.5rem] xl:min-w-[6.5rem] xl:p-4'
					countNumbersClasses='xl:text-[2rem]'
					countLabelsClasses='text-grey'
					handleTimeOver={onTimeOver}
				/>
			</div>
			<div className='flex flex-col gap-4 md:flex-row md:gap-5 lg:flex-col lg:gap-2'>
				{authorizedUser?.role !== 'chief_judge' && (
					<Button
						onClick={handleParticipateClick}
						classes='md:w-full xl:max-w-[21rem]'
						disabled={fitCompetitionParametersCheck}
						loading={addNewParticipantPending}
					>
						Participate
					</Button>
				)}
				{children}
			</div>
			{fitCompetitionParametersCheck && (
				<p className='mt-4 text-error-red md:mt-5 lg:mt-2'>* You don&#39;t fit the parameters</p>
			)}
		</div>
	)
}
