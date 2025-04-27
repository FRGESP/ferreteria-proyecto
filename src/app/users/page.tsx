import React from 'react'
import { checkRole } from '@/actions'
async function UsersPage() {
    await checkRole(0);
  return (
    <div>
      Pagina de usuarios
    </div>
  )
}

export default UsersPage
