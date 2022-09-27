import NavBar from '../../components/NavBar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../hooks/app'
import { useCallback, useContext, useEffect } from 'react'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers-pro'
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns'
import React from 'react'
import { LeagueForm } from '../../interfaces/league'
import { createLeague } from '../../store/leagueSlice'
import { RootState } from '../../store'
import FormControlLabel from '@mui/material/FormControlLabel'
import { toLeagueDTO } from '../../utils/league'
import { useRouter } from 'next/router'
import { AuthContext, AuthContextType } from '../../contexts/AuthContext'
import { openToast } from '../../store/toastSlice'

const textFieldStyles = {
  width: { xs: '100%', sm: '100%', md: '50%' },
  paddingRight: { md: '50px' },
  marginBottom: '16px',
  boxSizing: 'border-box',
}

const URI_REGEX =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/

const defaultValues = {
  name: '',
  maxTeams: '5',
  draftDateTime: new Date().toISOString(),
  commissionerFee: '0',
  entryFee: '0',
  isPrivate: false,
}

export default function CreateLeaguePage() {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state: RootState) => state.league)
  const { address } = useContext(AuthContext) as AuthContextType
  const router = useRouter()
  const {
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm<LeagueForm>({
    mode: 'all',
    defaultValues,
  })
  const isLeagueSubmitted = loading === 'pending' || loading === 'succeeded'

  const onSubmit: SubmitHandler<LeagueForm> = useCallback(
    async (leagueForm) => {
      if (!address) {
        dispatch(openToast({
          message: 'Please connect wallet to create league',
          state: 'error',
        }))
      }
      const leagueDTO = toLeagueDTO({...leagueForm, commissionerWalletAddress: address})
      dispatch(createLeague(leagueDTO))
    },
    [dispatch, address]
  )

  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg" sx={{ paddingY: '30px' }}>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '10px',
          }}
        >
          Create your league
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Box sx={textFieldStyles}>
              <Controller
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                    label="Name"
                    disabled={isLeagueSubmitted}
                  />
                )}
                name="name"
                control={control}
              />
            </Box>
            <Box sx={textFieldStyles}>
              <Controller
                render={({ field, fieldState: { error } }) => (
                  <FormControlLabel sx={{ color: 'primary.main' }} {...field} control={<Checkbox color="primary" />} disabled={isLeagueSubmitted} label="Make League private?" />
                )}
                name="isPrivate"
                control={control}
              />
            </Box>
          </Box>
          <Box sx={textFieldStyles}>
            <Controller
              render={({ field, fieldState: { error } }) => (
                <TextField
                  type="number"
                  fullWidth
                  {...field}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value).toString())
                  }}
                  error={!!error}
                  helperText={error?.message}
                  label="Max. Number of Winners"
                  disabled={isLeagueSubmitted}
                />
              )}
              name="maxTeams"
              control={control}
              rules={{
                min: { value: 5, message: 'Minimum value is 5' },
                max: { value: 12, message: 'Maximum value is 12' },
                required: {
                  value: true,
                  message: 'Max number of teams is required.',
                },
              }}
            />
          </Box>
          <Box sx={textFieldStyles}>
            <Controller
              render={({ field, fieldState: { error } }) => (
                <TextField
                  type="number"
                  fullWidth
                  {...field}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value).toString())
                  }}
                  error={!!error}
                  helperText={error?.message}
                  label="Commissioner Fee % of Entry Fee"
                  disabled={isLeagueSubmitted}
                />
              )}
              name="commissionerFee"
              control={control}
              rules={{
                min: { value: 0, message: 'Minimum value is 0' },
                required: {
                  value: true,
                  message: 'Commissioner fee is required.',
                },
              }}
            />
          </Box>
          <Box sx={textFieldStyles}>
            <Controller
              render={({ field, fieldState: { error } }) => (
                <TextField
                  type="number"
                  fullWidth
                  {...field}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value).toString())
                  }}
                  error={!!error}
                  helperText={error?.message}
                  label="Entry Fee"
                  disabled={isLeagueSubmitted}
                />
              )}
              name="entryFee"
              control={control}
              rules={{
                min: { value: 0, message: 'Minimum value is 0' },
                required: {
                  value: true,
                  message: 'Entry fee is required.',
                },
              }}
            />
          </Box>
          <Box sx={textFieldStyles}>
            <Controller
              render={({ field, fieldState: { error } }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    disablePast
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                    label="Draft Date Time"
                    {...field}
                    disabled={isLeagueSubmitted}
                  />
                </LocalizationProvider>
              )}
              name="draftDateTime"
              control={control}
            />
          </Box>

            <LoadingButton
              loading={loading === 'pending'}
              type="submit"
              variant="contained"
              disabled={isLeagueSubmitted}
              sx={{ width: '150px', height: '50px' }}
            >
              Submit
            </LoadingButton>
        </form>
      </Container>
    </Box>
  )
}
