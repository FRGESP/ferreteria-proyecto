import React from 'react'
import PedidosDetalleVendedor from '@/components/vendedor/pedidosDetalleVendedor';

interface PedidoDetalleProps {
    params: {
        id: string;
    }
}

function PedidoDetalle({ params }: PedidoDetalleProps) {
  return (
    <PedidosDetalleVendedor IdPedidoProp={params.id} />
  )
}

export default PedidoDetalle