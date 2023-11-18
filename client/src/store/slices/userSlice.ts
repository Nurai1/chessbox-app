import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { changePasswordRequest, forgotPasswordRequest, signIn } from 'src/api/requests/signIn'
import { signUp } from 'src/api/requests/signUp'
import { editCurrentUser, getCurrentUser, getUserByIdApi } from 'src/api/requests/users'
import { AuthorizationStatus } from 'src/constants/authorizationStatus'
import { saveToken, dropToken } from 'src/helpers/tokenStorage'
import {
	ChangePasswordDataSchema,
	ErrorPayload,
	ForgotPasswordDataSchema,
	SignInDataSchema,
	SignUpDataSchema,
	UserSchema
} from 'src/types'

export const fetchUserById = createAsyncThunk('user/fetchById', async (id: string, thunkApi) => {
	const response = await getUserByIdApi(id)
	if (response.error)
		return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

	return response.data
})

export const signInUser = createAsyncThunk('user/signIn', async (userData: SignInDataSchema, thunkApi) => {
	const response = await signIn(userData)
	if (response.error)
		return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

	return response.data
})

export const signUpUser = createAsyncThunk('user/signUp', async (userData: SignUpDataSchema, thunkApi) => {
	const response = await signUp(userData)
	if (response.error)
		return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

	return response.data
})

export const checkAuth = createAsyncThunk('user/checkAuth', async (_, thunkApi) => {
	const response = await getCurrentUser()

	if (response.error)
		return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

	return response.data
})

export const editUser = createAsyncThunk('user/editUser', async (userData: UserSchema, thunkApi) => {
	const response = await editCurrentUser(userData)
	if (response.error)
		return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

	return response.data
})
export const changePassword = createAsyncThunk(
	'user/changePassword',
	async (body: ChangePasswordDataSchema, thunkApi) => {
		const response = await changePasswordRequest(body)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export const forgotPassword = createAsyncThunk(
	'user/forgotPassword',
	async (body: ForgotPasswordDataSchema, thunkApi) => {
		const response = await forgotPasswordRequest(body)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export interface UserState {
	data: UserSchema | null
	loading: boolean
	authLoading: boolean
	authorizationStatus: AuthorizationStatus.Auth | AuthorizationStatus.NoAuth | AuthorizationStatus.Unknown
	editLoading: boolean
	authError?: string
	passwordError?: string
	authorizedUser?: UserSchema | null
	error?: string
	editError?: string
	editSuccess?: boolean
	passwordChanged?: boolean
	isPasswordLinkSent?: boolean
}

type SuccessAuth = {
	accessToken: string
	data: UserSchema
}

const initialState: UserState = {
	data: null,
	loading: true,
	authLoading: false,
	editLoading: false,
	authorizationStatus: AuthorizationStatus.Unknown,
	passwordChanged: undefined,
	isPasswordLinkSent: undefined
}

export const currentUserSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		resetAuthStatus: state => {
			state.authLoading = false
			state.authorizationStatus = AuthorizationStatus.NoAuth
		},
		logout: state => {
			state.authorizationStatus = AuthorizationStatus.NoAuth
			state.authorizedUser = null
			dropToken()
		}
	},
	extraReducers: {
		[forgotPassword.pending.type]: state => {
			state.authLoading = true
		},
		[forgotPassword.fulfilled.type]: state => {
			state.authLoading = false
			state.authorizedUser = null
			state.isPasswordLinkSent = true
		},
		[forgotPassword.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.passwordError = action.payload.errorMessage
			state.isPasswordLinkSent = false
			state.authLoading = false
		},
		[changePassword.pending.type]: state => {
			state.authLoading = true
		},
		[changePassword.fulfilled.type]: state => {
			state.authLoading = false
			state.authorizationStatus = AuthorizationStatus.NoAuth
			state.authorizedUser = null
			state.passwordChanged = true
		},
		[changePassword.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.authLoading = false
			state.passwordError = action.payload.errorMessage
			state.passwordChanged = true
		},
		[fetchUserById.fulfilled.type]: (state, action: PayloadAction<UserSchema>) => {
			state.loading = false
			state.data = action.payload ?? null
		},
		[fetchUserById.pending.type]: state => {
			state.loading = true
		},
		[fetchUserById.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.loading = false
			state.error = action.payload.errorMessage
		},
		[signInUser.fulfilled.type]: (state, action: PayloadAction<SuccessAuth>) => {
			state.authLoading = false
			state.authorizationStatus = AuthorizationStatus.Auth
			state.authorizedUser = action.payload.data
			saveToken(action.payload.accessToken)
			state.authError = ''
		},
		[signInUser.pending.type]: state => {
			state.authLoading = true
		},
		[signInUser.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.authLoading = false
			state.authError = action.payload.errorMessage
			state.authorizationStatus = AuthorizationStatus.NoAuth
		},
		[signUpUser.fulfilled.type]: (state, action: PayloadAction<SuccessAuth>) => {
			state.authLoading = false
			state.authorizationStatus = AuthorizationStatus.Auth
			state.authorizedUser = action.payload.data
			saveToken(action.payload.accessToken)
			state.authError = ''
		},
		[signUpUser.pending.type]: state => {
			state.authLoading = true
		},
		[signUpUser.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.authLoading = false
			state.authError = action.payload.errorMessage
			state.authorizationStatus = AuthorizationStatus.NoAuth
		},
		[checkAuth.fulfilled.type]: (state, action: PayloadAction<UserSchema>) => {
			state.authLoading = false
			state.authorizationStatus = AuthorizationStatus.Auth
			state.authorizedUser = action.payload
		},
		[checkAuth.pending.type]: state => {
			state.authLoading = true
		},
		[editUser.fulfilled.type]: (state, action: PayloadAction<UserSchema>) => {
			state.editLoading = false
			state.authorizedUser = action.payload
			state.editSuccess = true
		},
		[editUser.pending.type]: state => {
			state.editLoading = true
		},
		[editUser.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.editLoading = false
			state.editError = action.payload.errorMessage
		}
	}
})

export const { resetAuthStatus, logout } = currentUserSlice.actions

export default currentUserSlice.reducer
