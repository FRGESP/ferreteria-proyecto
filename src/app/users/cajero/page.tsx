import React from 'react'
import { checkRole } from '@/actions'


async function cajeroPage() {
  await checkRole(0);
  return (
    <div>cajeroPage</div>
  )
}

export default cajeroPage