import { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { fetchUsers } from 'src/store/slices/usersSlice'
import { ratingTableSchema } from '../helpers/tableSchema'
import { UsersTableWithTitle } from '../components'
import { TableWrapper, Loader } from '../ui'

const USERS_PER_STEP = 5

export const RatingPage = (): ReactElement => {
	const dispatch = useAppDispatch()
	const [query, setQuery] = useState({
		offset: 0
	})

	const { items: users, total } = useAppSelector(s => s.users.data)
	const isNextPageLoading = useAppSelector(s => s.users.loading)
	const hasMoreUsers = total !== users.length

	useEffect(() => {
		dispatch(fetchUsers({ ...query, limit: USERS_PER_STEP }))
	}, [dispatch, query])

	const usersTable = ratingTableSchema(users)

	const hasNextPage = users.length < total

	const loadNextPage = () => {
		if (isNextPageLoading || !hasMoreUsers) return

		const newOffset = query.offset + USERS_PER_STEP
		const newQuery = {
			limit: USERS_PER_STEP,
			offset: newOffset
		}
		setQuery(newQuery)
		dispatch(fetchUsers(newQuery))
	}

	return (
		<main className='container m-auto flex grow flex-col px-[17px] pt-[15px] md:px-7 md:pt-[25px] lg:px-10 lg:pt-[33px] 2xl:px-[40px]'>
			<h1 className='2xl:[mb-40px] mb-[13px] text-[24px] font-semibold xl:mb-[17px] xl:text-[54px] xl:font-bold'>
				Rating
			</h1>

			<TableWrapper>
				<h2
					className='border-b py-[18px] text-base font-medium
                                        text-black md:pb-[26px] md:text-xl
                                        md:font-semibold lg:text-2xl
                                        2xl:text-[32px]'
				>
					Заголовок таблицы
				</h2>
				{!users.length && <Loader classes='h-[80vh]' />}
				{users && (
					<UsersTableWithTitle
						rows={usersTable}
						hasNextPage={hasNextPage}
						isInfiniteLoader
						isNextPageLoading={isNextPageLoading}
						loadNextPage={loadNextPage}
					/>
				)}
			</TableWrapper>
		</main>
	)
}
