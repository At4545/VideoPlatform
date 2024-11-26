import React from 'react'

function Label({htmlFor="",className="",children}) {
  return (
<label htmlFor="email" className={`block text-sm/6 font-medium text-gray-900 ${ className}`}>
          {  children}
          </label>
  )
}

export default Label