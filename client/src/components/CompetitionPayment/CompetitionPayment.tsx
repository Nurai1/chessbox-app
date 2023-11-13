import { FC, useState, useRef, MutableRefObject, useEffect } from 'react'
import { ReactComponent as ArrowLeftIcon } from 'src/assets/arrow-left.svg'
import { ReactComponent as CopyIcon } from 'src/assets/copy.svg'
import { ReactComponent as WhatsappIcon } from 'src/assets/whatsapp.svg'
import { Input, Alert, Button } from 'src/ui'
import { AlertPropTypes } from 'src/ui/Alert/Alert'
import { copyToClipboard } from 'src/helpers/copyToClipboard'
import { useWindowSize } from 'usehooks-ts'
import { twMerge } from 'tailwind-merge'
import { BreakPoint } from 'src/constants/breakPoints'
import { SeTuserPaymentRequestToCheckApiSchema, CompetitionSchema } from 'src/types'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { seTuserPaymentRequestToCheck } from 'src/store/slices/competitionSlice'
import { updateCompetitionsListCompetition } from 'src/store/slices/competitionsSlice'

type CompetitionPaymentPropsType = {
	onClose: () => void
	competitionDataProps?: CompetitionSchema
	price?: number
}

type AlertType = {
	show: boolean
} & AlertPropTypes

export type CompetitionPaymentDataType = {
	path: {
		id: string
		userId: string
	}
	body: SeTuserPaymentRequestToCheckApiSchema
}

// stores users entered data, to prevent loose users input data if accidentally close modal
let userInput = ''

