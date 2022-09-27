
import { AlertColor } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createLeague } from './leagueSlice';
import { upsertSubmission } from './submissionSlice';

export type ToastAction = 'refresh' | 'redirect';

interface Toast {
    toast: {
        show: boolean;
        state?: AlertColor;
        message?: string;
        action?: ToastAction;
        to?: string;
    };
}

const initialState: Toast = {
    toast: {
        show: false,
    },
};

const toastSlice = createSlice({
    name: 'Toast',
    initialState,
    reducers: {
        openToast(
            state,
            action: PayloadAction<{
                message: string;
                state: AlertColor;
                action?: ToastAction;
                to?: string;
            }>,
        ) {
            const { state: toastState, message, action: toastAction, to } = action.payload;
            state.toast = {
                message,
                show: true,
                state: toastState,
                action: toastAction,
                to
            };
        },
        closeToast(state) {
            state.toast = {
                ...state.toast,
                show: false,
            };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createLeague.fulfilled, (state) => {
            state.toast = {
                message: 'League is successfully created.',
                show: true,
                state: 'success',
                action: 'redirect',
                to: '/'
            };
        })
        builder.addCase(createLeague.rejected, (state, action) => {
            state.toast = {
                message: action.error.message,
                show: true,
                state: 'error',
            };
        })
        // builder.addCase(upsertSubmission.rejected, (state, action) => {
        //     state.toast = {
        //         message: action.error.message,
        //         show: true,
        //         state: 'error',
        //     };
        // })
        // builder.addCase(fetchProjectById.rejected, (state, action) => {
        //     state.toast = {
        //         message: action.error.message,
        //         show: true,
        //         state: 'error',
        //     };
        // })
        // builder.addCase(updateProjectById.rejected, (state, action) => {
        //     state.toast = {
        //         message: action.error.message,
        //         show: true,
        //         state: 'error',
        //     };
        // })
        // builder.addCase(upsertSubmission.fulfilled, (state) => {
        //     state.toast = {
        //         message: 'Registration succeeded.',
        //         show: true,
        //         state: 'success',
        //         action: 'redirect',
        //         to: '/'
        //     };
        // })
        // builder.addCase(updateProjectById.fulfilled, (state) => {
        //     state.toast = {
        //         message: 'Project is successfully created.',
        //         show: true,
        //         state: 'success',
        //         action: 'redirect',
        //         to: '/'
        //     };
        // })
    }
});

export const { closeToast, openToast } = toastSlice.actions;
export const toast = toastSlice.reducer;
