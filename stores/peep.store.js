import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { subscribeWithSelector } from 'zustand/middleware'

const useStore = devtools((set) => ({
    bodyPart: 'hair',
    hair: 0,
    bodyParts: ['hair', 'eyebrow', 'shirt', 'legs'],
    setBodyPart: (bodyPart) => set({ bodyPart }),
    setHair: (hair) => set({ hair })
}))

export default create(subscribeWithSelector(useStore))