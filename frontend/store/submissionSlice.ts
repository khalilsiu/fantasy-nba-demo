import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ServerAPI } from '../apis/server/ServerApi'
import { UpsertSubmissionDTO } from '../interfaces/submission'

interface SubmissionState {
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
    loading: 'idle',
} as SubmissionState


export const upsertSubmission = createAsyncThunk(
    'submission/upsertSubmission',
    async (submissionDTO: UpsertSubmissionDTO, { rejectWithValue }) => {
        try {
            return ServerAPI.upsertSubmission(submissionDTO)
        } catch (e) {
            rejectWithValue(e.message)
        }
    }
)

export const submissionSlice = createSlice({
    name: 'submission',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(upsertSubmission.fulfilled, (state) => {
            state.loading = 'succeeded';
        })
        builder.addCase(upsertSubmission.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(upsertSubmission.rejected, (state) => {
            state.loading = 'failed'
        })
    },
})

export const submission = submissionSlice.reducer;
