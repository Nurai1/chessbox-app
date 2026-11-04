import { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'
import { omit } from 'remeda'
import { createCoachParticipantApi } from 'src/api/requests/coach'
import { AppRoute } from 'src/constants/appRoute'
import { validator } from 'src/helpers/validation/validator'
import { useValidatorConfigSingUp } from 'src/helpers/validation/validatorConfigSingUp'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { signUpUser } from 'src/store/slices/userSlice'
import { SignUpDataSchema, UserSchema } from 'src/types'
import { FormData } from 'src/types/formData'
import { Alert, Button, Input, Select } from 'src/ui'
import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'

type SignUpFormProps = {
	onCreateParticipant?: (participant: UserSchema) => void
}

export const SignUpForm = ({ onCreateParticipant }: SignUpFormProps): ReactElement => {
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
	const [createLoading, setCreateLoading] = useState(false)
	const [createError, setCreateError] = useState<string>()
	const isCoachCreation = Boolean(onCreateParticipant)
	const Container = isCoachCreation ? 'div' : 'main'

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

	const handleSubmit = async () => {
		if (createLoading || (!isCoachCreation && authLoading)) return
		const errors = validator(formData, validatorConfigSingUp)

		if (Object.keys(errors).length) {
			setValidateErrors(errors)
		} else {
			setValidateErrors({})
			if (!onCreateParticipant) {
				dispatch(signUpUser(adaptDataToServer()))
				return
			}
			setCreateLoading(true)
			setCreateError(undefined)
			try {
				const response = await createCoachParticipantApi(adaptDataToServer())
				if (response.error || !response.data) {
					setCreateError(response.error?.error || t('coachRequestFailed'))
				} else {
					onCreateParticipant(response.data)
				}
			} catch {
				setCreateError(t('coachRequestFailed'))
			} finally {
				setCreateLoading(false)
			}
		}
	}

	return (
		<Container className='flex grow flex-col bg-pale-white py-[20px]'>
			<form
				className='m-auto max-w-[488px] rounded-[6px] bg-white p-[30px_17px] md:p-[35px_57px]'
				onSubmit={event => {
					event.preventDefault()
					handleSubmit()
				}}
			>
				<h1 className='mb-[8px] text-center text-heading-4'>{t(isCoachCreation ? 'coachCreateStudent' : 'signUp')}</h1>
				{isCoachCreation && <p className='mb-5 text-sm text-grey'>{t('coachCreateStudentHelp')}</p>}
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
					<Button
						loading={isCoachCreation ? createLoading : authLoading}
						classes='font-medium w-full mt-[10px]'
						onClick={handleSubmit}
					>
						{t(isCoachCreation ? 'coachCreateStudent' : 'signUp')}
					</Button>
				</div>
				{!isCoachCreation && (
					<p className='mt-2 text-sm font-thin'>
						{t('haveAccount')}?{' '}
						<Link to={`/${AppRoute.SignIn}`} className='underline transition hover:opacity-70'>
							{t('signIn')}
						</Link>
					</p>
				)}
				{!isCoachCreation && needCheckEmail && (
					<div className='mt-2'>
						<Alert type='info' subtitle={t('checkEmailConfirm')} />
					</div>
				)}
				{(isCoachCreation ? createError : authError) && (
					<div className='mt-2'>
						<Alert subtitle={isCoachCreation ? createError : authError} />
					</div>
				)}
			</form>
		</Container>
	)
}
