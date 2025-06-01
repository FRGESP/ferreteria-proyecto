import React from 'react'
import PedidoDetallePage from '@/components/administrador/sucursales/pedidos/pedidosDetallePage';
interface PedidoDetalleProps {
    params: {
        pedido: string;
    }
}

function PedidoDetalle({ params }: PedidoDetalleProps) {
  return (
    <PedidoDetallePage IdPedidoProp={params.pedido} />
  )
}

export default PedidoDetalle