export const CompetitionPayment: FC<CompetitionPaymentPropsType> = ({ price, onClose, competitionDataProps }) => {
	const [message, setMessage] = useState(userInput)
	const [copyAlertData, setCopyAlertData] = useState<AlertType>({
		type: 'success',
		title: 'Copied',
		show: false
	})
	const { width: screenWidth } = useWindowSize()
	const dispatch = useAppDispatch()

	const cardNumber = useRef(null)
	const mail = useRef(null)
	const { authorizedUser } = useAppSelector(state => state.user)

	const {
		seTuserPaymentRequestToCheckError,
		seTuserPaymentRequestToCheckPending,
		data: competitionDataStore
	} = useAppSelector(state => state.competition)

	const competitionData = competitionDataStore || competitionDataProps

	useEffect(() => {
		if (seTuserPaymentRequestToCheckError) {
			setCopyAlertData({ show: true, type: 'error', title: seTuserPaymentRequestToCheckError })
		}
		setTimeout(() => setCopyAlertData({ show: false }), 3000)
	}, [seTuserPaymentRequestToCheckError])

	useEffect(() => {
		if (competitionDataStore) {
			dispatch(
				updateCompetitionsListCompetition({
					competition: competitionDataStore as CompetitionSchema,
					competitionId: competitionDataStore._id as string
				})
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [competitionDataStore])

	const handleCopy = (ref: MutableRefObject<HTMLElement>) => {
		const { type, title } = copyToClipboard(ref)
		setCopyAlertData({ show: true, type, title })
		setTimeout(() => setCopyAlertData({ show: false, type: copyAlertData.type }), 3000)
	}

	const handleMessage = (value?: string) => {
		setMessage(value as string)
		userInput = value as string
	}

	const currentUserRequestData =
		competitionData && competitionData.usersPaymentInfo?.find(paymentInfo => paymentInfo.userId === authorizedUser?._id)

	const handleSubmit = () => {
		if (competitionData) {
			const paymentData: CompetitionPaymentDataType = {
				path: {
					id: competitionData._id as string,
					userId: authorizedUser?._id as string
				},
				body: {
					message
				}
			}
			dispatch(seTuserPaymentRequestToCheck(paymentData))
		}
	}

	return (
		<div className='relative grid gap-[1rem] px-6 pb-12 pt-14 text-sm sm:px-[3.75rem] sm:pt-[1.875rem] lg:-mt-7 lg:px-0 lg:pt-0 lg:pb-6 xl:text-base'>
			<button className='absolute top-5 left-3 lg:hidden' onClick={onClose} type='button'>
				<ArrowLeftIcon className='w-[1.375rem]' />
			</button>
			{price && <p className=' text-grey'>Payment: {price} ₽</p>}
			<p>Transfer from Russia on bank account:</p>
			<div>
				<div className='flex flex-col items-center justify-center gap-1'>
					<span className='font-medium text-gray-500 lg:font-bold' ref={cardNumber}>
						Расчетный счет(Р/С):
					</span>
					<span className='inline-flex-center font-medium lg:font-bold' ref={cardNumber}>
						40703810238000016464
						<button type='button' onClick={() => handleCopy(cardNumber as unknown as MutableRefObject<HTMLElement>)}>
							<CopyIcon className='w-[1.375rem]' />
						</button>
					</span>
				</div>
				<div className='flex flex-col items-center justify-center gap-1'>
					<span className='text-center font-medium text-gray-500 lg:font-bold' ref={cardNumber}>
						Банковский идентификационный код (БИК):
					</span>
					<span className='inline-flex-center font-medium lg:font-bold' ref={cardNumber}>
						044525225
						{/* TODO: FIX COPY, DO IT WITHOUT REF */}
						<button type='button' onClick={() => handleCopy(cardNumber as unknown as MutableRefObject<HTMLElement>)}>
							<CopyIcon className='w-[1.375rem]' />
						</button>
					</span>
				</div>
				<div className='flex flex-col items-center justify-center gap-1'>
					<span className='text-center font-medium text-gray-500 lg:font-bold' ref={cardNumber}>
						Идентификационный номер налогоплательщика (ИНН):
					</span>

					<span className='inline-flex-center font-medium lg:font-bold' ref={cardNumber}>
						7727445492
						{/* TODO: FIX COPY, DO IT WITHOUT REF */}
						<button type='button' onClick={() => handleCopy(cardNumber as unknown as MutableRefObject<HTMLElement>)}>
							<CopyIcon className='w-[1.375rem]' />
						</button>
					</span>
				</div>
				<div className='flex items-center justify-center'>
					<a href='file' download className='underline'>
						Download additional info
					</a>
				</div>
			</div>
			<Input onChange={handleMessage} value={message} isTextarea />
			<div>
				<Button
					onClick={handleSubmit}
					classes='text-base w-full'
					loading={seTuserPaymentRequestToCheckPending}
					disabled={currentUserRequestData?.requestedCount === 3}
				>
					Transferred!
				</Button>
				<p className='mt-2 text-center text-sm'>You can request check payment only 3 times.</p>
				{currentUserRequestData?.requestedCount && currentUserRequestData.requestedCount < 3 && (
					<p className='mt-2 text-center text-sm'>
						You have requested <strong>{currentUserRequestData?.requestedCount}</strong> times
					</p>
				)}
				{currentUserRequestData?.requestedCount === 3 && (
					<p className='mt-2 text-center text-sm'>
						You requested to check a payment more than 3 times. You can not participate in the competition.
					</p>
				)}
			</div>
			<p className='text-center '>If you have any questions, please contact:</p>
			<div>
				<a
					href={`https://wa.me/${'+74957891500'}`}
					target='_blank'
					rel='noreferrer'
					className='flex items-center justify-center gap-3 '
				>
					<WhatsappIcon className='h-6 w-6' /> +7 495 789 15 00
				</a>
				<div className='mt-2 flex items-center justify-center gap-1'>
					<span className='text-center' ref={mail}>
						chessboxrus@mail.ru
					</span>
					<button type='button' onClick={() => handleCopy(mail as unknown as MutableRefObject<HTMLElement>)}>
						<CopyIcon className='w-[1.375rem]' />
					</button>
				</div>
			</div>
			<div
				className={twMerge(
					'invisible absolute top-8 right-8 w-56 opacity-0 transition lg:-top-24',
					`${copyAlertData.show && 'opacity-1 visible'}`
				)}
				style={{ right: screenWidth > BreakPoint.Lg ? `calc(${screenWidth / 2}px - 85vw)` : '' }}
			>
				<Alert type={copyAlertData.type} title={copyAlertData.title} />
			</div>
		</div>
	)
}
