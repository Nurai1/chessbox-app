import { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { fetchUsers, clearUsers } from 'src/store/slices/usersSlice'
import { tableSchemaRating } from 'src/helpers/tableSchemaRating'
import { UsersTableWithTitle, UsersSearch } from '../components'
import { Loader } from '../ui'

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

	const usersTable = tableSchemaRating(users)
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
		<main className='container m-auto flex grow flex-col px-4 pt-4 md:px-7 lg:px-10 2xl:px-[40px]'>
			<h1 className='mb-3 text-heading-4 xl:mb-5'>Rating</h1>
			<div className='md:border-pale-grey flex grow flex-col md:rounded-3xl md:border md:px-10 md:pt-5'>
				<UsersSearch classes='mb-2.5 xl:mb-4' />
				{isLoading && <Loader classes='h-[80vh]' />}
				{hasUsers && (
					<UsersTableWithTitle
						rows={usersTable}
						hasNextPage={hasNextPage}
						isInfiniteLoader
						isNextPageLoading={isNextPageLoading}
						loadNextPage={loadNextPage}
					/>
				)}
				{nothingFound && <h2 className='m-auto text-2xl'>Nothing found</h2>}
			</div>
		</main>
	)
}
