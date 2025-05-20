import React from 'react'
import { checkRole } from '@/actions';
import RepartidorDashboard from '@/components/administrador/empleados/repartidorDashboard';

interface ClienteIdpageProps {
    params: {
        id: string;
        rol: string;
    }
}

async function ClienteIdpage({ params }: ClienteIdpageProps) {
    if (params.rol !== 'Vendedor') {
        await checkRole(0);
    }
  return (
    <RepartidorDashboard IdEmpleadoProp={params.id}/>
  )
}

export default ClienteIdpage