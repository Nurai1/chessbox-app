import { ReactElement, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'
import { ReactComponent as ArrowLeftIcon } from 'src/assets/arrow-left.svg'
import { ReactComponent as WhatsAppIcon } from 'src/assets/whatsapp.svg'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { Loader, Select } from 'src/ui'
import { getFormattedDate } from 'src/helpers/datetime'
import { fetchCompetitionById } from 'src/store/slices/competitionSlice'

export const JudgeAssignPage = (): ReactElement => {
    const { competitionId } = useParams()
    const [selectedGender, setSelectedGender] = useState<string| undefined>()
    const dispatch = useAppDispatch()
    const competitionDataFromCompetitionsList = useAppSelector(s => s.competitions.data).find(({ _id }) => _id === competitionId)
    const competitionDataFromCompetition = useAppSelector(s => s.competition.data)
    const competitionData = competitionDataFromCompetitionsList || competitionDataFromCompetition
    const dateStart = competitionData && getFormattedDate(competitionData.startDate, 'MMM D, HH:mm')

    useEffect(() => {
        if (!competitionData) {
            dispatch(fetchCompetitionById(competitionId as string))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <main
            className="container relative mx-auto grow px-[17px] pt-[30px] md:pt-[38px] xl:pl-[103px] xl:pr-[50px] xl:pt-[55px]">
            <Link
                to={`/${AppRoute.Competitions}/${competitionId}`}
                className="hidden transition hover:opacity-70 xl:absolute xl:left-[38px] xl:top-[77px] xl:block"
            >
                <ArrowLeftIcon/>
            </Link>
            {competitionData
                ? <div>
                    <h1 className="mb-4 text-2xl font-semibold xl:text-[2rem] leading-normal">
                        {competitionData.name}
                    </h1>
                    <p className="mb-[2.5rem] text-sm text-[#6C6A6C] xl:mb-[4.375rem] xl:text-xl xl:font-medium">
                        {dateStart}
                    </p>
                </div>
                : <Loader/>
            }
            <div>
                <div className='mb-7 xl:mb-12'>
                    <Select
                        onChange={(value) => setSelectedGender(value)}
                        menuOptions={[
                            { value: 'Man', id: 'man' },
                            { value: 'Woman', id: 'woman' }
                        ]}
                        dropdownPlaceholder='Select gender'
                        placeholder='Select gender'
                        chosenId={selectedGender}
                    />
                </div>
                <div>
                    <h3 className='mb-1 font-semibold xl:text-2xl'>Judges</h3>
                    <div>
                        <div>
                            {/* <a className="flex-center gap-4 font-medium text-black text-sm hover:opacity-70 transition md:text-base xl:text-xl" */}
                            {/*    href={`https://wa.me/${judge.socialNetworks?.whatsup}`}> */}
                            {/*     <WhatsappIcon className="w-4 xl:w-6"/> */}
                            {/*     {judge.socialNetworks?.whatsup} */}
                            {/* </a> */}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
