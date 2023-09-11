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

export const ParticipantsList: FC<ParticipantsListPropsType> = ({
	participants,
	onSort,
	classes
}) => {
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
		return (
			activeList === 'inGroup'
				? <TableBody rows={participantsInGroupTable} classes="max-h-[49.8rem]"/>
				: <TableBody rows={participantsOutGroupTable} classes="max-h-[49.8rem]"/>
		)
	}

	return (
		<div className={classes}>
			<button
				type="button"
				className={`px-7 py-2 ml-8 relative border border-pale-grey rounded-t-[1.25rem] text-xl font-medium bg-white z-10 hover:text-grey transition ${activeList === ActiveListStatus.OutGroup && 'text-disabled-grey'}`}
				onClick={() => setActiveList(ActiveListStatus.InGroup)}
			>
				Participants <span className="text-disabled-grey">{participantsInGroupTable.length}</span>
			</button>
			<button
				type="button"
				className={`pl-14 pr-7 py-2 -ml-9 border border-pale-grey rounded-t-[1.25rem] text-xl font-medium hover:text-grey transition ${activeList === ActiveListStatus.InGroup && 'text-disabled-grey'}`}
				onClick={() => setActiveList(ActiveListStatus.OutGroup)}
			>
				Outgroup <span className="text-disabled-grey">{participantsOutGroupTable.length}</span>
			</button>
			<div className="pt-2 pb-5 px-10 -mb-5 -mt-px border border-pale-grey rounded-l-3xl">
				<TableHeader columns={tableHeaderColumns}/>
				<div className="h-full overflow-y-auto scroll-custom">
					{noParticipants
						? <p className='text-heading-4 text-center'>No matches</p>
						: renderParticipantsTable()
					}
				</div>
			</div>
		</div>
	)
}
