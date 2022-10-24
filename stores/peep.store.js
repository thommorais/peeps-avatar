import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { subscribeWithSelector } from 'zustand/middleware'

const useStore = devtools((set) => ({
    hair: 0,
    setHair: (hair) => set({ hair })
}))

export default create(subscribeWithSelector(useStore))