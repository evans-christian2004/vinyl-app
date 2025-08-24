import React from 'react'
import VinylCard from './VinylCard'
import { api } from '~/trpc/server'
import type { Vinyl } from '~/types'

const VinylsGrid = async () => {
  let vinyls: Vinyl[] = []
  try {
    vinyls = await api.vinyl.allUser()
  } catch (e) {
    return <div className="">Error fetching Records :/</div>
  }

  if (!vinyls.length) {
    return <div>Start tracking your collection by adding a vinyl</div>
  }

  return (
    <>
      {vinyls?.length ? vinyls.map(vinyl => {
        return <VinylCard key={vinyl.id} vinyl={vinyl}/>
      }): 'Start traking your collection by adding a vinyl'}
    </>
  )
}

export default VinylsGrid