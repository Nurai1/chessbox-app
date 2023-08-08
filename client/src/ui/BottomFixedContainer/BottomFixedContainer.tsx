import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type BottomFixedContainerPropsType = {
    children: ReactNode
    classes?: string
}

export const BottomFixedContainer: FC<BottomFixedContainerPropsType> = ({children, classes}) => {
    return (
        <div className='w-full fixed py-5 px-[1.12rem] bottom-0 left-0 bg-white shadow-[0px_16px_60px_0px_rgba(0,0,0,0.25)] z-10 xl:py-7'>
            <div className={twMerge('container m-auto', classes)}>
                {children}
            </div>
        </div>
    )
}
