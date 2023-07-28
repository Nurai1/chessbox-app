import { ReactElement, useState } from 'react'
import { Alert, Button, Input } from 'src/ui'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from 'src/hooks/redux'
import { ReactComponent as ArrowLeft } from 'src/assets/arrow-left.svg'
import { validator } from 'src/helpers/validator'
import { validatorConfigEditUser } from 'src/helpers/validatorConfigEditUser'
import { UserSchema } from 'src/types'
import { editUser } from 'src/store/slices/userSlice'
import { FormData } from 'src/types/formData'
import { AppRoute } from 'src/constants/appRoute'

export const EditProfilePage = (): ReactElement => {
	const [formData, setFormData] = useState<FormData>({})
	const [isFormEmpty, setIsFormEmpty] = useState(false)
	const [validateErrors, setValidateErrors] = useState<Record<string, string>>({})
	const dispatch = useAppDispatch()
	const editRequestPending = useAppSelector(state => state.user.editLoading)
	const editSuccess = useAppSelector(state => state.user.editSuccess)
	const editError = useAppSelector(state => state.user.editError)

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
		const hasValidationErrors = Object.keys(errors).length

		if (hasValidationErrors) {
			setValidateErrors(errors)
		} else {
			setValidateErrors({})
		}

		const hasEmptyStringInputs = !Object.values(formData).filter(value => value.trim() !== '').length

		if (hasEmptyStringInputs) {
			setIsFormEmpty(true)
		} else {
			setIsFormEmpty(false)
		}

		if (!hasValidationErrors && !hasEmptyStringInputs) {
			dispatch(editUser(adaptDataToServer()))
		}
	}

	return (
		<main className='relative flex grow flex-col bg-[#FDFDFD]'>
			<Link
				to={`/${AppRoute.Competitions}`}
				className='absolute left-[17px] top-[25px] flex items-center gap-[18px] transition hover:opacity-70'
			>
				<ArrowLeft className='w-[24px]' />
				<span className='hidden font-medium underline md:inline xl:text-2xl'>Back</span>
			</Link>
			<form className='m-auto max-w-[488px] rounded-[6px] bg-white p-[30px_17px] md:p-[35px_57px]'>
				<h1 className='mb-[23px] text-center text-2xl font-medium'>Edit Profile</h1>
				<div className='grid gap-[18px]'>
					<Input
						onChange={onChange}
						value={formData?.firstName}
						label='First Name'
						name='firstName'
						placeholder='Enter First Name'
						classes='h-[48px]'
					/>
					<Input
						onChange={onChange}
						value={formData?.lastName}
						label='Last Name'
						name='lastName'
						placeholder='Enter Last Name'
						classes='h-[48px]'
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
					<Input
						onChange={onChange}
						value={formData?.fightClub}
						label='Fight club'
						name='fightClub'
						placeholder='Enter Fight Club'
						classes='h-[48px]'
					/>
					<Input
						onChange={onChange}
						value={formData?.country}
						label='Country'
						name='country'
						placeholder='Enter Your country'
						classes='h-[48px]'
					/>
					<Input
						onChange={onChange}
						value={formData?.city}
						label='City'
						name='city'
						placeholder='Enter City'
						classes='h-[48px]'
					/>
					<Input
						onChange={onChange}
						value={formData?.chessPlatformUserName}
						label='`Lichess` Username'
						name='chessPlatformUserName'
						placeholder='Enter `Lichess` Username'
						classes='h-[48px]'
					/>
					<div className='mt-[22px] flex flex-col-reverse flex-wrap justify-between gap-[16px] sm:flex-row sm:items-center'>
						<Link to={`/${AppRoute.ChangePassword}`} className='font-medium underline transition hover:opacity-70'>
							Change Password
						</Link>
						<Button loading={editRequestPending} classes='w-full font-medium sm:w-[160px]' onClick={handleSubmit}>
							Save
						</Button>
					</div>
				</div>
				{editError && <Alert subtitle={editError} classes='mt-[15px]' />}
				{isFormEmpty && <Alert subtitle="Can't send empty form" classes='mt-[15px]' />}
				{editSuccess && !isFormEmpty && <Alert subtitle='Profile updated' type='success' classes='mt-[15px]' />}
			</form>
		</main>
	)
}
