import { FC } from 'react'
import { Button, Timer } from 'src/ui'
import { UserSchema } from 'src/types'

type RegistrationEndsTimerPropsType = {
    time: string
    authorizedUser: UserSchema
    onParticipateClick: () => void
    onSideMenuOpen: () => void
}

export const RegistrationEndsTimer: FC<RegistrationEndsTimerPropsType>  = ({
    time,
    authorizedUser,
    onParticipateClick,
    onSideMenuOpen
}) => {
    return (
        <div className='mb-6 lg:mb-0'>
            <div className='flex items-center mb-6 lg:items-baseline lg:flex-col lg:gap-4'>
                <h3 className='mr-auto text-sm text-grey lg:text-base xl:text-[32px] xl:font-semibold xl:leading-[48px]'>
                    Registration ends in:
                </h3>
                <Timer
                    time={time}
                    containerClasses='lg:w-14 lg:h-14 xl:h-[6.5rem] xl:min-w-[6.5rem] xl:p-4'
                    countNumbersClasses='xl:text-[2rem]'
                    countLabelsClasses='text-grey'
                />
            </div>
            <div className='flex flex-col gap-[15px] md:flex-row md:gap-[20px] lg:flex-col lg:gap-[10px]'>
                {authorizedUser?.role !== 'chief_judge' && (
                    <Button onClick={onParticipateClick} classes='md:w-full xl:max-w-[21rem]'>
                        Participate
                    </Button>
                )}
                <Button
                    onClick={onSideMenuOpen}
                    type='outlined'
                    classes='md:w-full lg:font-normal lg:text-sm xl:max-w-[21rem] xl:text-base xl:font-bold'
                >
                    Check out participants
                </Button>
            </div>
        </div>
    )
}
