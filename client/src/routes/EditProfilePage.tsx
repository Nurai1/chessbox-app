import { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from 'src/assets/arrow-left.svg'
import { validator } from 'src/helpers/validation/validator'
import { useValidatorConfigEditUser } from 'src/helpers/validation/validatorConfigEditUser'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { editUser, forgotPassword } from 'src/store/slices/userSlice'
import { UserSchema } from 'src/types'
import { Alert, Button, Input } from 'src/ui'
// import { editUser, forgotPassword } from 'src/store/slices/userSlice'
import { AppRoute } from 'src/constants/appRoute'
import { getFormattedDate } from 'src/helpers/datetime'
import { FormData } from 'src/types/formData'
import { useOptionalTranslation } from '../hooks/useOptionalTranslation'

export const EditProfilePage = (): ReactElement => {
	const { t } = useOptionalTranslation()
	const validatorConfigEditUser = useValidatorConfigEditUser()
	const [validateErrors, setValidateErrors] = useState<Record<string, string>>({})
	const dispatch = useAppDispatch()
	const { authorizedUser, editSuccess, editError, isPasswordLinkSent, editLoading, authLoading } = useAppSelector(
		state => state.user
	)

	const [formData, setFormData] = useState<FormData>({
		firstName: authorizedUser?.firstName,
		lastName: authorizedUser?.lastName,
		weight: authorizedUser?.weight?.toString(),
		fightClub: authorizedUser?.fightClub?.name,
		country: authorizedUser?.address?.country,
		city: authorizedUser?.address?.city,
		chessPlatformUserName: authorizedUser?.chessPlatform?.username,
		birthDate: authorizedUser?.birthDate,
		email: authorizedUser?.email
	})

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
				case 'weight':
					if (!formData[item]) return { ...acc }
					return {
						...acc,
						[item]: Number(formData[item])
					}
				default:
					return {
						...acc,
						[item]: formData[item as keyof FormData]
					}
			}

			return acc
		}, {} as UserSchema)
	}

	const handleSubmit = () => {
		const errors = validator(formData, validatorConfigEditUser)

		if (Object.keys(errors).length) {
			setValidateErrors(errors)
		} else {
			setValidateErrors({})
			dispatch(editUser(adaptDataToServer()))
		}
	}

	return (
		<main className='flex grow flex-col bg-pale-white'>
			<div className='container  relative m-auto flex  grow flex-col'>
				<Link
					to={`/${AppRoute.Competitions}`}
					className='absolute left-[17px] top-[25px] flex items-center gap-[18px] transition hover:opacity-70'
				>
					<ArrowLeft className='w-6 lg:w-8' />
				</Link>
				<form className='m-auto max-w-[488px] rounded-[6px] bg-white p-[30px_17px] md:p-[35px_57px]'>
					<h1 className='mb-[23px] text-center text-heading-4'>{t('editProfile')}</h1>
					<div className='grid gap-[18px]'>
						<Input
							onChange={onChange}
							value={formData?.email}
							label={t('email')}
							name='email'
							placeholder={t('email')}
							classes='h-[48px]'
							disabled
						/>
						<Input
							onChange={onChange}
							value={formData?.firstName}
							label={t('firstName')}
							name='firstName'
							placeholder={t('firstName')}
							classes='h-[48px]'
							validationErrorText={validateErrors?.firstName}
						/>
						<Input
							onChange={onChange}
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
						<Input
							onChange={onChange}
							value={formData?.birthDate && getFormattedDate(formData?.birthDate, 'DD.MM.YYYY')}
							label={t('birthday')}
							name='birthDate'
							placeholder='DD.MM.YYYY'
							classes='h-[48px]'
							disabled
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
						<div className='mt-[22px] flex flex-col-reverse flex-wrap justify-between gap-[16px] sm:flex-row sm:items-center'>
							<button
								type='button'
								className='flex items-center font-medium underline transition hover:opacity-70'
								onClick={() => {
									if (authorizedUser?.email) dispatch(forgotPassword({ email: authorizedUser?.email }))
								}}
							>
								{t('changePassword')}
								{authLoading && (
									<span className=' ml-2 inline-block h-5 w-5 animate-spin rounded-full border-[4px] border-black border-b-transparent' />
								)}
							</button>
							<Button loading={editLoading} classes='w-full font-medium sm:w-[160px]' onClick={handleSubmit}>
								{t('save')}
							</Button>
						</div>
					</div>
					{editError && <Alert subtitle={editError} classes='mt-4' />}
					{isPasswordLinkSent && (
						<Alert
							type='success'
							subtitle='Link to your email for changing password was sent. Link active 5 minutes.'
							classes='mt-4'
						/>
					)}
					{editSuccess && <Alert subtitle={t('profileUpdated')} type='success' classes='mt-4' />}
				</form>
			</div>
		</main>
	)
}
