import React from 'react'
import CajasInventario from '@/components/cajas/inventario/cajasInventarioPage'
import { getSucursalSession } from '@/actions'

async function ProductosCajasPage() {
    // Obtiene la sucursal de la session
    const sucursal = await getSucursalSession();
  return (
    <CajasInventario IdSucursalProp={String(sucursal)}/>
  )
}

export default ProductosCajasPage