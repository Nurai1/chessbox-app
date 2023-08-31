import { FC, useState } from 'react'
import { TableBody, TableHeader, TableSortButton } from 'src/ui'
import { tableSchemaGroupCreateParticipantsBody } from 'src/helpers/tableSchemas/tableSchemaGroupCreateParticipantsBody'
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

	const tableHeaderColumns = [
		{ node: '', classes: 'max-w-[3rem]' },
		{
			node: (
				<TableSortButton
					sortType={SortType.Name}
					onClick={handleClick}
					activeClass={activeSort === SortType.Name ? 'underline' : ''}
				>
					Name
				</TableSortButton>
			),
			classes: 'max-w-[12.5rem] !text-base font-bold'
		},
		{
			node: (
				<TableSortButton
					sortType={SortType.Sex}
					onClick={handleClick}
					activeClass={activeSort === SortType.Sex ? 'underline' : ''}
				>
					Sex
				</TableSortButton>
			),
			classes: 'max-w-[6.5rem] !text-base font-bold'
		},
		{
			node: (
				<TableSortButton
					sortType={SortType.Age}
					onClick={handleClick}
					activeClass={activeSort === SortType.Age ? 'underline' : ''}
				>
					Age
				</TableSortButton>
			),
			classes: 'max-w-[6.5rem] !text-base font-bold'
		},
		{
			node: (
				<TableSortButton
					sortType={SortType.Weight}
					onClick={handleClick}
					activeClass={activeSort === SortType.Weight ? 'underline' : ''}
				>
					Weight
				</TableSortButton>
			),
			classes: 'max-w-[6.5rem] !text-base font-bold'
		},
		{
			node: <span className="flex gap-1 uppercase">Group</span>,
			classes: '!text-base font-bold'
		}
	]

	const participantsInGroupTable = tableSchemaGroupCreateParticipantsBody(participants.inGroup)
	const participantsOutGroupTable = tableSchemaGroupCreateParticipantsBody(participants.outGroup)

	return (
		<div className={classes}>
			<button
				type="button"
				className={`px-7 py-2 ml-8 relative border border-pale-grey rounded-t-[1.25rem] text-xl font-medium bg-white z-10 hover:text-grey transition ${activeList === ActiveListStatus.OutGroup && 'text-disabled-grey'}`}
				onClick={() => setActiveList(ActiveListStatus.InGroup)}
			>
				Participants
				<span className="text-disabled-grey">{participantsInGroupTable.length}</span>
			</button>
			<button
				type="button"
				className={`pl-14 pr-7 py-2 -ml-9 border border-pale-grey rounded-t-[1.25rem] text-xl font-medium hover:text-grey transition ${activeList === ActiveListStatus.InGroup && 'text-disabled-grey'}`}
				onClick={() => setActiveList(ActiveListStatus.OutGroup)}
			>
				Outgroup
				<span className="text-disabled-grey">{participantsOutGroupTable.length}</span>
			</button>
			<div className="pt-2 pb-5 px-10 -mb-5 -mt-px border border-pale-grey rounded-l-3xl">
				<TableHeader columns={tableHeaderColumns}/>
				<div className="h-full overflow-y-auto scroll-custom">
					{
						activeList === 'inGroup'
							? <TableBody rows={participantsInGroupTable} classes="max-h-[49.8rem]"/>
							: <TableBody rows={participantsOutGroupTable} classes="max-h-[49.8rem]"/>
					}
				</div>
			</div>
		</div>
	)
}
