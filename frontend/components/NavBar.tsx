import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Link from 'next/link'
import Button from '@mui/material/Button'
import { AuthContext, AuthContextType } from '../contexts/AuthContext'
import { memo, useContext, useMemo } from 'react'
import { minimizeAddress } from '../utils'

function NavBar() {
  const { connect, address, disconnect } = useContext(
    AuthContext
  ) as AuthContextType

  const navItems = useMemo(() => [{
    subPath: '/create',
    label: '🏀 Create League'
  }, {
    subPath: `/leagues/${address}`,
    label: '👨🏽 Your Leagues'
  }], [address])
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ background: 'black', borderBottom: '1px solid #434343' }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/">
              <Typography
                variant="h6"
                sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                FAMJB
              </Typography>
            </Link>
            {address && navItems.map((navItem) => <Link key={navItem.subPath} href={navItem.subPath}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'primary.main',
                  marginLeft: '20px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {navItem.label}
              </Typography>
            </Link>)}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {address ? (
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'primary.main',
                  marginLeft: '20px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
                onClick={disconnect}
              >
                {minimizeAddress(address)}
              </Typography>
            ) : (
              <Button
                variant="contained"
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  backgroundColor: '#0277FF',
                  fontWeight: 'bold',
                }}
                onClick={connect}
              >
                💰 Connect
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default memo(NavBar)
