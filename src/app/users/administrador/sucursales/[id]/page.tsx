import React from 'react'
import SucursalIdDashboard from '@/components/administrador/sucursales/sucursalidDashboard';

interface SucursalIdpageProps {
    params: {
        id: string;
    }
}

function SucursalIdpage({ params }: SucursalIdpageProps) {
  return (
    <SucursalIdDashboard IdSucursalProp={params.id} />
  )
}

export default SucursalIdpage