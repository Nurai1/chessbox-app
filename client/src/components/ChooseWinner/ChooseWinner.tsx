import { FC, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ReactComponent as CopyIcon } from 'src/assets/copy.svg'
import { ReactComponent as GoldMedalIcon } from 'src/assets/medal-gold.svg'
import { ReactComponent as RookBlack } from 'src/assets/rook-black.svg'
import { ReactComponent as RookWhite } from 'src/assets/rook-white.svg'
import { getAge } from 'src/helpers/datetime'
import { PairType } from 'src/helpers/tableSchemas/tableSchemaPairs'
import { ChooseWinnerType } from 'src/types'
import { CheckboxAndRadioButton } from 'src/ui'
import { twMerge } from 'tailwind-merge'
import { getEnv } from '../../configEnv'

const env = getEnv()

type ChooseWinnerPropsType = {
	pair: PairType
	groupId: string
	onChooseWinner?: (data?: Record<string, ChooseWinnerType>) => void
	isJudgeCompetitionPage?: boolean
}

export const ChooseWinner: FC<ChooseWinnerPropsType> = ({ pair, isJudgeCompetitionPage, groupId, onChooseWinner }) => {
	const { competitionId } = useParams()

	const [winner, setWinner] = useState<Record<string, ChooseWinnerType>>()
	const handleWinnerIdChoose = (value?: string, name?: string) => {
		const winnerData = {
			[name as string]: {
				groupId,
				pairId: pair._id as string,
				winnerId: value,
				loserId: value === pair.blackParticipant ? pair.whiteParticipant : pair.blackParticipant
			}
		}
		setWinner(winnerData)
		if (onChooseWinner) {
			onChooseWinner(winnerData)
		}
	}

	const areBothDisqualified = pair.disqualified?.blackParticipant && pair.disqualified?.whiteParticipant

	return (
		<div className='col-start-1 col-end-3 flex justify-between md:col-end-2 xl:col-start-2 xl:col-end-3 xl:row-start-1 xl:row-end-2'>
			<div className='flex w-full flex-col'>
				<div className='flex justify-between'>
					<div className='flex w-[45%]'>
						<div className='flex w-full flex-col gap-0.5'>
							{(areBothDisqualified || pair.acceptedForFight?.whiteParticipant) &&
							isJudgeCompetitionPage &&
							!pair.winner ? (
								<CheckboxAndRadioButton
									name={pair._id as string}
									value={pair.whiteParticipant}
									type='radio'
									title={pair.whiteParticipantData?.fullName}
									classes='-ml-8'
									onChange={handleWinnerIdChoose}
									checked={winner?.[pair._id as string]?.winnerId === pair.whiteParticipantData?._id}
								/>
							) : (
								<p className='text-sm text-black xl:text-base'>{pair.whiteParticipantData?.fullName}</p>
							)}
							{(env === 'dev' || env === 'local') && (
								// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
								<div
									className='flex cursor-pointer gap-x-2 text-black underline hover:opacity-70'
									onClick={() => {
										navigator.clipboard.writeText(
											JSON.stringify({
												competitionId,
												groupId,
												pairId: pair?._id,
												userId: pair?.whiteParticipantData?._id
											})
										)
									}}
								>
									<span>Copy user data</span>
									<CopyIcon />
								</div>
							)}
							<a
								href={`https://lichess.org/@/${pair?.whiteParticipantData?.chessPlatform?.username}`}
								className={twMerge(
									'flex items-center gap-1 text-base font-medium transition hover:opacity-70',
									pair?.whiteParticipantData?.chessPlatform?.username && 'underline'
								)}
								target='_blank'
								rel='noreferrer'
							>
								<RookWhite className='h-[1.5rem] min-w-[1rem]' />
								<div className='truncate'>{pair?.whiteParticipantData?.chessPlatform?.username ?? '—'}</div>
							</a>
							<p className='text-xs xl:text-base'>
								{getAge(pair.whiteParticipantData?.birthDate as string)} age, {pair.whiteParticipantData?.weight} kg
							</p>
							<p className='text-xs xl:text-base'>
								{pair.whiteParticipantData?.address?.city}, {pair.whiteParticipantData?.address?.country}
							</p>
							{pair.disqualified?.whiteParticipant && <p className='mt-1 text-error-red'>Disqualification</p>}
						</div>
						{pair.winner === pair.whiteParticipant && <GoldMedalIcon className='ml-2.5 h-6 w-5' />}
					</div>
					<span className='mx-[2%] w-[6%] text-sm text-black xl:text-base'>VS</span>
					<div className='flex w-[45%]'>
						<div className='ml-auto flex w-fit xl:ml-10'>
							<div className='flex w-full flex-col gap-0.5'>
								{(areBothDisqualified || pair.acceptedForFight?.blackParticipant) &&
								isJudgeCompetitionPage &&
								!pair.winner ? (
									<CheckboxAndRadioButton
										name={pair._id as string}
										value={pair.blackParticipant}
										type='radio'
										title={pair.blackParticipantData?.fullName}
										classes='-ml-8'
										onChange={handleWinnerIdChoose}
										checked={winner?.[pair._id as string]?.winnerId === pair.blackParticipantData?._id}
									/>
								) : (
									<p className='text-sm text-black xl:text-base'>{pair.blackParticipantData?.fullName}</p>
								)}
								{(env === 'dev' || env === 'local') && (
									// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
									<div
										className='flex cursor-pointer gap-x-2 text-black underline hover:opacity-70'
										onClick={() => {
											navigator.clipboard.writeText(
												JSON.stringify({
													competitionId,
													groupId,
													pairId: pair?._id,
													userId: pair?.blackParticipantData?._id
												})
											)
										}}
									>
										<span>Copy user data</span>
										<CopyIcon />
									</div>
								)}
								<a
									href={`https://lichess.org/@/${pair?.blackParticipantData?.chessPlatform?.username}`}
									className={twMerge(
										'flex items-center gap-1 text-base font-medium transition hover:opacity-70',
										pair?.blackParticipantData?.chessPlatform?.username && 'underline'
									)}
									target='_blank'
									rel='noreferrer'
								>
									<RookBlack className='h-[1.5rem] min-w-[1rem]' />
									<div className='truncate'>{pair?.blackParticipantData?.chessPlatform?.username ?? '—'}</div>
								</a>
								<p className='text-xs xl:text-base'>
									{getAge(pair.blackParticipantData?.birthDate as string)} age, {pair.blackParticipantData?.weight} kg
								</p>
								<p className='text-xs xl:text-base'>
									{pair.blackParticipantData?.address?.city}, {pair.blackParticipantData?.address?.country}
								</p>
								{pair.disqualified?.blackParticipant && <p className='mt-1 text-error-red'>Disqualification</p>}
							</div>
							{pair.winner === pair.blackParticipant && <GoldMedalIcon className='ml-2.5 h-6 w-5' />}
						</div>
					</div>
				</div>
				{areBothDisqualified && (
					<div className='mb-1 flex text-lg text-error-red'>Choose who goes to the next round</div>
				)}
			</div>
		</div>
	)
}
