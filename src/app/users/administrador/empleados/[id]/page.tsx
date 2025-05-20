import React from 'react'
import RepartidorDashboard from '@/components/administrador/empleados/repartidorDashboard';

interface ClienteIdpageProps {
    params: {
        id: string;
    }
}

function ClienteIdpage({ params }: ClienteIdpageProps) {
  return (
    <RepartidorDashboard IdEmpleadoProp={params.id}/>
  )
}

export default ClienteIdpage