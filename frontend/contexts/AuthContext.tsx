import React, {
  createContext,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import { injected } from '../config/injected'
import { InjectedConnector } from '@web3-react/injected-connector'
import { openToast } from '../store/toastSlice'

declare let window: any
export interface AuthContextType {
  address: string
  connect: () => void
  disconnect: () => void
  signer: ethers.Signer | null
  getBalance: () => Promise<ethers.BigNumber>
}

export const AuthContext = createContext<AuthContextType>(null as any)

const Provider =
  ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch()
    const [address, setAddress] = useState('')
    const { account, active, error, activate, deactivate } = useWeb3React()
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
      null
    )
    // check when app is connected to metamask as
    const handleIsActive = useCallback(async (
      injected: InjectedConnector,
      active: boolean,
      error: Error
    ) => {
      const isAuthorized = await injected.isAuthorized()
      if (isAuthorized && !active && !error) {
        await activate(injected)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setSigner(provider.getSigner())
      }
    }, [activate])

    const disconnect = useCallback(() => {
      try {
        deactivate()
        localStorage.setItem('account', '')
        setAddress('')
      } catch (e) {
        dispatch(
          openToast({
            message: `Wallet disconnecting error ${e}`,
            state: 'error',
          })
        )
      }
    }, [deactivate, dispatch])

    const getBalance = useCallback(async () => {
      if (signer) {
        return signer.getBalance()
      }
      return BigNumber.from(0)
    }, [signer])

    const connect = useCallback(async () => {
      try {
        await activate(injected)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        // sign signature if previously not signed
        const message = localStorage.getItem('signature')
        if (!message) {
          let messageToSign = '9gag is awesome'
          await signer.signMessage(messageToSign)
          localStorage.setItem('signature', messageToSign)
        }
        setSigner(signer)
      } catch (e: any) {
        // disconnect user if user error occurs e.g. sign rejected
        disconnect()
        dispatch(
          openToast({
            message: `Wallet connecting error ${e}`,
            state: 'error',
          })
        )
      }
    }, [activate, disconnect, dispatch])

    useEffect(() => {
      if (account) {
        localStorage.setItem('account', account)
        setAddress(account)
      }
    }, [account])

    useEffect(() => {
      const account = localStorage.getItem('account')
      if (account) {
        handleIsActive(injected, active, error)
        setAddress(account)
      }
    }, [active, error, handleIsActive, setAddress])

    return (
      <AuthContext.Provider
        value={{
          address,
          signer,
          connect: connect,
          disconnect: disconnect,
          getBalance,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

export const AuthContextProvider = memo(Provider)