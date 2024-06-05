"use client"
import CarPartsForm from '@/components/CarPartsForm'
import React from 'react'
import withAuth from '@/utils/withAuth'
function CarPartsModel() {
  return (
    <div>
        <CarPartsForm />
    </div>
  )
}

export default withAuth(CarPartsModel)