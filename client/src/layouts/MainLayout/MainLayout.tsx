import { ReactElement } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from 'src/components'

export const MainLayout = (): ReactElement => {
	return (
		<div className='relative flex h-screen min-h-screen flex-col overflow-x-hidden'>
			<Header />
			<Outlet />
		</div>
	)
}
