import { FC, ReactNode, useState } from 'react'
import { useAppSelector } from 'src/hooks/redux'
import { useNavigate } from 'react-router-dom'
import { Button, Timer, Modal } from 'src/ui'
import { CompetitionSchema, UserSchema } from 'src/types'
import { AppRoute } from 'src/constants/appRoute'
import { checkParticipantFitRequirements } from 'src/helpers/checkParticipantFitRequirements'
import { Role } from 'src/constants/role'
import { useWindowSize } from 'usehooks-ts'
import { BreakPoint } from 'src/constants/breakPoints'
import { CompetitionPayment } from '../CompetitionPayment'

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
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { authorizedUser } = useAppSelector(state => state.user)
	const navigate = useNavigate()
	const { width: screenWidth } = useWindowSize()

	const fitCompetitionParametersCheck = checkParticipantFitRequirements(competitionData, authorizedUser as UserSchema)

	const handleParticipateClick = () => {
		if (!authorizedUser) {
			navigate(`/${AppRoute.SignIn}`)
		} else {
			setIsModalOpen(true)
		}
	}

	return (
		<div className={`${isCompetitonPage ? 'w-fit' : 'w-full lg:w-fit'}`}>
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
						containerClasses={`${
							isCompetitonPage ? 'xl:h-[6.5rem] xl:min-w-[6.5rem] xl:p-4' : 'lg:w-full lg:h-[4.7rem]'
						}`}
						countNumbersClasses={`${isCompetitonPage ? 'xl:text-[2rem]' : 'lg:text-2xl'}`}
						countLabelsClasses='text-grey'
						handleTimeOver={onTimeOver}
						classes={`${isCompetitonPage ? '' : 'lg:grid lg:grid-cols-3 lg:w-full xl:w-auto'}`}
					/>
				</div>
				<div
					className={`${
						isCompetitonPage
							? 'fixed inset-x-0 bottom-0 bg-white py-6 px-4 shadow-[0px_1px_18px_5px_rgba(34,60,80,0.2)] lg:static lg:p-0 lg:shadow-none'
							: ''
					}`}
				>
					{authorizedUser?.role !== Role.ChiefJudge && (
						<div className='flex gap-2 lg:flex-col lg:gap-3'>
							<Button
								onClick={handleParticipateClick}
								classes={`${isCompetitonPage ? 'md:w-full' : 'w-full mt-5 2xl:mt-[1.625rem]'}`}
								disabled={fitCompetitionParametersCheck}
							>
								Participate
							</Button>
							{children}
						</div>
					)}
				</div>
				{fitCompetitionParametersCheck && authorizedUser?.role !== Role.ChiefJudge && (
					<p className='mt-4 text-error-red md:mt-5 lg:mt-2'>* You don&#39;t fit the parameters</p>
				)}
			</div>
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				modalType={screenWidth > BreakPoint.Lg ? 'regular' : 'sideMenu'}
				showModalHeader={screenWidth > BreakPoint.Lg}
				classes='lg:max-w-[26rem] xl:max-w-[29.375rem]'
				content={
					<CompetitionPayment
						price={competitionData.price?.currentValue}
						onClose={() => setIsModalOpen(false)}
						competitionDataProps={competitionData}
					/>
				}
			/>
		</div>
	)
}
