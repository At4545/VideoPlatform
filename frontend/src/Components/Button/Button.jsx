import React from 'react'

function Button({type="button", className="", children,...props}) {
  return (
    <button
            type={type}
            className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${className}`}
            {...props}
          >
        {children}
    </button>
  )
}

export default Button