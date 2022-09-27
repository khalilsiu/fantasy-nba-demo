import { Typography } from '@mui/material'
import { useImageProxy } from '../../hooks/useImageProxy'
import { useImageValidity } from '../../hooks/useImageValidity'
import Image from 'next/image'
import { Fragment, memo } from 'react'
import { FieldError } from 'react-hook-form'

interface IProps {
  imageUrl: string
  error: FieldError
}

function ImageSection({ imageUrl, error }: IProps) {
  const proxyUri = useImageProxy(imageUrl)
  const isImageValid = useImageValidity(imageUrl)
  if (!imageUrl || error) {
    return
  }

  return (
    <Fragment>
      {isImageValid ? (
        <Image
          alt="entryImage"
          src={proxyUri}
          layout="fill"
          objectFit="contain"
        />
      ) : (
        <Typography
          variant="h6"
          sx={{
            color: 'primary.main',
            fontSize: { xs: '12px', sm: '12px', md: '18px' },
          }}
        >
          Please enter a valid image url.
        </Typography>
      )}
    </Fragment>
  )
}

export default memo(ImageSection)
