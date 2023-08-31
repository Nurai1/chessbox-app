import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowLeftIcon } from 'src/assets/arrow-left.svg'
import { ReactComponent as WhatsAppIcon } from 'src/assets/whatsapp.svg'
import { Loader } from 'src/ui'
import { CompetitionSchema, UserSchema } from 'src/types'
import { getFormattedDate } from 'src/helpers/datetime'

type CompetitionCreateHeaderPropsType = {
	title: string
	backArrowPath: string
	competitionData: CompetitionSchema | null
	judges?: UserSchema[] | null
}

export const CompetitionCreateHeader: FC<CompetitionCreateHeaderPropsType> = ({
	title,
	backArrowPath,
	competitionData,
	judges
}) => {
	const navigate = useNavigate()
	const dateStart = competitionData && getFormattedDate(competitionData.startDate, 'MMM D, HH:mm')

	return (
		<div className='mb-8 xl:mb-12 xl:flex xl:justify-between xl:gap-6'>
			{competitionData ? (
				<div className='mb-6 xl:mb-0 xl:max-w-[34.375rem]'>
					<h1 className='mb-1.5 text-lg font-medium xl:text-xl'>{competitionData.name}</h1>
					<p className='mb-6 text-[#6C6A6C] xl:mb-11'>{dateStart}</p>
					<div className='relative mb-1.5'>
						<h2 className='text-2xl font-semibold xl:text-4xl xl:font-bold'>{title}</h2>
						<button
							className='hidden transition hover:opacity-70 xl:absolute xl:left-[-3.5rem] xl:top-0 xl:block'
							onClick={() => navigate(backArrowPath)}
							type='button'
						>
							<ArrowLeftIcon />
						</button>
					</div>
				</div>
			) : (
				<Loader />
			)}
			{judges && (
				<div className='mb-5 md:mb-8 xl:mb-12 xl:ml-8'>
					<h3 className='mb-1 font-semibold lg:mb-3 xl:text-right xl:text-2xl'>Judges</h3>
					<div className='flex flex-wrap gap-3 lg:gap-6 xl:justify-between'>
						{judges.map(judge => (
							<div className='flex flex-col' key={judge._id}>
								<a
									className='flex items-center gap-4 text-sm font-medium text-black transition hover:opacity-70 md:text-base xl:text-xl'
									href={`https://wa.me/${judge.socialNetworks?.whatsup}`}
									target='_blank'
									rel='noreferrer'
								>
									<WhatsAppIcon className='w-3.5 min-w-[0.875rem] lg:w-6 lg:min-w-[1.5rem]' />
									{judge.fullName}
								</a>
								<span className='text-sm text-neutral-500 md:text-base'>{judge.fightClub?.name}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
