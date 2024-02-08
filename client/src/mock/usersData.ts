import { UserSchema } from 'src/types'

export const usersMock: UserSchema[] = [
	{
		firstName: '',
		lastName: '',
		fullName: 'Misha Mavashi',
		weight: 65.59,
		_id: '63ee66b14ee166e852434153',
		email: 'participant1',
		hashedPassword: '$2b$10$2UYVV4dwlv6oD8FhCjy3MeLZE/KALlaZ7q4Kx83G7DVbHFmsl4jke',
		role: 'participant' as const,
		chessPlatform: {
			username: 'participant1'
		},
		ratingNumber: 1006,
		birthDate: '1992-07-31T08:33:59.000Z',
		gender: 'woman',
		competitionsHistory: []
	},
	{
		firstName: '',
		lastName: '',
		fullName: 'Ivan Kobzon',
		_id: '63f08ad795d112d70b1d9fb7',
		email: 'p2@email.com',
		hashedPassword: '$2b$10$yUlXttNfGw5MSBIrdath7u5TuSYKWsiBrC9P.6wevKj.moM9C1kAC',
		role: 'participant' as const,
		chessPlatform: {
			username: 'participant2'
		},
		birthDate: '1993-07-31T08:33:59.000Z',
		ratingNumber: 989,
		competitionsHistory: [],
		gender: 'man',
		weight: 60
	},
	{
		firstName: '',
		lastName: '',
		fullName: 'Vera Striguchka',
		_id: '641a211fb2d0cc59b6180562',
		email: 'p3@email.com',
		hashedPassword: '$2b$10$HrYX6Vc1IsI/zfnqE4qf5uJOb94.n9gsHS9AkuYn7EkbULR9zdT5m',
		role: 'participant' as const,
		chessPlatform: {
			username: 'participant3'
		},
		ratingNumber: 1000,
		competitionsHistory: [],
		birthDate: '1999-04-24T08:33:59.000Z',
		gender: 'man',
		weight: 60
	},
	{
		firstName: '',
		lastName: '',
		fullName: 'Vadim Bolshov',
		_id: '641a212cb2d0cc59b6180564',
		email: 'p4@email.com',
		hashedPassword: '$2b$10$VtveULpS3WmjmbFIHlfYKOpBgDvykss/usU/TS6rfIvl.0U2juQ9i',
		role: 'participant' as const,
		chessPlatform: {
			username: 'participant4'
		},
		ratingNumber: 1000,
		birthDate: '649416938000',
		gender: 'man',
		weight: 60,
		competitionsHistory: []
	}
]
