import React, { memo } from 'react'
import Image from 'next/image'

interface IProps {
  proxyUri: string
}

function ProjectImage({ proxyUri }: IProps) {
  if (!proxyUri) {
    return
  }

  return (
    <Image alt="projectImage" src={proxyUri} layout="fill" objectFit="cover" />
  )
}

export default memo(ProjectImage)
