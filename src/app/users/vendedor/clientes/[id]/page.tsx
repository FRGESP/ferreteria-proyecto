import React from 'react'
import VentaVendedor from '@/components/vendedor/ventaVendedor';

interface ClientesIdPageProps {
    params: {
        id: string;
    }
}

function ClientesIdPage({ params }: ClientesIdPageProps) {
  return (
    <div>
        <VentaVendedor IdClienteProp={params.id} />
    </div>
  )
}

export default ClientesIdPage