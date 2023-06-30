import { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { fetchUsers } from 'src/store/slices/usersSlice'
import { ratingTableSchema } from '../helpers/tableSchema'
import { UsersTableWithTitle } from '../components'
import { TableWrapper } from '../ui'

const USERS_PER_STEP = 8;

export const RatingPage = (): ReactElement => {
    const dispatch = useAppDispatch()
    const [query, setQuery] = useState({
            limit: USERS_PER_STEP.toString(),
            offset: '0'
        }
    )

    const { items: users, total } = useAppSelector(s => s.users.data)
    const isLoading = useAppSelector(s => s.users.loading)
    const hasMoreUsers = total !== users.length

    // window.addEventListener('scroll', () => console.log(window.scrollY))

    useEffect(() => {
        dispatch(fetchUsers(query))
    }, [])

    const usersTable = ratingTableSchema(users)


    const loadMoreUsers = (startIndex: number, stopIndex: number) => {
        console.log(startIndex, stopIndex)
        if (isLoading || !hasMoreUsers) return

        const newOffset = Number(query.offset) + USERS_PER_STEP
        const newQuery = {
            ...query,
            offset: newOffset.toString()
        }
        setQuery(newQuery)
        dispatch(fetchUsers(newQuery))
    }

    let items = [];
    const isItemLoaded = (index: number) => !!items[index];


    return (
        <div>
            {users && <main className='container m-auto px-[17px] pt-[15px] md:px-7 md:pt-[25px] lg:px-10 lg:pt-[33px] 2xl:px-[40px] '>
                <h1 className='2xl:[mb-40px] mb-[13px] text-[24px] font-semibold xl:mb-[17px] xl:text-[54px] xl:font-bold'>
                    Rating
                </h1>



                    <TableWrapper>
                        <h2 className='border-b py-[18px] text-base font-medium
                                        text-black md:pb-[26px] md:text-xl
                                        md:font-semibold lg:text-2xl
                                        2xl:text-[32px]'
                        >
                            Заголовок таблицы
                        </h2>

                        <UsersTableWithTitle rows={usersTable} itemsCount={total} isInfiniteLoader loadMoreItems={loadMoreUsers} isItemLoaded={isItemLoaded} />

                    </TableWrapper>
            </main>}
        </div>
    )
}
