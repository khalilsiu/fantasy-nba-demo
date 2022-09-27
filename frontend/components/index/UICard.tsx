import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'
import Link from 'next/link'
import { useCountDown } from '../../hooks/useCountDown'
import { renderCounterText } from '../../utils/time'

interface IProps {
  id: number
  imageUrl: string
  name: string
  maxWinners: number
  endDate: string
}
export default function UICard(props: IProps) {
  const endDateTime = new Date(props.endDate).getTime()
  const { days, hours, minutes, seconds } = useCountDown({
    time: endDateTime,
    countDown: false,
  })
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Link href={`/project/${props.id}`}>
        <CardActionArea sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="180"
            src={props.imageUrl}
            alt="green iguana"
          />
          <CardContent
            sx={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                textTransform: 'capitalize',
                textAlign: 'center',
              }}
              component="div"
            >
              {props.name}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'primary.main',
                textTransform: 'capitalize',
                textAlign: 'center',
                fontSize: '12px',
              }}
              component="div"
            >
              Max: {props.maxWinners}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'primary.main',
                textAlign: 'center',
                fontSize: '12px',
              }}
              component="div"
            >
              End in {renderCounterText(days, hours, minutes, seconds)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}
