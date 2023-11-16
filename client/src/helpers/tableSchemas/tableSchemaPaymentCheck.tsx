import { Button } from 'src/ui'
import { ClampedText } from 'src/components/ClampedText/ClampedText'
import { ParticipantsRequestedCheckTable } from 'src/routes/VerifyPaymentPage'
import { getAge } from 'src/helpers/datetime'
import { MAX_PAYMENT_REQUEST_COUNT } from 'src/constants/maxRequestCount'
import { CompetitionPaymentPaidType } from 'src/types'

type TableSchemaPaymentCheckProps = {
	tableData: ParticipantsRequestedCheckTable[]
	handleAcceptPaymentTrue?: (payment: CompetitionPaymentPaidType) => void
	handleAcceptPaymentFalse?: (payment: CompetitionPaymentPaidType) => void
	competitionId?: string
	setUserPaymentPaidPending?: boolean
}

const setRequestParams = (competitionId: string, userId: string, paid: boolean) => ({
	path: {
		id: competitionId,
		userId
	},
	body: {
		paid
	}
})

export const tableSchemaPaymentCheck = ({
	tableData,
	handleAcceptPaymentTrue,
	handleAcceptPaymentFalse,
	competitionId,
	setUserPaymentPaidPending
}: TableSchemaPaymentCheckProps) => {
	return tableData.map(({ userData, message, requestedCount }, i) => {
		return {
			cells: [
				{
					node: i + 1,
					classes: '!pt-4 !pb-3 justify-center max-w-[3.5rem] text-black'
				},
				{
					node: (
						<div className='w-full'>
							<div className='flex justify-between'>
								<div>
									<p className='inline-block w-80 text-black'>{userData?.fullName}</p>
									<p className='inline-block  text-black'>{userData?.email}</p>
									<p className='mt-1.5 text-sm'>
										{userData?.gender}, {getAge(userData?.birthDate)} age, {userData?.weight} kg
									</p>
								</div>
								{requestedCount && requestedCount < MAX_PAYMENT_REQUEST_COUNT && (
									<div>
										{handleAcceptPaymentTrue && (
											<Button
												onClick={() =>
													handleAcceptPaymentTrue(
														setRequestParams(competitionId as string, userData?._id as string, true)
													)
												}
												loading={setUserPaymentPaidPending}
												classes='w-[11.375rem] mr-2.5'
											>
												Paid
											</Button>
										)}
										{handleAcceptPaymentFalse && (
											<Button
												onClick={() =>
													handleAcceptPaymentFalse(
														setRequestParams(competitionId as string, userData?._id as string, false)
													)
												}
												loading={setUserPaymentPaidPending}
												classes='w-[11.375rem]'
												type='outlined'
											>
												Not paid
											</Button>
										)}
									</div>
								)}
							</div>
							<ClampedText classes='mt-5'>{message}</ClampedText>
						</div>
					),
					classes: '!pt-4 !pb-3 !w-full'
				}
			]
		}
	})
}
