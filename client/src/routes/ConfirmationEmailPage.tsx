import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'
import { useAppDispatch } from 'src/hooks/redux'
import { confirmEmail } from 'src/store/slices/userSlice'
import { Alert } from 'src/ui'
import { useOptionalTranslation } from '../hooks/useOptionalTranslation'
import { useRedirectAuthorizedUser } from '../hooks/useRedirectAuthorizedUser'
import { LineLoader } from '../ui/LineLoader'

export const ConfirmationEmailPage = (): ReactElement => {
	const { t } = useOptionalTranslation()
	// eslint-disable-next-line no-restricted-globals
	const urlParams = useMemo(() => new URLSearchParams(location.search), [])

	const [isEmailConfirmed, setIsEmailConfirmed] = useState<{ type: 'pending' | 'success' | 'failed'; message: string }>(
		{ type: 'pending', message: 'Please, wait until email will be confirmed.' }
	)
	const dispatch = useAppDispatch()

	useRedirectAuthorizedUser(AppRoute.Root)

	useEffect(() => {
		if (urlParams.has('email') && urlParams.has('confirmationCode')) {
			dispatch(
				confirmEmail({
					email: urlParams.get('email') as string,
					confirmationCode: urlParams.get('confirmationCode') as string
				})
			).then(res => {
				if (res.meta.requestStatus === 'rejected') {
					setIsEmailConfirmed({ type: 'failed', message: (res.payload as { errorMessage: string }).errorMessage })
				}
				if (res.meta.requestStatus === 'fulfilled') {
					setIsEmailConfirmed({ type: 'success', message: 'Email is confirmed.' })
				}
			})
		} else {
			setIsEmailConfirmed({ type: 'failed', message: 'Confirmation link is not valid.' })
		}
	}, [dispatch, urlParams])

	const encodedEmail = urlParams.get('email')
	return (
		<main className='flex grow flex-col bg-pale-white py-[20px]'>
			<form className='m-auto max-w-[488px] rounded-[6px] bg-white p-[30px_17px] md:p-[35px_57px]'>
				<h1 className='mb-[8px] text-center text-heading-4'>{t('emailConfirmation')}</h1>
				<div className='flex flex-col items-center gap-[18px]'>
					{encodedEmail && (
						<span className='font-medium'>
							{t('email')}: {decodeURIComponent(encodedEmail)}
						</span>
					)}
					{isEmailConfirmed.type === 'failed' && <Alert type='error' subtitle={isEmailConfirmed.message} />}
					{isEmailConfirmed.type === 'success' && <Alert type='success' subtitle={isEmailConfirmed.message} />}
					{isEmailConfirmed.type === 'pending' && (
						<>
							<LineLoader classes='[--base-color:#63B9F1]' />
							<Alert type='info' subtitle={isEmailConfirmed.message} />
						</>
					)}
				</div>
				{isEmailConfirmed.type === 'success' && (
					<div className='mt-2 flex justify-end text-sm font-thin'>
						<Link to={`/${AppRoute.SignIn}`} className='underline transition hover:opacity-70'>
							{t('signIn')}
						</Link>
					</div>
				)}
			</form>
		</main>
	)
}
