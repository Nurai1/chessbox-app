import { FC, ReactNode, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { useNavigate } from 'react-router-dom'
import { addNewParticipant, addCompetitionParticipant } from 'src/store/slices/competitionSlice'
import { Button, Timer } from 'src/ui'
import { CompetitionSchema, UserSchema } from 'src/types'
import { AppRoute } from 'src/constants/appRoute'
import { checkParticipantFitRequirements } from 'src/helpers/checkParticipantFitRequirements'
import { updateCompetitionsListParticipants } from 'src/store/slices/competitionsSlice'
import { Role } from 'src/constants/role'

type RegistrationEndsTimerPropsType = {
	competitionData: CompetitionSchema
	onTimeOver?: () => void
	classes?: string
	children?: ReactNode
	isCompetitonPage?: boolean
}

export const RegistrationEndsTimer: FC<RegistrationEndsTimerPropsType> = ({
	competitionData,
	onTimeOver,
	classes,
	children,
	isCompetitonPage
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
					competitionId: competitionData._id as string
				})
			)
			dispatch(
				addCompetitionParticipant({
					newParticipant: authorizedUser as UserSchema,
					competitionId: competitionData._id as string
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
			dispatch(addNewParticipant({ userId: authorizedUser._id as string, id: competitionData._id as string }))
		}
	}

	return (
		<div
			className={`${
				isCompetitonPage
					? 'mb-6 lg:mb-0'
					: 'w-full lg:col-start-2 lg:col-end-3 lg:mb-0 lg:mt-6 lg:flex-col lg:items-start xl:col-start-3 xl:col-end-4 xl:mt-0'
			}  ${classes}`}
		>
			<div
				className={`${
					isCompetitonPage
						? 'mb-6 flex items-center gap-4 lg:flex-col lg:items-baseline '
						: 'flex items-center gap-4 lg:flex-col lg:items-start'
				}`}
			>
				<h3
					className={`${
						isCompetitonPage
							? 'text-sm text-grey lg:text-base xl:text-[32px] xl:font-semibold xl:leading-[48px]'
							: 'font-bold text-black lg:text-2xl lg:text-grey xl:font-semibold'
					}`}
				>
					Registration ends&nbsp;in:
				</h3>
				<Timer
					time={competitionData.registrationEndsAt}
					containerClasses={`${isCompetitonPage ? 'xl:h-[6.5rem] xl:min-w-[6.5rem] xl:p-4' : 'lg:w-full lg:h-[4.7rem]'}`}
					countNumbersClasses={`${isCompetitonPage ? 'xl:text-[2rem]' : 'lg:text-2xl'}`}
					countLabelsClasses='text-grey'
					handleTimeOver={onTimeOver}
					classes={`${isCompetitonPage ? '' : 'lg:grid lg:grid-cols-3 lg:w-full xl:w-auto'}`}
				/>
			</div>
			<div className={`${isCompetitonPage ? 'fixed inset-x-0 bottom-0 bg-white py-6 px-4 shadow-[0px_1px_18px_5px_rgba(34,60,80,0.2)] lg:static lg:p-0 lg:shadow-none' : ''}`}>
				{authorizedUser?.role !== Role.ChiefJudge && (
					<div className='flex gap-2 lg:flex-col lg:gap-3'>
						<Button
							onClick={handleParticipateClick}
							classes={`${
								isCompetitonPage ? 'md:w-full xl:w-[84%]' : 'w-full xl:w-[80%] mt-5 2xl:w-[97%] 2xl:mt-[1.625rem]'
							}`}
							disabled={fitCompetitionParametersCheck}
							loading={addNewParticipantPending}
						>
							Participate
						</Button>
						{children}
					</div>
				)}
			</div>
			{fitCompetitionParametersCheck && authorizedUser?.role !== Role.ChiefJudge && (
				<p className='mt-4 text-error-red md:mt-5 lg:mt-2'>
					* You don&#39;t fit the parameters
				</p>
			)}
		</div>
	)
}
