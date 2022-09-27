import MuiAlert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import { useRouter } from 'next/dist/client/router'
import React, { Fragment, memo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/app'
import { RootState } from '../store'
import { closeToast, ToastAction } from '../store/toastSlice'

function GlobalSnackbar() {
  const dispatch = useAppDispatch()
  const { toast } = useAppSelector((state: RootState) => state.toast)
  const router = useRouter()

  const onRefresh = useCallback(() => {
    window.location.reload()
  }, [])

  const renderToastAction = useCallback(
    (toastAction: ToastAction) => {
      switch (toastAction) {
        case 'refresh':
          return <Button onClick={onRefresh}>Refresh</Button>
        default:
          return <Fragment />
      }
    },
    [onRefresh]
  )

  const handleToastClose = useCallback(() => {
    dispatch(closeToast())
    if (toast.action === 'redirect' && toast.to) {
      router.push(toast.to)
    }
  }, [dispatch, toast, router])

  return (
    <Snackbar
      open={toast.show}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      onClose={handleToastClose}
    >
      <MuiAlert
        severity={toast.state}
        action={toast.action && renderToastAction(toast.action)}
        variant="outlined"
        sx={{ minWidth: '300px' }}
      >
        {toast.message}
      </MuiAlert>
    </Snackbar>
  )
}

export default GlobalSnackbar
