import { Box, Grid, Typography } from '@mui/material'
import format from 'date-fns/format'
import { Fragment, memo } from 'react'
import { ProjectDetailProps } from '../../pages/project/[id]'

export const renderProjectDetails: {
  label: string
  render: (props: ProjectDetailProps) => React.ReactNode
}[] = [
  {
    label: 'Min. Balance',
    render: (props) => {
      return `${props.minBalance}Ξ`
    },
  },
  {
    label: 'Max. Winners',
    render: (props) => {
      return props.maxWinners
    },
  },
  {
    label: 'End Date',
    render: (props) => {
      return format(new Date(props.endDate), 'dd-MMM-yyyy hh:mm')
    },
  },
  {
    label: 'No. of Submissions',
    render: (props) => {
      return props.submissions.length
    },
  },
  {
    label: 'Date of Creation',
    render: (props) => {
      return format(new Date(props.createdAt), 'dd-MMM-yyyy')
    },
  },
]

const ProjectDetail = ({ label, render, props }) => {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{
          color: 'secondary.main',
          fontSize: '12px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{
          color: 'info.main',
          fontSize: '14px',
        }}
      >
        {render(props)}
      </Typography>
    </Box>
  )
}

function ProjectDetails(props: ProjectDetailProps) {
  return (
    <Fragment>
      {renderProjectDetails.map((detail) => (
        <Grid key={detail.label} item xs={4}>
          <ProjectDetail
            label={detail.label}
            render={detail.render}
            props={props}
          />
        </Grid>
      ))}
    </Fragment>
  )
}

export default memo(ProjectDetails)
