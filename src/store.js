import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create(persist(
    (set) => ({
        role: '',
        setRole: (role) => set(() => ({ role })),
      }),
    {
      name: 'stockage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ))