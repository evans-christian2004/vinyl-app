import React from 'react'
import { api } from '~/trpc/react'
import VinylCard from './VinylCard'

const VinylsGrid = () => {
  const  { data: vinyls, isLoading, isError } = api.vinyl.all.useQuery()

  if (isLoading) return <div className="">Loading Records</div>
  if (isError) return <div className="">Error fetching Records :/</div>
  return (
    <>
      {vinyls?.length ? vinyls.map(vinyl => {
        return <VinylCard key={vinyl.id} vinyl={vinyl}/>
      }): 'Start traking your collection by adding a vinyl'}
    </>
  )
}

export default VinylsGrid