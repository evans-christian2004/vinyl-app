import React from 'react'
import type { Vinyl } from '~/types'

type VinylProps = {
  vinyl: Vinyl;
}

const VinylCard: React.FC<VinylProps> = ({vinyl}) => {
  const {title, artist, yearReleased, color, edition} = vinyl
  return (
    <div className="">
      <h4>{title}</h4>
      <p>{artist}</p>
      <p>{yearReleased && `(${yearReleased})`}</p>
      <p className='bg-[]'>{edition && `(${yearReleased})`}</p>
    </div>
  )
}

export default VinylCard;