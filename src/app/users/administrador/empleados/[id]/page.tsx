import React from 'react'
import { checkRole } from '@/actions'

interface ClienteIdpageProps {
    params: {
        id: string;
    }
}

async function ClienteIdpage({ params }: ClienteIdpageProps) {
    await checkRole(0);
  return (
    <div>ClienteIdpage {params.id}</div>
  )
}

export default ClienteIdpage