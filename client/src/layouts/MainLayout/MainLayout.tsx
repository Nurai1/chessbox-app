import { ReactElement, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from 'src/components'
import { Modal } from '../../ui'

export const MainLayout = (): ReactElement => {
	const [showI18nWarningModal, setShowI18nWarningModal] = useState(!localStorage.getItem('showedI18nWarningModal'))

	return (
		<div className='ios_scroll_issue relative flex h-screen min-h-screen flex-col overflow-x-hidden'>
			<Header />
			<Outlet />
			<Modal
				isOpen={showI18nWarningModal}
				onClose={() => {
					setShowI18nWarningModal(false)
					localStorage.setItem('showedI18nWarningModal', 'true')
				}}
				modalType='regular'
				content={<div className='flex-center'>Вы можете менять язык справа сверху в приложении.</div>}
				title='Русский язык появился!'
			/>
		</div>
	)
}
