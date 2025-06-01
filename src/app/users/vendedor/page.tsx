import React from 'react'
import { checkRole } from '@/actions'

async function vendedorPage() {
  await checkRole(0);
  return (
    <div>vendedorPage</div>
  )
}

export default vendedorPage