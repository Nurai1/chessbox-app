import { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Select, Button, Alert } from 'src/ui'
import { validator } from 'src/helpers/validator'
import { validatorConfigSingUp } from 'src/helpers/validatorConfigSingUp'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { signUpUser } from 'src/store/slices/userSlice'
import { AppRoute } from 'src/constants/appRoute'
import { SignUpDataSchema } from 'src/types'
import { FormData } from 'src/types/formData'

export const SignUpForm = (): ReactElement => {
	const [formData, setFormData] = useState<FormData>({
		firstName: '',
		lastName: '',
		weight: '',
		gender: '',
		age: '',
		fightClub: '',
		country: '',
		city: '',
		email: '',
		chessPlatformUserName: '',
		password: '',
		passwordConfirm: ''
	})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

	const adaptDataToServer = () => {
		return Object.keys(formData).reduce((acc, item) => {
			switch (item) {
				case 'chessPlatformUserName':
					acc.chessPlatform = {
						username: formData[item] ?? ''
					}
					break
				case 'city':
				case 'country':
					acc.address = {
						...acc.address,
						[item]: formData[item]
					}
					break
				case 'fightClub':
					acc.fightClub = {
						name: formData[item] ?? ''
					}
					break
				case 'age':
				case 'weight':
					return {
						...acc,
						[item]: Number(formData[item])
					}
				case 'passwordConfirm':
					break
				default:
					return {
						...acc,
						[item]: formData[item as keyof FormData]
					}
			}

			return acc
		}, {} as SignUpDataSchema)
	}

	const handleSubmit = () => {
		const errors = validator(formData, validatorConfigSingUp)

		if (Object.keys(errors).length) {
			setValidateErrors(errors)
		} else {
			setValidateErrors({})
			dispatch(signUpUser(adaptDataToServer()))
		}
	}

	return (
		<main className='lex grow flex-col bg-[#FDFDFD] py-[20px]'>
			<form className='m-auto max-w-[488px] rounded-[6px] bg-white p-[30px_17px] md:p-[35px_57px]'>
				<h1 className='mb-[8px] text-center text-2xl font-medium'>Sign Up</h1>
				<div className='grid gap-[18px]'>
					<Input
						onChange={onChange}
						value={formData?.firstName}
						label='First Name'
						name='firstName'
						placeholder='Enter First Name'
						classes='h-[48px]'
						validationErrorText={validateErrors?.firstName}
					/>
					<Input
						onChange={onChange}
						value={formData?.lastName}
						label='Last Name'
						name='lastName'
						placeholder='Enter Last Name'
						classes='h-[48px]'
						validationErrorText={validateErrors?.lastName}
					/>
					<Input
						onChange={onChange}
						value={formData?.weight?.toString()}
						label='Weight'
						name='weight'
						placeholder='Weight'
						classes='h-[48px]'
						type='number'
						validationErrorText={validateErrors?.weight}
					/>
					<Select
						chosenId={formData.gender}
						onChange={onChange}
						menuOptions={[
							{ value: 'Man', id: 'man' },
							{ value: 'Woman', id: 'woman' }
						]}
						label='Gender'
						placeholder='Select gender'
						name='gender'
						validationErrorText={validateErrors?.gender}
					/>
					<Input
						onChange={onChange}
						value={formData?.age?.toString()}
						label='Age'
						name='age'
						placeholder='Age'
						classes='h-[48px]'
						type='number'
						validationErrorText={validateErrors?.age}
					/>
					<Input
						onChange={onChange}
						value={formData?.fightClub}
						label='Fight club'
						name='fightClub'
						placeholder='Enter Fight Club'
						classes='h-[48px]'
						validationErrorText={validateErrors?.fightClub}
					/>
					<Input
						onChange={onChange}
						value={formData?.country}
						label='Country'
						name='country'
						placeholder='Enter Your country'
						classes='h-[48px]'
						validationErrorText={validateErrors?.country}
					/>
					<Input
						onChange={onChange}
						value={formData?.city}
						label='City'
						name='city'
						placeholder='Enter City'
						classes='h-[48px]'
						validationErrorText={validateErrors?.city}
					/>
					<Input
						onChange={onChange}
						value={formData?.email}
						label='Email'
						name='email'
						placeholder='Enter Email'
						classes='h-[48px]'
						validationErrorText={validateErrors?.email}
					/>
					<Input
						onChange={onChange}
						value={formData?.chessPlatformUserName}
						label='`Lichess` Username'
						name='chessPlatformUserName'
						placeholder='Enter `Lichess` Username'
						classes='h-[48px]'
						validationErrorText={validateErrors?.chessPlatformUserName}
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
					<Input
						onChange={onChange}
						value={formData?.passwordConfirm}
						label='Repeat Password'
						name='passwordConfirm'
						placeholder='Repeat Password'
						classes='h-[48px]'
						type={showConfirmPassword ? 'text' : 'password'}
						validationErrorText={validateErrors?.passwordConfirm}
						onShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
						showPasswordIcon
					/>
					<Button loading={isAuthRequestPending} classes='font-medium w-full mt-[10px]' onClick={handleSubmit}>
						Sign Up
					</Button>
				</div>
				<p className='mt-2 text-sm font-thin'>
					Already have an account?{' '}
					<Link to={`/${AppRoute.SignIn}`} className='underline transition hover:opacity-70'>
						Sign In
					</Link>
				</p>
				{authError && (
					<div className='mt-2'>
						<Alert subtitle={authError} />
					</div>
				)}
			</form>
		</main>
	)
}
