import React from 'react'

interface SucursalIdpageProps {
    params: {
        id: string;
    }
}

function SucursalIdpage({ params }: SucursalIdpageProps) {
  return (
    <div>SucursalIdpage {params.id}</div>
  )
}

export default SucursalIdpage