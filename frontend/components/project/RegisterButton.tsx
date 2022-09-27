import LoadingButton from '@mui/lab/LoadingButton'
import { memo } from 'react'

interface IProps {
  isRegistered: boolean
  isPendingRegister: boolean
  isButtonDisabled: boolean
  handleRegister: () => void
}
function RegisterButton({
  isRegistered,
  isPendingRegister,
  isButtonDisabled,
  handleRegister,
}: IProps) {
  return (
    <LoadingButton
      loading={isPendingRegister}
      color="primary"
      fullWidth
      variant="contained"
      sx={{ height: '60px', fontSize: '16px' }}
      disabled={isButtonDisabled}
      onClick={handleRegister}
    >
      {isRegistered ? '👍 You have registered' : 'Click To Register'}
    </LoadingButton>
  )
}

export default memo(RegisterButton)
