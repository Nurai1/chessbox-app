import { ReactElement, useEffect, useState } from 'react'
import { Input, Select } from 'src/ui'
import { validator } from 'src/helpers/validator'
import { validatorConfigSingUp } from 'src/helpers/validatorConfigSingUp'

type SingInFormData = {
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

type OmitedFormData = Omit<SingInFormData, 'fightClub' | 'country' | 'city' | 'chessPlatformUserName'>

type SingInFormServerData = {
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

const requiredFields = ['firstName', 'lastName', 'weight', 'gender', 'age', 'fightClub', 'country', 'city', 'email', 'chessPlatformUserName', 'password', 'passwordConfirm'];

export const SingUpPage = (): ReactElement => {
    const [formData, setFormData] = useState<SingInFormData>({})
    const [validateErrors, setValidateErrors] = useState<Record<string, Record<string, string>>>({})

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
                        'username': formData[item]
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
                        'name': formData[item]
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
                        [item]: formData[item as keyof SingInFormData]
                    }
            }

            return acc
        }, {} as SingInFormServerData)
    }

    const fillEmptyInputs = () => {
        return requiredFields.reduce((acc, fieldName) => {
            if (!formData[fieldName as keyof SingInFormData] ) {
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
        // fills empty inputs with '' for validation
        if (Object.keys(formData).length !== requiredFields.length) {
            setFormData(fillEmptyInputs())
        }

        if (Object.keys(validateErrors).length === 0) {
            console.log(adaptDataToServer())
        }
    }

    return (
        <main className="flex flex-col grow bg-[#FDFDFD]">
            <form className="bg-white rounded-[6px] p-[30px_17px] mx-auto my-[20px] max-w-[488px] md:p-[35px_57px]">
                <h1 className="mb-[8px] text-2xl text-center">Sign Up</h1>
                <div className="grid gap-[16px]">
                    <Input
                        onChange={onChange}
                        value={formData?.firstName}
                        label="First Name"
                        name="firstName"
                        placeholder="Enter First Name"
                        classes="h-[48px]"
                        validationErrorText={validateErrors?.firstName?.errorMessage}
                    />
                    <Input
                        onChange={onChange}
                        value={formData?.lastName}
                        label="Last Name"
                        name="lastName"
                        placeholder="Enter Last Name"
                        classes="h-[48px]"
                        validationErrorText={validateErrors?.lastName?.errorMessage}
                    />
                    <Input
                        onChange={onChange}
                        value={formData?.weight?.toString()}
                        label="Weight"
                        name="weight"
                        placeholder="Weight"
                        classes="h-[48px]"
                        type="text"
                        validationErrorText={validateErrors?.weight?.errorMessage}
                    />
                    <Select chosenId={formData.gender}
                            onChange={onChange}
                            menuOptions={[{ value: 'Man', id: 'man' }, { value: 'Woman', id: 'woman' }]}
                            label="Gender"
                            placeholder="Select gender"
                            name="gender"
                            validationErrorText={validateErrors?.gender?.errorMessage}
                    />
                    <Input
                        onChange={onChange}
                        value={formData?.age?.toString()}
                        label="Age"
                        name="age"
                        placeholder="Age"
                        classes="h-[48px]"
                        type="number"
                        validationErrorText={validateErrors?.age?.errorMessage}
                    />
                    <Input
                        onChange={onChange}
                        value={formData?.fightClub}
                        label="Fight club"
                        name="fightClub"
                        placeholder="Enter Fight Club"
                        classes="h-[48px]"
                        validationErrorText={validateErrors?.fightClub?.errorMessage}
                    />
                    <Input
                        onChange={onChange}
                        value={formData?.country}
                        label="Country"
                        name="country"
                        placeholder="Enter Your country"
                        classes="h-[48px]"
                        validationErrorText={validateErrors?.country?.errorMessage}
                    />
                    <Input
                        onChange={onChange}
                        value={formData?.city}
                        label="City"
                        name="city"
                        placeholder="Enter City"
                        classes="h-[48px]"
                        validationErrorText={validateErrors?.city?.errorMessage}
                    />
                    <Input
                        onChange={onChange}
                        value={formData?.email}
                        label="Email"
                        name="email"
                        placeholder="Inter Email"
                        classes="h-[48px]"
                        validationErrorText={validateErrors?.email?.errorMessage}
                    />
                    <Input
                        onChange={onChange}
                        value={formData?.chessPlatformUserName}
                        label="`Lichess` Username"
                        name="chessPlatformUserName"
                        placeholder="Inter `Lichess` Username"
                        classes="h-[48px]"
                        validationErrorText={validateErrors?.chessPlatformUserName?.errorMessage}
                    />
                    <Input
                        onChange={onChange}
                        value={formData?.password}
                        label="Password"
                        name="password"
                        placeholder="Enter Password"
                        classes="h-[48px]"
                        type="password"
                        validationErrorText={validateErrors?.password?.errorMessage}
                    />
                    <Input
                        onChange={onChange}
                        value={formData?.passwordConfirm}
                        label="Repeat Password"
                        name="passwordConfirm"
                        placeholder="Enter Password"
                        classes="h-[48px]"
                        type="password"
                        validationErrorText={validateErrors?.passwordConfirm?.errorMessage}
                    />
                    <button onClick={handleSubmit}
                            className="font-medium underline ml-auto mt-[6px] hover:opacity-70 transition md:mr-[-20px]"
                            type="button">Sign Up
                    </button>
                </div>
            </form>
        </main>
    )
}
