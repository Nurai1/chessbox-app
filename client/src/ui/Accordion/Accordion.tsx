import { FC, ReactElement, useState, useRef, useEffect } from 'react'
import { ReactComponent as DragIcon } from 'src/assets/drag-icon.svg'
import { ReactComponent as ArrowDownIcon } from 'src/assets/arrow-down-big.svg'
import { twMerge } from 'tailwind-merge'
import { useDrag, useDrop  } from 'react-dnd'

type AccordionPropsType =
    |   {
            children: ReactElement
            title: ReactElement
            classes?: string
            isOpenDefault?: boolean
            isDraggable?: false
            id: never
            index: never
            sortItems: never
            closeAccordion: never
        }
    |   {
            children: ReactElement
            title: ReactElement
            classes?: string
            isOpenDefault?: boolean
            isDraggable?: true
            id: string
            index: number
            sortItems: (dragIndex: number, hoverIndex: number) => void
            closeAccordion: (value: boolean) => void
        }

type DragItem = {
    index: number
    id: string
    type: string
}

const DRAG_N_DROP_KEY = 'accordion'
let hoverIndex: number
let allowDrag = false

export const Accordion: FC<AccordionPropsType>  = ({
       children,
       title,
       isDraggable,
       classes,
       isOpenDefault = false ,
       id,
       index,
       sortItems,
       closeAccordion
})=> {
    const [isOpen, setIsOpen] = useState(isOpenDefault)
    const [contentHeight, setContentHeight] = useState<number>()
    const [overflowStyle, setOverflowStyle] = useState('hidden')
    const [displayStyle, setDisplayStyle] = useState('none')
    const [isHovering, setIsHovering] = useState(false)
    const accordionContentRef = useRef<HTMLDivElement | null>(null)
    const ref = useRef(null)

    useEffect(() => {
        if (accordionContentRef.current && isOpen) {
            setDisplayStyle('block')
            setTimeout(() => setContentHeight(accordionContentRef.current?.clientHeight))
            setTimeout(() => setOverflowStyle('visible'), 200)
        } else {
            setContentHeight(0)
            setOverflowStyle('hidden')
            setTimeout(() => setDisplayStyle('none'), 200)
        }
    },[isOpen])

    useEffect(() => {
        window.addEventListener('mousedown', (event  ) => {
            if ((event.target as HTMLElement).classList.contains('js-drag-icon')) {
                allowDrag = true
            } else {
                allowDrag = false
            }
        })
    },[])

    useEffect(() => {
        setIsHovering(false)
    },[sortItems])

    const [{isDragging }, drag  ] = useDrag({
        type: DRAG_N_DROP_KEY,
        item: () => ({ id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            // draggingHandlerId: monitor.getHandlerId(),
            // item: monitor.getItem()
        }),
        end: (item, monitor) => {
            if (monitor.didDrop() && allowDrag) {
                sortItems(item.index, hoverIndex)
            } else {
                setIsHovering(false)
            }
        }
    })

    const [{ isOver }, drop] = useDrop<
        DragItem,
        void,
        { isOver: boolean }
    >({
        accept: DRAG_N_DROP_KEY,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
                isOver: monitor.isOver()
            }
        },
        hover(item: DragItem) {
            if (!ref.current || !allowDrag || isOpen) {
                return
            }

            const dragIndex = item.index
            hoverIndex = index

            if (dragIndex === hoverIndex) {
                return
            }

            if (isOver) {
                setIsHovering(true)
            } else {
                setIsHovering(false)
            }
        },
    })

    drag(drop(ref))

    const accordionContent = () => (
        <>
            <div className='flex items-center' >
                {isDraggable && <DragIcon
                    className={twMerge(
                        'mr-5 js-drag-icon',
                        isOpen ? 'hover:cursor-pointer' : 'hover:cursor-move',
                    )}
                    onClick={() => {
                        if (isOpen) {
                            closeAccordion(false)
                        }
                    }}
                />}
                <button className='flex justify-between items-center gap-2 grow transition hover:opacity-70' onClick={() => setIsOpen(!isOpen)} type='button'>
                    {title}
                    <ArrowDownIcon className={twMerge('transition', isOpen && 'rotate-180')}/>
                </button>
            </div>
            <div
                className={twMerge(
                    'overflow-hidden transition-[max-height] transition-500'
                )}
                style={{
                    maxHeight: `${contentHeight}px`,
                    transitionDuration: '0.2s',
                    overflow: `${overflowStyle}`,
                    display: `${displayStyle}`
                }}
            >
                <div ref={accordionContentRef} className='pt-4 xl:pt-[1.62rem]' >
                    {children}
                </div>
            </div>
        </>
    )

    return (
        <>
            {isDraggable && (
                <div className={twMerge(
                    'py-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-300 xl:py-[1.62rem] relative',
                    classes,
                    isDragging && 'opacity-20',
                    isHovering && 'before:absolute before:top-0 before:w-full before:h-0.5 before:bg-black'
                )}
                     ref={ref}
                >
                    {accordionContent()}
                </div>
            )}

            {!isDraggable && (
                <div className={twMerge('py-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-300 xl:py-[1.62rem]', classes)}>
                    {accordionContent()}
                </div>
            )}
        </>
    )
}
