import React from 'react'
import { checkRole } from '@/actions'

async function administradorPage() {
  await checkRole(0);
  return (
    <div>administradorPage</div>
  )
}

export default administradorPage