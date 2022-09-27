import { Box, Typography } from '@mui/material'
import { memo } from 'react'
import { renderCounterText } from '../../utils/time'

interface IProps {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function RegistrationStatus({ days, hours, minutes, seconds }: IProps) {
  const isClosed = !days && !hours && !minutes && !seconds
  return (
    <Box>
      {isClosed ? (
        <Box>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
            }}
          >
            Registration is{' '}
            <Typography
              variant="h5"
              sx={{ color: 'warning.main', fontWeight: 'bold' }}
              component="span"
            >
              closed.
            </Typography>
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'secondary.main',
            }}
          >
            This list is no longer accepting entries.
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography
            variant="h5"
            component="span"
            gutterBottom
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
            }}
          >
            Ending in:{' '}
          </Typography>
          <Typography
            variant="h5"
            component="span"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
            }}
          >
            {renderCounterText(days, hours, minutes, seconds)}
          </Typography>
          <Box>
            <Typography
              variant="subtitle1"
              component="span"
              sx={{
                color: 'secondary.main',
              }}
            >
              This registration for this list is{' '}
              <Typography
                variant="subtitle1"
                sx={{ color: 'warning.main', fontWeight: 'bold' }}
                component="span"
              >
                open.
              </Typography>
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default memo(RegistrationStatus)
