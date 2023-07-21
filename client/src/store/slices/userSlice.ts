import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUserByIdApi } from 'src/api/requests/users'
import { signIn } from 'src/api/requests/signIn'
import { signUp } from 'src/api/requests/signUp'
import { UserSchema, SignInDataSchema, SignUpDataSchema } from 'src/types'
import { AuthorizationStatus } from 'src/constants/authorizationStatus'
import { saveToken } from 'src/helpers/tokenLocalStorage'

export const fetchUserById = createAsyncThunk('user/fetchById', async (id: string, thunkApi) => {
	const response = await getUserByIdApi(id)
	if (response.error) return thunkApi.rejectWithValue(response.error.error)

	return response.data
})

export const signInUser = createAsyncThunk('user/signIn', async (userData: SignInDataSchema, thunkApi) => {
	const response = await signIn(userData)
	if (response.error) return thunkApi.rejectWithValue(response.error.error)

	return response.data
})

export const signUpUser = createAsyncThunk('user/signUp', async (userData: SignUpDataSchema, thunkApi) => {
	const response = await signUp(userData)
	if (response.error) return thunkApi.rejectWithValue(response.error.error)

	return response.data
})

export interface UserState {
	data: UserSchema | null
	error?: string
	loading: boolean
	authLoading: boolean
	authorizationStatus: AuthorizationStatus.Auth | AuthorizationStatus.NoAuth | AuthorizationStatus.Unknown
	authError?: string
	authorizedUser: {
		id?: string
	}
}

type SuccessSignIn = {
	accessToken: string
	userId: string
}

type SuccessSignUp = {
	accessToken: string
	data: UserSchema
}

const initialState: UserState = {
	data: null,
	loading: true,
	authLoading: false,
	authorizationStatus: AuthorizationStatus.Unknown,
	authorizedUser: {}
}

export const currentUserSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchUserById.fulfilled.type]: (state, action: PayloadAction<UserSchema>) => {
			state.loading = false
			state.data = action.payload ?? null
		},
		[fetchUserById.pending.type]: state => {
			state.loading = true
		},
		[fetchUserById.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false
			state.error = action.payload
		},
		[signInUser.fulfilled.type]: (state, action: PayloadAction<SuccessSignIn>) => {
			state.authLoading = false
			state.authorizationStatus = AuthorizationStatus.Auth
			state.authorizedUser.id = action.payload.userId
			saveToken(action.payload.accessToken)
			state.authError = ''
		},
		[signInUser.pending.type]: state => {
			state.authLoading = true
		},
		[signInUser.rejected.type]: (state, action: PayloadAction<string>) => {
			state.authLoading = false
			state.authError = action.payload
			state.authorizationStatus = AuthorizationStatus.NoAuth
		},
		[signUpUser.fulfilled.type]: (state, action: PayloadAction<SuccessSignUp>) => {
			state.authLoading = false
			state.authorizationStatus = AuthorizationStatus.Auth
			state.authorizedUser.id = action.payload.data._id
			saveToken(action.payload.accessToken)
			state.authError = ''
		},
		[signUpUser.pending.type]: state => {
			state.authLoading = true
		},
		[signUpUser.rejected.type]: (state, action: PayloadAction<string>) => {
			state.authLoading = false
			state.authError = action.payload
			state.authorizationStatus = AuthorizationStatus.NoAuth
		}
	}
})

// export const {} = currentUserSlice.actions

export default currentUserSlice.reducer
