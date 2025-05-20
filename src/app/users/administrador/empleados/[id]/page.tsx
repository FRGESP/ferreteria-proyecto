import React from 'react'
import VendedorDashboard from '@/components/administrador/empleados/vendedorDashboard';

interface ClienteIdpageProps {
    params: {
        id: string;
    }
}

function ClienteIdpage({ params }: ClienteIdpageProps) {
  return (
   <VendedorDashboard IdEmpleadoProp={params.id}/>
  )
}

export default ClienteIdpage