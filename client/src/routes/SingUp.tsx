import { ReactElement, useState } from 'react'
import { Input, Select } from 'src/ui'

const menuOptions = [{value: 'Man', id: 'man'}, {value: 'Woman', id: 'woman'}]

export const SingUpPage = (): ReactElement => {
    const [chosenId, setChosenId] = useState<string>()
    const onChange = () =>  {}
    return (
        <div className='flex flex-col grow bg-[#FDFDFD]'>
            <form className='bg-white rounded-[6px] p-[30px_17px] mx-auto max-w-[488px] md:p-[35px_57px]'>
                <h1 className='mb-[8px] text-2xl text-center'>Sign Up</h1>
                <div className='grid gap-[12px]'>
                    <Input onChange={onChange} label='First Name' name='firstName' placeholder='Enter First Name'/>
                    <Input onChange={onChange} label='Last Name' name='lastName' placeholder='Enter Last Name'/>
                    <Input onChange={onChange} label='Weight' name='weight' placeholder='Weight'/>

                    <Select chosenId={chosenId}
                            onChange={id => setChosenId(id)}
                            menuOptions={[{value: 'Man', id: 'man'}, {value: 'Woman', id: 'woman'}]}
                            label='Gender'
                            placeholder='Select gender'
                    />

                    <Input onChange={onChange} label='Age' name='age' placeholder='Age'/>
                    <Input onChange={onChange} label='Fight club' name='аightСlub' placeholder='Enter Fight club'/>
                    <Input onChange={onChange} label='Country' name='сountry' placeholder='Enter Your country'/>
                    <Input onChange={onChange} label='City' name='сity' placeholder='Enter City'/>
                    <Input onChange={onChange} label='Email' name='email' placeholder='Inter Email'/>
                    <Input onChange={onChange} label='`Lichess` Username' name='lichessUsername' placeholder='Inter `Lichess` Username'/>
                    <Input onChange={onChange} label='Password' name='password' placeholder='Enter Password'/>
                    <Input onChange={onChange} label='Repeat Password' name='passwordConfirm' placeholder='Enter Password'/>
                </div>
            </form>
        </div>

    )
}
