import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ServerAPI } from '../apis/server/ServerApi'
import format from 'date-fns/format'
import { Loading } from '../interfaces'
import { CreateLeagueDTO, League } from '../interfaces/league'

interface LeagueState {
    league: League
    loading: Loading
}
const initDate = format(new Date(), 'yyyy-MM-dd')

const initialState = {
    league: {
        _id: '',
        name: '',
        maxTeams: 0,
        draftDateTime: initDate,
        commissionerFee: 0,
        entryFee: 0,
        isPrivate: true,
},
    loading: 'idle',
} as LeagueState

export const createLeague = createAsyncThunk(
    'league/createLeague',
    async (league: CreateLeagueDTO, { rejectWithValue }) => {
        try {
            return ServerAPI.createLeague(league)

        } catch (e) {
            rejectWithValue(e.message)
        }
    }
)

// export const updateLeagueById = createAsyncThunk(
//     'league/updateLeagueById',
//     async (league: CreateLeagueDTO, { rejectWithValue }) => {
//         try {
//             return ServerAPI.updateLeagueById(league)

//         } catch (e) {
//             rejectWithValue(e.message)

//         }
//     }
// )

// create a slice
export const leagueSlice = createSlice({
    name: 'league',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createLeague.fulfilled, (state, action) => {
            state.loading = 'succeeded';
        })
        builder.addCase(createLeague.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(createLeague.rejected, (state, action) => {
            state.loading = 'failed'
        })

        // builder.addCase(updateLeagueById.fulfilled, (state) => {
        //     state.loading = 'succeeded';
        // })
        // builder.addCase(updateLeagueById.pending, (state) => {
        //     state.loading = 'pending'
        // })
        // builder.addCase(updateLeagueById.rejected, (state, action) => {
        //     state.loading = 'failed'
        // })
    },
})

// export the action
export const league = leagueSlice.reducer;
