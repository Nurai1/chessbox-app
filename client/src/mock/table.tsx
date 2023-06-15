export const ratingTableMock = [
    {
        title: 'Man 18-25 age, -61 kg',
        columns: {
            Place: 'Place',
            Name: 'Name',
            Location: 'Location',
            Points: 'Points'
        },
        info: {
            place: '1',
            name: 'Andreev Aleksandr',
            location: 'Russia, Ufa',
            participantInfo: '18 age, 63 kg',
            points: '1054'
        }
    },
    {
        title: 'Man 25-30 age, -65 kg',
        columns: [
            {title: 'Place'},
            {title: 'Name'},
            {title: 'Location'},
            {title: 'Points'}
        ],
        info: [
            { place: '2'},
            { name: 'Oleg Vinokurov' },
            { location: 'Russia, Kazan' },
            { participantInfo: '18 age, 63 kg' },
            { points: '1026' }
        ]
    },
    {
        title: 'Man 18-25 age, -61 kg',
        columns: [
            {title: 'Place'},
            {title: 'Name'},
            {title: 'Location'},
            {title: 'Points'}
        ],
        info: [
            { place: '3'},
            { name: 'Egor Smirnov' },
            { location: 'Russia, Omsk' },
            { participantInfo: '18 age, 63 kg' },
            { points: '965' }
        ]
    },
    {
        title: 'Man 18-25 age, -61 kg',
        columns: [
            {title: 'Place'},
            {title: 'Name'},
            {title: 'Location'},
            {title: 'Points'}
        ],
        info: [
            { place: '4'},
            { name: 'Vyacheslav Glibin' },
            { location: 'Russia, Moscow' },
            { participantInfo: '18 age, 63 kg' },
            { points: '859' }
        ]
    },
];

type RatingTableSchemaType = {
    title: string
    columns: Record<string, string>[]
    rows: Record<string, string>[]
}

const ratingTableSchema = (tableData: RatingTableSchemaType[]) => {
    tableData.map(item => {
        return {
            title: item.title,

        }
    });
};

