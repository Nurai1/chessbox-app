import { ReactElement, useEffect, useState } from 'react'
import { Input, Select, Button } from 'src/ui'
import { validator } from 'src/helpers/validator'
import { validatorConfigSingUp } from 'src/helpers/validatorConfigSingUp'

type SingUpFormData = {
	firstName?: string
	lastName?: string
	weight?: string
	gender?: string
	age?: string
	fightClub?: string
	country?: string
	city?: string
	email?: string
	chessPlatformUserName?: string
	password?: string
	passwordConfirm?: string
}

type OmitedFormData = Omit<SingUpFormData, 'fightClub' | 'country' | 'city' | 'chessPlatformUserName'>

type SingUpFormServerData = {
	chessPlatform: {
		username?: string
	}
	address: {
		country: string
		city: string
	}
	fightClub: {
		name?: string
	}
} & OmitedFormData

const requiredFields = [
	'firstName',
	'lastName',
	'weight',
	'gender',
	'age',
	'fightClub',
	'country',
	'city',
	'email',
	'chessPlatformUserName',
	'password',
	'passwordConfirm'
]

export const SignUpPage = (): ReactElement => {
	const [formData, setFormData] = useState<SingUpFormData>({})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [validateErrors, setValidateErrors] = useState<Record<string, string>>({})

	const onChange = (value?: string, name?: string) => {
		setFormData({
			...formData,
			[name as string]: value as string
		})
	}

	useEffect(() => {
		setValidateErrors(validator(formData, validatorConfigSingUp))
	}, [formData])

	const adaptDataToServer = () => {
		return Object.keys(formData).reduce((acc, item) => {
			switch (item) {
				case 'chessPlatformUserName':
					acc.chessPlatform = {
						username: formData[item]
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
						name: formData[item]
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
						[item]: formData[item as keyof SingUpFormData]
					}
			}

			return acc
		}, {} as SingUpFormServerData)
	}

	const fillEmptyInputs = () => {
		return requiredFields.reduce((acc, fieldName) => {
			if (!formData[fieldName as keyof SingUpFormData]) {
				return {
					...acc,
					[fieldName]: ''
				}
			}
			return {
				...acc,
				[fieldName]: formData[fieldName as keyof SingUpFormData]
			}
		}, {})
	}

	const handleSubmit = () => {
		if (Object.keys(formData).length !== requiredFields.length) {
			setFormData(fillEmptyInputs())
		}

		if (Object.keys(validateErrors).length === 0) {
			// submit
			adaptDataToServer()
		}
	}

	return (
		<main className='lex grow flex-col bg-[#FDFDFD] py-[20px]'>
			<form className='m-auto max-w-[488px] rounded-[6px] bg-white p-[30px_17px] md:p-[35px_57px]'>
				<h1 className='mb-[8px] text-center text-2xl font-medium'>Sign Up</h1>
				<div className='grid gap-[16px]'>
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
						type='text'
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
						placeholder='Inter Email'
						classes='h-[48px]'
						validationErrorText={validateErrors?.email}
					/>
					<Input
						onChange={onChange}
						value={formData?.chessPlatformUserName}
						label='`Lichess` Username'
						name='chessPlatformUserName'
						placeholder='Inter `Lichess` Username'
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
					<Button type='ghost' classes='font-medium underline ml-auto mr-[-40px]' onClick={handleSubmit}>
						Sign Up
					</Button>
				</div>
			</form>
		</main>
	)
}
