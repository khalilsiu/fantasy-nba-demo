import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ServerAPI } from '../apis/server/ServerApi'

interface ProjectsState {
    // projects: Project[]
    total: number
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
    projects: [],
    total: 0,
    loading: 'idle',
} as ProjectsState

// export const fetchProjects = createAsyncThunk(
//     'projects/fetchProjects',
//     async (page: number, { rejectWithValue }) => {
//         try {
//             return ServerAPI.fetchProjects(page)
//         } catch (e) {
//             rejectWithValue(e.message)
//         }
//     }
// )

export const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // builder.addCase(fetchProjects.fulfilled, (state, action) => {
        //     state.projects = action.payload.projects;
        //     state.total = action.payload.total;
        //     state.loading = 'succeeded';
        // })
        // builder.addCase(fetchProjects.pending, (state) => {
        //     state.loading = 'pending'
        // })
        // builder.addCase(fetchProjects.rejected, (state, action) => {
        //     state.loading = 'failed'
        // })
    },
})

export const projects = projectsSlice.reducer;
