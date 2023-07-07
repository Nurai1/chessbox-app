import { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { fetchUsers, clearUsers } from 'src/store/slices/usersSlice'
import { ratingTableSchema } from '../helpers/tableSchema'
import { UsersTableWithTitle, Search } from '../components'
import { TableWrapper, Loader } from '../ui'

const USERS_PER_STEP = 5

export const RatingPage = (): ReactElement => {
	const dispatch = useAppDispatch()
	const [query, setQuery] = useState({
		offset: 0
	})

	const searchParams = useAppSelector(s => s.users.filterState)
	const { items: users, total } = useAppSelector(s => s.users.data)
	const isNextPageLoading = useAppSelector(s => s.users.loading)

	useEffect(() => {
		dispatch(fetchUsers({ ...query, limit: USERS_PER_STEP, offset: 0 }))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams])

	useEffect(() => {
		setQuery({ offset: 0, ...searchParams })
		dispatch(clearUsers())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams])

	const hasMoreUsers = total !== users.length
	const usersTable = ratingTableSchema(users)
	const hasNextPage = users.length < total

	const loadNextPage = () => {
		if (isNextPageLoading || !hasMoreUsers) return

		const newOffset = query.offset + USERS_PER_STEP
		const newQuery = {
			...query,
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
				<Search classes='mb-[35px] md:mb-[30px]' />
				{!users.length && <Loader classes='h-[80vh]' />}
				{users && (
					<UsersTableWithTitle
						rows={usersTable}
						hasNextPage={hasNextPage}
						isInfiniteLoader
						isNextPageLoading={isNextPageLoading}
						loadNextPage={loadNextPage}
						classes='border-t'
					/>
				)}
			</TableWrapper>
		</main>
	)
}
