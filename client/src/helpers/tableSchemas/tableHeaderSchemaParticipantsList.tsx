import { TableSortButton } from 'src/ui'
import { SortType } from 'src/components/ParticipantsList/ParticipantsList'
import { TFunction } from 'src/hooks/useOptionalTranslation'

type TableHeaderSchemaParticipantsListPropsType = {
	handleClick: (sortType: string, sortOrder: string) => void
	activeSort?: string
	t: TFunction
}

export const tableHeaderSchemaParticipantsList = ({
	handleClick,
	activeSort,
	t
}: TableHeaderSchemaParticipantsListPropsType) => {
	return [
		{ node: '', classes: 'max-w-[3rem]' },
		{
			node: (
				<TableSortButton
					sortType={SortType.Name}
					onClick={handleClick}
					activeClass={activeSort === SortType.Name ? 'underline' : ''}
				>
					{t('name')}
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
					{t('sex')}
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
					{t('age')}
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
					{t('weight')}
				</TableSortButton>
			),
			classes: 'max-w-[6.5rem] !text-base font-bold'
		},
		{
			node: <span className='flex gap-1 uppercase'>Group</span>,
			classes: '!text-base font-bold'
		}
	]
}
