import { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { fetchUsers, clearUsers } from 'src/store/slices/usersSlice'
import { ratingTableSchema } from '../helpers/tableSchema'
import { UsersTableWithTitle, UsersSearch } from '../components'
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
	const isLoaded = useAppSelector(s => s.users.loaded)

	useEffect(() => {
		setQuery({ ...searchParams, offset: 0 })
		dispatch(fetchUsers({ ...searchParams, limit: USERS_PER_STEP, offset: 0 }))
		dispatch(clearUsers())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams])

	const usersTable = ratingTableSchema(users)
	const hasUsers = users.length > 0
	const hasMoreUsers = total !== users.length
	const hasNextPage = users.length < total
	const isLoading = !users.length && !isLoaded
	const nothingFound = total === 0 && isLoaded

	const loadNextPage = () => {
		if (isNextPageLoading || !hasMoreUsers) return

		const newQuery = {
			...query,
			limit: USERS_PER_STEP,
			offset: query.offset + USERS_PER_STEP
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
				<UsersSearch classes='mb-[35px] md:mb-[30px]' />
				{isLoading && <Loader classes='h-[80vh]' />}
				{hasUsers && (
					<UsersTableWithTitle
						rows={usersTable}
						hasNextPage={hasNextPage}
						isInfiniteLoader
						isNextPageLoading={isNextPageLoading}
						loadNextPage={loadNextPage}
						classes='border-t'
					/>
				)}
				{nothingFound && <h2 className='m-auto text-2xl'>Nothing found</h2>}
			</TableWrapper>
		</main>
	)
}
