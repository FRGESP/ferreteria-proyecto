import React from 'react'
import PedidoDetallePage from '@/components/cajas/pedidos/pedidoDetallePage';
interface PedidoDetalleProps {
    params: {
        id: string;
    }
}

function PedidoDetalle({ params }: PedidoDetalleProps) {
  return (
    <PedidoDetallePage IdPedidoProp={params.id} />
  )
}

export default PedidoDetalle