import { ReactElement, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'
import { validator } from 'src/helpers/validator'
import { validatorConfigChangePassword } from 'src/helpers/validatorConfigChangePassword'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { changePassword } from 'src/store/slices/userSlice'
import { Alert, Button, Input } from 'src/ui'

export const ChangePasswordPage = (): ReactElement => {
	// eslint-disable-next-line no-restricted-globals
	const urlParams = useMemo(() => new URLSearchParams(location.search), [])
	const [formData, setFormData] = useState({
		newPassword: '',
		passwordConfirm: ''
	})
	const [showPassword, setShowPassword] = useState(false)
	const [validateErrors, setValidateErrors] = useState<Record<string, string>>({})
	const dispatch = useAppDispatch()
	const isAuthRequestPending = useAppSelector(state => state.user.authLoading)
	const passwordError = useAppSelector(state => state.user.passwordError)
	const passwordChanged = useAppSelector(state => state.user.passwordChanged)

	const onChange = (value?: string, name?: string) => {
		setFormData({
			...formData,
			[name as string]: value as string
		})
	}

	const handleSubmit = () => {
		const errors = validator(formData, validatorConfigChangePassword)

		if (Object.keys(errors).length) {
			setValidateErrors(errors)
		} else {
			setValidateErrors({})
			const body = {
				newPassword: formData.newPassword,
				email: decodeURIComponent(urlParams.get('email') as string),
				passwordResetCode: Number(urlParams.get('passwordResetCode'))
			}
			dispatch(changePassword(body))
		}
	}

	return (
		<main className='flex grow flex-col bg-[#FDFDFD] py-[20px]'>
			<form className='m-auto max-w-[488px] rounded-[6px] bg-white p-[30px_17px] md:p-[35px_57px]'>
				<h1 className='mb-[8px] text-center text-2xl font-medium'>Change Password</h1>
				<div className='flex flex-col items-center gap-[18px]'>
					<span className='font-medium'>Account Email: {decodeURIComponent(urlParams.get('email') as string)}</span>
					<Input
						onChange={onChange}
						value={formData?.newPassword}
						label='Password'
						name='newPassword'
						placeholder='Enter Password'
						classes='h-[48px]'
						type={showPassword ? 'text' : 'password'}
						validationErrorText={validateErrors?.newPassword}
						onShowPassword={() => setShowPassword(!showPassword)}
						showPasswordIcon
					/>
					<Input
						onChange={onChange}
						value={formData?.passwordConfirm}
						label='Confirm Password'
						name='passwordConfirm'
						placeholder='Enter Password'
						classes='h-[48px]'
						type={showPassword ? 'text' : 'password'}
						validationErrorText={validateErrors?.passwordConfirm}
						onShowPassword={() => setShowPassword(!showPassword)}
						showPasswordIcon
					/>
					<Button loading={isAuthRequestPending} classes='font-medium w-full mt-[10px]' onClick={handleSubmit}>
						Change Password
					</Button>
				</div>
				<div className='mt-2 flex justify-end text-sm font-thin'>
					<Link to={`/${AppRoute.SignIn}`} className='underline transition hover:opacity-70'>
						Sign In
					</Link>
				</div>
				{passwordChanged && (
					<div className='mt-2'>
						<Alert type='success' subtitle='Your password has been changed.' />
					</div>
				)}
				{passwordError && (
					<div className='mt-2'>
						<Alert subtitle={passwordError} />
					</div>
				)}
			</form>
		</main>
	)
}
