import { ReactComponent as ThreeStarsIcon } from 'src/assets/three-stars.svg'
import { ReactComponent as TwoStarsIcon } from 'src/assets/two-stars.svg'
import { Button } from 'src/ui'
import { FC } from 'react'

type YouAreParticipantPropsType = {
    onSideMenuOpen: () => void
}

export const YouAreParticipant: FC<YouAreParticipantPropsType> = ({onSideMenuOpen}) => {
    return (
        <div className='relative mb-[24px] lg:mb-0 lg:h-fit lg:rounded-[12px] lg:border lg:p-[30px_10px_10px_10px] xl:p-[45px_25px_25px_25px]'>
            <div className='hidden lg:mb-[25px] lg:block xl:mb-[40px]'>
                <h3 className='hidden lg:mb-[20px] lg:block lg:text-xl lg:font-semibold xl:mb-[30px] xl:text-[32px] xl:leading-[48px]'>
                    You are <br />
                    participant!
                </h3>
                <p className='hidden text-sm lg:block xl:text-base'>Additional information will be published later</p>
                <ThreeStarsIcon
                    className='absolute top-[15px] left-[92px] w-[24px]
					xl:top-[34px] xl:left-[150px] xl:w-[44px]'
                />
                <ThreeStarsIcon
                    className='2xl:h-[37px absolute top-[24px] left-[143px] w-[24px]
					xl:top-[50px] xl:left-[260px] xl:w-[44px]'
                />
                <TwoStarsIcon
                    className='absolute top-[70px] left-[130px] w-[23px]
					xl:top-[120px] xl:left-[240px] xl:w-[40px]'
                />
            </div>
            <div className='flex flex-col gap-[15px] md:flex-row md:gap-[20px] lg:flex-col lg:gap-[10px]'>
                <Button onClick={() => ''} type='outlined' classes='pointer-events-none md:w-full lg:hidden'>
                    You are participant!
                </Button>
                <Button
                    onClick={onSideMenuOpen}
                    type='outlined'
                    classes='md:w-full lg:font-normal lg:text-sm lg:px-0 xl:text-base xl:font-bold'
                >
                    Check out <span className='md:hidden xl:inline'>other</span>
                    participants
                </Button>
            </div>
        </div>
    )
}