export const tableDataMock = {
    title: 'Man 18-25 age, -61 kg',
    columns: [
        {title: 'Place', classes: 'max-w-[50px] md:max-w-[70px] lg:max-w-[100px]'},
        {title: 'Name', classes: '!grow-[2] xl:!grow-[1]'},
        {title: 'Location', classes: 'hidden xl:flex'},
        {title: 'Points', classes: '2xl:min-w-[45%] xl:min-w-[40%]'}
    ],
    rows: [
        {
            cells: [
                {
                    node: <p className='medal-place medal-place-gold'>1</p>,
                    classes: 'flex items-center justify-center w-full text-base text-black max-w-[50px] md:font-bold md:max-w-[70px] lg:font-semibold lg:text-2xl lg:max-w-[100px] xl:font-medium lg:text-xl 2xl:font-semibold 2lx:text-2xl'
                },
                {
                    node:
                        <div>
                            <p className='text-base font-normal text-black
                            md:text-xl md:font-medium
                            lg:text-2xl lg:font-semibold
                            xl:text-xl xl:font-medium
                            2xl:text-2xl 2xl:font-semibold'>Andreev Aleksandr</p>
                            <p className='xl:hidden'>Russia, Ufa</p>
                            <p className='text-[#6C6A6C]
                            md:text-base'>18 age, 63 kg</p>
                        </div>,
                    classes: 'min-h-[90px] md:min-h-[134px] lg:min-h-[140px] xl:min-h-[115px] !grow-[2] xl:!grow-[1]'
                },
                {
                    node: <p className='text-xl font-medium text-black'>Russia, Ufa</p>,
                    classes: 'hidden xl:flex'
                },
                {
                    node: <p className='text-sm text-black font-normal
                    md:text-base md:font-medium
                    xl:text-xl
                    2xl:font-medium 2xl:text-xl'>1054 Points</p>,
                    classes: '2xl:min-w-[45%] xl:min-w-[40%]'
                },
            ]
        },
        {
            cells: [
                {
                    node: <p className='medal-place medal-place-silver'>2</p>,
                    classes: 'flex items-center justify-center w-full text-base text-black max-w-[50px] md:font-bold md:max-w-[70px] lg:font-semibold lg:text-2xl lg:max-w-[100px] xl:font-medium lg:text-xl 2xl:font-semibold 2lx:text-2xl'
                },
                {
                    node:
                        <div>
                            <p className='text-base font-normal text-black
                            md:text-xl md:font-medium
                            lg:text-2xl lg:font-semibold
                            xl:text-xl xl:font-medium
                            2xl:text-2xl 2xl:font-semibold'>Oleg Vinokurov</p>
                            <p className='xl:hidden'>Russia, Kazan</p>
                            <p className='text-[#6C6A6C]
                            md:text-base'>18 age, 63 kg</p>
                        </div>,
                    classes: 'min-h-[90px] md:min-h-[134px] lg:min-h-[140px] xl:min-h-[115px] !grow-[2] xl:!grow-[1]'
                },
                {
                    node: <p className='text-xl font-medium text-black'>Russia, Kazan</p>,
                    classes: 'hidden xl:flex'
                },
                {
                    node: <p className='text-sm text-black font-normal
                    md:text-base md:font-medium
                    xl:text-xl
                    2xl:font-medium 2xl:text-xl'>1026 Points</p>,
                    classes: '2xl:min-w-[45%] xl:min-w-[40%]'
                },
            ]
        },
        {
            cells: [
                {
                    node: <p className='medal-place medal-place-bronze'>3</p>,
                    classes: 'flex items-center justify-center w-full text-base text-black max-w-[50px] md:font-bold md:max-w-[70px] lg:font-semibold lg:text-2xl lg:max-w-[100px] xl:font-medium lg:text-xl 2xl:font-semibold 2lx:text-2xl'
                },
                {
                    node:
                        <div>
                            <p className='text-base font-normal text-black
                            md:text-xl md:font-medium
                            lg:text-2xl lg:font-semibold
                            xl:text-xl xl:font-medium
                            2xl:text-2xl 2xl:font-semibold'>Egor Smirnov</p>
                            <p className='xl:hidden'>Russia, Omsk</p>
                            <p className='text-[#6C6A6C]
                            md:text-base'>18 age, 63 kg</p>
                        </div>,
                    classes: 'min-h-[90px] md:min-h-[134px] lg:min-h-[140px] xl:min-h-[115px] !grow-[2] xl:!grow-[1]'
                },
                {
                    node: <p className='text-xl font-medium text-black'>Russia, Omsk</p>,
                    classes: 'hidden xl:flex'
                },
                {
                    node: <p className='text-sm text-black font-normal
                    md:text-base md:font-medium
                    xl:text-xl
                    2xl:font-medium 2xl:text-xl'>999 Points</p>,
                    classes: '2xl:min-w-[45%] xl:min-w-[40%]'
                },
            ]
        },
        {
            cells: [
                {
                    node: <p>4</p>,
                    classes: 'flex items-center justify-center w-full text-base text-black max-w-[50px] md:font-bold md:max-w-[70px] lg:font-semibold lg:text-2xl lg:max-w-[100px] xl:font-medium lg:text-xl 2xl:font-semibold 2lx:text-2xl'
                },
                {
                    node:
                        <div>
                            <p className='text-base font-normal text-black
                            md:text-xl md:font-medium
                            lg:text-2xl lg:font-semibold
                            xl:text-xl xl:font-medium
                            2xl:text-2xl 2xl:font-semibold'>Vyacheslav Glibin</p>
                            <p className='xl:hidden'>Russia, Moscow</p>
                            <p className='text-[#6C6A6C]
                            md:text-base'>18 age, 63 kg</p>
                        </div>,
                    classes: 'min-h-[90px] md:min-h-[134px] lg:min-h-[140px] xl:min-h-[115px] !grow-[2] xl:!grow-[1]'
                },
                {
                    node: <p className='text-xl font-medium text-black'>Russia, Moscow</p>,
                    classes: 'hidden xl:flex'
                },
                {
                    node: <p className='text-sm text-black font-normal
                    md:text-base md:font-medium
                    xl:text-xl
                    2xl:font-medium 2xl:text-xl'>912 Points</p>,
                    classes: '2xl:2xl:min-w-[45%] xl:min-w-[40%]'
                },
            ]
        },
        {
            cells: [
                {
                    node: <p>5</p>,
                    classes: 'flex items-center justify-center w-full text-base text-black max-w-[50px] md:font-bold md:max-w-[70px] lg:font-semibold lg:text-2xl lg:max-w-[100px] xl:font-medium lg:text-xl 2xl:font-semibold 2lx:text-2xl'
                },
                {
                    node:
                        <div>
                            <p className='text-base font-normal text-black
                            md:text-xl md:font-medium
                            lg:text-2xl lg:font-semibold
                            xl:text-xl xl:font-medium
                            2xl:text-2xl 2xl:font-semibold'>Andreev Aleksandr</p>
                            <p className='xl:hidden'>Russia, Moscow</p>
                            <p className='text-[#6C6A6C]
                            md:text-base'>18 age, 63 kg</p>
                        </div>,
                    classes: 'min-h-[90px] md:min-h-[134px] lg:min-h-[140px] xl:min-h-[115px] !grow-[2] xl:!grow-[1]'
                },
                {
                    node: <p className='text-xl font-medium text-black'>Russia, Moscow</p>,
                    classes: 'hidden xl:flex'
                },
                {
                    node: <p className='text-sm text-black font-normal
                    md:text-base md:font-medium
                    xl:text-xl
                    2xl:font-medium 2xl:text-xl'>864 Points</p>,
                    classes: '2xl:min-w-[45%] xl:min-w-[40%]'
                },
            ]
        },
    ]
}