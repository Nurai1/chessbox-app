import { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'
import { validator } from 'src/helpers/validation/validator'
import { useValidatorConfigSingIn } from 'src/helpers/validation/validatorConfigSingIn'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { forgotPassword } from 'src/store/slices/userSlice'
import { Alert, Button, Input } from 'src/ui'
import { pick } from 'remeda'
import { useOptionalTranslation } from '../hooks/useOptionalTranslation'

export const ForgotPasswordPage = (): ReactElement => {
	const { t } = useOptionalTranslation()
	const validatorConfigSingIn = useValidatorConfigSingIn()
	const validatorConfigForgotPassword = pick(validatorConfigSingIn, ['email'])
	const [formData, setFormData] = useState({
		email: ''
	})
	const [validateErrors, setValidateErrors] = useState<Record<string, string>>({})
	const dispatch = useAppDispatch()
	const { passwordError, isPasswordLinkSent, authLoading } = useAppSelector(state => state.user)

	const onChange = (value?: string, name?: string) => {
		setFormData({
			...formData,
			[name as string]: value as string
		})
	}

	const handleSubmit = () => {
		const errors = validator(formData, validatorConfigForgotPassword)

		if (Object.keys(errors).length) {
			setValidateErrors(errors)
		} else {
			setValidateErrors({})
			const body = {
				email: formData.email
			}
			dispatch(forgotPassword(body))
		}
	}

	return (
		<main className='flex grow flex-col bg-pale-white py-[20px]'>
			<form className='m-auto max-w-[488px] rounded-[6px] bg-white p-[30px_17px] md:p-[35px_57px]'>
				<h1 className='mb-[8px] text-center text-heading-4'>{t('forgotPassword')}</h1>
				<div className='flex flex-col items-center gap-[18px]'>
					<Input
						onChange={onChange}
						value={formData?.email}
						label={t('email')}
						name='email'
						placeholder={t('email')}
						classes='h-[48px]'
						type='text'
						validationErrorText={validateErrors?.email}
					/>
					<Button loading={authLoading} classes='font-medium w-full mt-[10px]' onClick={handleSubmit}>
						{t('sendLink')}
					</Button>
				</div>
				<div className='mt-2 flex justify-end text-sm font-thin'>
					<Link to={`/${AppRoute.SignIn}`} className='underline transition hover:opacity-70'>
						{t('signIn')}
					</Link>
				</div>
				{isPasswordLinkSent && (
					<div className='mt-2'>
						<Alert type='success' subtitle={t('linkActive')} />
					</div>
				)}
				{passwordError && !isPasswordLinkSent && (
					<div className='mt-2'>
						<Alert subtitle={passwordError} />
					</div>
				)}
			</form>
		</main>
	)
}
