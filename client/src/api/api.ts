import createClient from 'openapi-fetch'
import { paths } from 'src/types/generated'

export const { get } = createClient<paths>({
	baseUrl: 'http://localhost:3001'
})
