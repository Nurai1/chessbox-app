import { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { Input, Button } from 'src/ui'
import { validator } from 'src/helpers/validator'
import { validatorConfigSingIn } from 'src/helpers/validatorConfigSingIn'
import { signInUser } from 'src/store/slices/userSlice'
import { Link } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'

type SingInFormData = {
	email?: string
	password?: string
}

export type SignInFormServerData = {
	email: string
	password: string
}

const requiredFields = ['email', 'password']

export const SignInForm = (): ReactElement => {
	const [formData, setFormData] = useState<SingInFormData>({})
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

	useEffect(() => {
		setValidateErrors(validator(formData, validatorConfigSingIn))
	}, [formData])

	const fillEmptyInputs = () => {
		return requiredFields.reduce((acc, fieldName) => {
			if (!formData[fieldName as keyof SingInFormData]) {
				return {
					...acc,
					[fieldName]: ''
				}
			}
			return {
				...acc,
				[fieldName]: formData[fieldName as keyof SingInFormData]
			}
		}, {})
	}

	const handleSubmit = () => {
		if (Object.keys(formData).length !== requiredFields.length) {
			setFormData(fillEmptyInputs())
			return
		}

		if (Object.keys(validateErrors).length === 0) {
			dispatch(signInUser(formData as SignInFormServerData))
		}
	}

	return (
		<main className='flex grow flex-col bg-[#FDFDFD] py-[20px]'>
			<form className='m-auto max-w-[488px] rounded-[6px] bg-white p-[30px_17px] md:p-[35px_57px]'>
				<h1 className='mb-[8px] text-center text-2xl font-medium'>Sign In</h1>
				<div className='grid gap-[16px]'>
					<Input
						onChange={onChange}
						value={formData?.email}
						label='Email'
						name='email'
						placeholder='Inter Email'
						classes='h-[48px]'
						validationErrorText={validateErrors?.email}
					/>
					<Input
						onChange={onChange}
						value={formData?.password}
						label='Password'
						name='password'
						placeholder='Enter Password'
						classes='h-[48px]'
						type={showPassword ? 'text' : 'password'}
						validationErrorText={validateErrors?.password}
						onShowPassword={() => setShowPassword(!showPassword)}
						showPasswordIcon
					/>
					<div className='mr-[-40px] flex justify-end'>
						<Button type='ghost' loading={isAuthRequestPending} classes='font-medium underline' onClick={handleSubmit}>
							Sign In
						</Button>
						<Button type='ghost' classes='font-medium underline ' onClick={() => ''}>
							Forgot Password
						</Button>
					</div>
				</div>
				<p className='mt-2 text-sm font-thin'>
					Already have account?{' '}
					<Link to={`/${AppRoute.SignUp}`} className='underline transition hover:opacity-70'>
						Sign Up
					</Link>
				</p>
				{authError && <p className='mt-2 text-red-400'>{authError}</p>}
			</form>
		</main>
	)
}
