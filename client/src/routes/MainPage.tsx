import { ReactElement, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { fetchUsers } from 'src/store/slices/usersSlice'

export const MainPage = (): ReactElement => {
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(fetchUsers({}))
	}, [dispatch])

	const users = useAppSelector(s => s.users.data)

	return (
		<div className='flex h-full w-[100vw] flex-col items-center justify-center'>
			{users.items.map(user => (
				<div key={user._id}>{user.role}</div>
			))}
		</div>
	)
}
