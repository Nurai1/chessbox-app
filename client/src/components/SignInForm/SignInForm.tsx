import { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'
import { validator } from 'src/helpers/validation/validator'
import { useValidatorConfigSingIn } from 'src/helpers/validation/validatorConfigSingIn'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { signInUser } from 'src/store/slices/userSlice'
import { SignInDataSchema } from 'src/types'
import { FormData } from 'src/types/formData'
import { Alert, Button, Input } from 'src/ui'
import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'

export const SignInForm = (): ReactElement => {
	const { t } = useOptionalTranslation()
	const validatorConfigSingIn = useValidatorConfigSingIn()
	const [formData, setFormData] = useState<FormData>({
		email: '',
		password: ''
	})
	const [showPassword, setShowPassword] = useState(false)
	const [validateErrors, setValidateErrors] = useState<Record<string, string>>({})
	const dispatch = useAppDispatch()
	const isAuthRequestPending = useAppSelector(state => state.user.authLoading)
	const authError = useAppSelector(state => state.user.authError)

	const onChange = (value?: string, name?: string) => {
		setFormData({
			...formData,
			[name as string]: value as string
		})
	}

	const handleSubmit = () => {
		const errors = validator(formData, validatorConfigSingIn)

		if (Object.keys(errors).length) {
			setValidateErrors(errors)
		} else {
			setValidateErrors({})
			dispatch(signInUser(formData as SignInDataSchema))
		}
	}

	return (
		<main className='flex grow flex-col bg-pale-white py-[20px]'>
			<form className='m-auto max-w-[488px] rounded-[6px] bg-white p-[30px_17px] md:p-[35px_57px]'>
				<h1 className='mb-[8px] text-center text-heading-4'>Sign In</h1>
				<div className='grid w-full gap-[18px]'>
					<Input
						onChange={onChange}
						value={formData?.email}
						label={t('email')}
						name='email'
						placeholder={t('email')}
						classes='h-[48px]'
						validationErrorText={validateErrors?.email}
					/>
					<Input
						onChange={onChange}
						value={formData?.password}
						label={t('password')}
						name='password'
						placeholder={t('password')}
						classes='h-[48px]'
						type={showPassword ? 'text' : 'password'}
						validationErrorText={validateErrors?.password}
						onShowPassword={() => setShowPassword(!showPassword)}
						showPasswordIcon
					/>
					<Button loading={isAuthRequestPending} classes='font-medium w-full mt-[10px]' onClick={handleSubmit}>
						{t('signIn')}
					</Button>
				</div>
				<div className='mt-2 flex justify-between text-sm font-thin'>
					<Link to={`/${AppRoute.SignUp}`} className='underline transition hover:opacity-70'>
						{t('signUp')}
					</Link>
					<Link
						to={`/${AppRoute.ForgotPassword}`}
						className='h-auto p-0 text-sm font-thin underline transition hover:opacity-70'
					>
						{t('forgotPassword')}
					</Link>
				</div>
				{authError && (
					<div className='mt-2'>
						<Alert subtitle={authError} />
					</div>
				)}
			</form>
		</main>
	)
}
