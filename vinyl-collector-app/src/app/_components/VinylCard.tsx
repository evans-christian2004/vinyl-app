import React from 'react'
import type { Vinyl } from '~/types'

type VinylProps = {
  vinyl: Vinyl;
}

const VinylCard: React.FC<VinylProps> = ({vinyl}) => {
  const {title, artist, yearReleased} = vinyl
  return (
    <div className="">
      <h4>{title}</h4>
      <p>{artist}</p>
      <p>{yearReleased && `(${yearReleased})`}</p>
    </div>
  )
}

export default VinylCard;