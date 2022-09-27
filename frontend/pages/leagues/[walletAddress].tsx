import NavBar from '../../components/NavBar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useCallback, useContext } from 'react'
import { RootState, wrapper } from '../../store'
import { Submission } from '../../interfaces/submission'
import { useImageProxy } from '../../hooks/useImageProxy'
import { useCountDown } from '../../hooks/useCountDown'
import RegistrationStatus from '../../components/project/RegistrationStatus'
import { AuthContext, AuthContextType } from '../../contexts/AuthContext'
import { parseEther } from 'ethers/lib/utils'
import { useAppDispatch, useAppSelector } from '../../hooks/app'
import { upsertSubmission } from '../../store/submissionSlice'
import { useRouter } from 'next/router'
import keyBy from 'lodash/keyBy'
import { openToast } from '../../store/toastSlice'
import RegisterButton from '../../components/project/RegisterButton'

export interface LeaguesDetailProps {
  id: number
  name: string
  description: string
  imageUrl: string
  endDate: string
  minBalance: number
  maxWinners: number
  submissions?: Submission[]
  createdAt?: string
  submissionsById: { [walletAddress: string]: Submission }
}

export default function LeaguesPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { address } = useContext(AuthContext) as AuthContextType
  // const { loading } = useAppSelector((state: RootState) => state.submission)
  

  return (
    <Box>
      <NavBar />
      {/* <Box sx={{ width: '100%', height: '200px', position: 'relative' }}>
        <LeaguesImage proxyUri={proxyUri} />
      </Box>
      <Container maxWidth="lg" sx={{ paddingY: '30px', position: 'relative' }}>
        <Box sx={{ width: '50%' }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                marginBottom: '18px',
              }}
            >
              {props.name}
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <LeaguesDetails {...props} />
          </Grid>
          <Box sx={{ marginY: '20px' }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'info.main',
                marginBottom: '18px',
              }}
            >
              {props.description}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{ position: 'absolute', width: '35%', right: 0, top: '-80px' }}
        >
          <Box
            sx={{
              background: '#434343',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
            }}
          >
            <RegistrationStatus
              days={days}
              hours={hours}
              minutes={minutes}
              seconds={seconds}
            />
          </Box>
          <Box
            sx={{
              background: '#434343',
              borderRadius: '20px',
              padding: '24px',
            }}
          >
            {raffleResult === undefined || raffleResult === null ? (
              <RegisterButton
                isRegistered={isRegistered}
                isPendingRegister={isPendingRegister}
                isButtonDisabled={isButtonDisabled}
                handleRegister={handleRegister}
              />
            ) : (
              <Box
                sx={{
                  height: '60px',
                  fontSize: '16px',
                  width: '100%',
                  background: 'red',
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'primary.main',
                  backgroundColor: `${
                    raffleResult ? 'success.main' : 'warning.main'
                  }`,
                }}
              >
                {raffleResult
                  ? 'You won the whitelist!'
                  : 'You lost, try next time!'}
              </Box>
            )}
          </Box>
        </Box>
      </Container> */}
    </Box>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params: {walletAddress}, query: {page} }) => {
      if (!page || isNaN(parseInt(page as string, 10))) {
        return {
          redirect: {
            destination: `/leagues/${walletAddress}?page=1`,
            permanent: false,
          },
        }
      }
      if (!walletAddress) {
        return {
          redirect: {
            destination: '/?page=1',
            permanent: false,
          },
        }
      }
      // await store.dispatch(fetchLeagues(parseInt(id as string, 10)))
      // const {
      //   project: { project },
      // } = store.getState()
      // const submissionsById = keyBy(project.submissions, 'walletAddress')
      return {
        props: {
          // ...project,
          // submissionsById,
        },
      }
    }
)

