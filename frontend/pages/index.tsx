import Container from '@mui/material/Container'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { RESULT_PER_PAGE } from '../apis/server/ServerApi'
import NavBar from '../components/NavBar'
import UICard from '../components/index/UICard'
import { wrapper } from '../store'
import { Loading } from '../interfaces'

interface IProps {
  // projects: Project[]
  total: number
  loading: Loading
  error: string
}

const Home: NextPage = ({ }: IProps) => {
  const router = useRouter()
  const { page } = router.query

  return (
    <div>
      <NavBar />
      <Container maxWidth="lg" sx={{ paddingY: '16px' }}>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '10px',
          }}
        >
          Projects
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', marginBottom: '16px' }}>
          {/* {projects.map((project) => (
            <Box
              key={project.id}
              sx={{
                width: { xs: '100%', sm: '100%', md: '20%' },
                paddingRight: { md: '16px' },
                marginBottom: '16px',
                boxSizing: 'border-box',
                color: 'white',
              }}
            >
              <UICard
                id={project.id}
                imageUrl={project.imageUrl}
                name={project.name}
                maxWinners={project.maxWinners}
                endDate={project.endDate}
              />
            </Box>
          ))} */}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {/* {total && (
            <Pagination
              color="primary"
              count={Math.ceil(total / RESULT_PER_PAGE)}
              shape="rounded"
              page={parseInt(page as string, 10)}
              onChange={(e, newPage) => router.push(`/?page=${newPage}`)}
            />
          )} */}
        </Box>
      </Container>
    </div>
  )
}

export default Home

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query: { page } }) => {
      if (!page || isNaN(parseInt(page as string, 10))) {
        return {
          redirect: {
            destination: '/?page=1',
            permanent: false,
          },
        }
      }
      // await store.dispatch(fetchProjects(parseInt(page as string, 10)))
      // const {
      //   projects: { projects, total },
      // } = store.getState()
      return {
        props: {
          // projects,
          // total,
        },
      }
    }
)
