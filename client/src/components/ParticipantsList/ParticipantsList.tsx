import { FC, useState } from 'react'
import { TableBody, TableHeader } from 'src/ui'
import { tableSchemaGroupCreateParticipantsBody } from 'src/helpers/tableSchemas/tableSchemaGroupCreateParticipantsBody'
import { tableHeaderSchemaParticipantsList } from 'src/helpers/tableSchemas/tableHeaderSchemaParticipantsList'
import { UserSchema } from 'src/types'

type ParticipantsListPropsType = {
	participants: ParticipantsListTable
	onSort: (sortType: string, sortOrder: string) => void
	classes?: string
}

export type ParticipantsListTable = {
	inGroup: UserSchema[]
	outGroup: UserSchema[]
}

enum ActiveListStatus {
	InGroup = 'inGroup',
	OutGroup = 'outGroup'
}

export enum SortType {
	Name = 'fullName',
	Sex = 'gender',
	Age = 'birthDate',
	Weight = 'weight'
}

export const ParticipantsList: FC<ParticipantsListPropsType> = ({ participants, onSort, classes }) => {
	const [activeList, setActiveList] = useState(ActiveListStatus.InGroup)
	const [activeSort, setActiveSort] = useState<string>()

	const handleClick = (sortType: string, sortOrder: string) => {
		onSort(sortType, sortOrder)
		setActiveSort(sortType)
	}

	const tableHeaderColumns = tableHeaderSchemaParticipantsList({ activeSort, handleClick })
	const noParticipants = participants.inGroup.length === 0 && participants.outGroup.length === 0
	const participantsInGroupTable = tableSchemaGroupCreateParticipantsBody(participants.inGroup)
	const participantsOutGroupTable = tableSchemaGroupCreateParticipantsBody(participants.outGroup)

	const renderParticipantsTable = () => {
		return activeList === 'inGroup' ? (
			<TableBody rows={participantsInGroupTable} classes='max-h-[49.8rem]' />
		) : (
			<TableBody rows={participantsOutGroupTable} classes='max-h-[49.8rem]' />
		)
	}

	return (
		<div className={classes}>
			<button
				type='button'
				className={`relative z-10 ml-8 rounded-t-[1.25rem] border border-pale-grey bg-white px-7 py-2 text-xl font-medium transition hover:text-grey ${
					activeList === ActiveListStatus.OutGroup && 'text-disabled-grey'
				}`}
				onClick={() => setActiveList(ActiveListStatus.InGroup)}
			>
				Participants <span className='text-disabled-grey'>{participantsInGroupTable.length}</span>
			</button>
			<button
				type='button'
				className={`-ml-9 rounded-t-[1.25rem] border border-pale-grey py-2 pl-14 pr-7 text-xl font-medium transition hover:text-grey ${
					activeList === ActiveListStatus.InGroup && 'text-disabled-grey'
				}`}
				onClick={() => setActiveList(ActiveListStatus.OutGroup)}
			>
				Outgroup <span className='text-disabled-grey'>{participantsOutGroupTable.length}</span>
			</button>
			<div className='-mb-5 -mt-px rounded-l-3xl border border-pale-grey px-10 pt-2 pb-5'>
				<TableHeader columns={tableHeaderColumns} />
				<div className='scroll-custom h-full overflow-y-auto'>
					{noParticipants ? <p className='text-center text-heading-4'>No matches</p> : renderParticipantsTable()}
				</div>
			</div>
		</div>
	)
}
