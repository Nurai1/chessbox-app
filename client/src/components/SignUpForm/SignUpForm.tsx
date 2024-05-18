import { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'
import { omit } from 'remeda'
import { AppRoute } from 'src/constants/appRoute'
import { validator } from 'src/helpers/validation/validator'
import { useValidatorConfigSingUp } from 'src/helpers/validation/validatorConfigSingUp'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { signUpUser } from 'src/store/slices/userSlice'
import { SignUpDataSchema } from 'src/types'
import { FormData } from 'src/types/formData'
import { Alert, Button, Input, Select } from 'src/ui'
import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'

export const SignUpForm = (): ReactElement => {
	const { t } = useOptionalTranslation()
	const validatorConfigSingUp = useValidatorConfigSingUp()

	const [formData, setFormData] = useState<FormData>({
		firstName: '',
		lastName: '',
		weight: '',
		gender: '',
		birthDate: '',
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
	const { authError, authLoading, needCheckEmail } = useAppSelector(state => state.user)

	const onChange = (value?: string, name?: string) => {
		setFormData({
			...formData,
			[name as string]: value as string
		})
	}

	const onMomentValidationChange = (value?: string, name?: string) => {
		onChange(value, name)

		if (name && value) {
			const errors = validator({ [name]: value }, validatorConfigSingUp)

			if (Object.keys(errors).length) {
				setValidateErrors({ ...validateErrors, [name]: errors[name] })
			} else {
				setValidateErrors(omit(validateErrors, [name]))
			}
		}
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
				case 'weight':
					return {
						...acc,
						[item]: Number(formData[item])
					}
				case 'birthDate':
					return {
						...acc,
						[item]: `${formData[item]?.split('.').reverse().join('-')}Z`
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
		<main className='lex grow flex-col bg-pale-white py-[20px]'>
			<form className='m-auto max-w-[488px] rounded-[6px] bg-white p-[30px_17px] md:p-[35px_57px]'>
				<h1 className='mb-[8px] text-center text-heading-4'>{t('signUp')}</h1>
				<div className='grid gap-[18px]'>
					<Input
						onChange={onMomentValidationChange}
						value={formData?.email}
						label={t('email')}
						name='email'
						placeholder={t('email')}
						classes='h-[48px]'
						validationErrorText={validateErrors?.email}
					/>
					<Input
						onChange={onMomentValidationChange}
						value={formData?.firstName}
						label={t('firstName')}
						name='firstName'
						placeholder={t('firstName')}
						classes='h-[48px]'
						validationErrorText={validateErrors?.firstName}
					/>
					<Input
						onChange={onMomentValidationChange}
						value={formData?.lastName}
						label={t('lastName')}
						name='lastName'
						placeholder={t('lastName')}
						classes='h-[48px]'
						validationErrorText={validateErrors?.lastName}
					/>
					<Input
						onChange={onChange}
						value={formData?.weight?.toString()}
						label={t('weight')}
						name='weight'
						placeholder={t('weight')}
						classes='h-[48px]'
						type='number'
						validationErrorText={validateErrors?.weight}
					/>
					<Select
						chosenId={formData.gender}
						onChange={onChange}
						menuOptions={[
							{ value: t('man'), id: 'man' },
							{ value: t('woman'), id: 'woman' }
						]}
						label={t('gender')}
						placeholder='Select gender'
						name='gender'
						validationErrorText={validateErrors?.gender}
						dropdownPlaceholder='Select gender'
					/>
					<Input
						onChange={onChange}
						value={formData?.birthDate?.toString()}
						label={t('birthday')}
						name='birthDate'
						placeholder='DD.MM.YYYY'
						classes='h-[48px]'
						validationErrorText={validateErrors?.birthDate}
					/>
					<Input
						onChange={onChange}
						value={formData?.fightClub}
						label={t('fightClub')}
						name='fightClub'
						placeholder='Fight Club'
						classes='h-[48px]'
						validationErrorText={validateErrors?.fightClub}
					/>
					<Input
						onChange={onChange}
						value={formData?.country}
						label={t('country')}
						name='country'
						placeholder='Your country'
						classes='h-[48px]'
						validationErrorText={validateErrors?.country}
					/>
					<Input
						onChange={onChange}
						value={formData?.city}
						label={t('city')}
						name='city'
						placeholder={t('city')}
						classes='h-[48px]'
						validationErrorText={validateErrors?.city}
					/>
					<Input
						onChange={onChange}
						value={formData?.chessPlatformUserName}
						label={`'Lichess' ${t('username')}`}
						name='chessPlatformUserName'
						placeholder={`'Lichess' ${t('username')}`}
						classes='h-[48px]'
						validationErrorText={validateErrors?.chessPlatformUserName}
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
					<Input
						onChange={onChange}
						value={formData?.passwordConfirm}
						label={t('repeatPassword')}
						name='passwordConfirm'
						placeholder={t('repeatPassword')}
						classes='h-[48px]'
						type={showConfirmPassword ? 'text' : 'password'}
						validationErrorText={validateErrors?.passwordConfirm}
						onShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
						showPasswordIcon
					/>
					{!!Object.keys(validateErrors).length && (
						<div className='mt-2'>
							<Alert subtitle={t('validationErrorsAll')} />
						</div>
					)}
					<Button loading={authLoading} classes='font-medium w-full mt-[10px]' onClick={handleSubmit}>
						{t('signUp')}
					</Button>
				</div>
				<p className='mt-2 text-sm font-thin'>
					{t('haveAccount')}?{' '}
					<Link to={`/${AppRoute.SignIn}`} className='underline transition hover:opacity-70'>
						{t('signIn')}
					</Link>
				</p>
				{needCheckEmail && (
					<div className='mt-2'>
						<Alert type='info' subtitle={t('checkEmailConfirm')} />
					</div>
				)}
				{authError && (
					<div className='mt-2'>
						<Alert subtitle={authError} />
					</div>
				)}
			</form>
		</main>
	)
}
