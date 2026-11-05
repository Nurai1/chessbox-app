import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { confirmEmailApi } from 'src/api/requests/signUp'
import { AppRoute } from 'src/constants/appRoute'
import { Alert } from 'src/ui'
import { useOptionalTranslation } from '../hooks/useOptionalTranslation'
import { LineLoader } from '../ui/LineLoader'

export const ConfirmationEmailPage = (): ReactElement => {
	const { t } = useOptionalTranslation()
	const urlParams = useMemo(() => new URLSearchParams(window.location.search), [])
	const email = urlParams.get('email')
	const confirmationCode = urlParams.get('confirmationCode')

	const [isEmailConfirmed, setIsEmailConfirmed] = useState<{ type: 'pending' | 'success' | 'failed'; message: string }>(
		{ type: 'pending', message: '' }
	)

	useEffect(() => {
		let active = true
		const confirm = async () => {
			if (!email || !confirmationCode) {
				setIsEmailConfirmed({ type: 'failed', message: t('emailConfirmationInvalid') })
				return
			}
			try {
				const response = await confirmEmailApi({ email, confirmationCode })
				if (!active) return
				if (response.error || !response.data?.emailConfirmed) {
					setIsEmailConfirmed({
						type: 'failed',
						message: t(response.response.status === 400 ? 'emailConfirmationInvalid' : 'emailConfirmationFailed')
					})
				} else {
					setIsEmailConfirmed({ type: 'success', message: '' })
				}
			} catch {
				if (active) setIsEmailConfirmed({ type: 'failed', message: t('emailConfirmationFailed') })
			}
		}
		confirm()
		return () => {
			active = false
		}
	}, [email, confirmationCode, t])

	return (
		<main className='flex grow flex-col bg-pale-white py-[20px]'>
			<section className='m-auto max-w-[488px] rounded-[6px] bg-white p-[30px_17px] md:p-[35px_57px]'>
				<h1 className='mb-[8px] text-center text-heading-4'>{t('emailConfirmation')}</h1>
				<div className='flex flex-col items-center gap-[18px]'>
					{email && (
						<span className='font-medium'>
							{t('email')}: {email}
						</span>
					)}
					{isEmailConfirmed.type === 'failed' && <Alert type='error' subtitle={isEmailConfirmed.message} />}
					{isEmailConfirmed.type === 'success' && (
						<>
							<Alert type='success' subtitle={t('emailConfirmationSuccess')} />
							<p className='text-sm'>{t('emailConfirmationAnyDevice')}</p>
						</>
					)}
					{isEmailConfirmed.type === 'pending' && (
						<>
							<LineLoader classes='[--base-color:#63B9F1]' />
							<Alert type='info' subtitle={t('emailConfirmationPending')} />
						</>
					)}
				</div>
				{isEmailConfirmed.type === 'success' && (
					<div className='mt-2 flex justify-end text-sm font-thin'>
						<Link
							to={`/${AppRoute.SignIn}?email=${encodeURIComponent(email ?? '')}`}
							className='underline transition hover:opacity-70'
						>
							{t('signIn')}
						</Link>
					</div>
				)}
			</section>
		</main>
	)
}
