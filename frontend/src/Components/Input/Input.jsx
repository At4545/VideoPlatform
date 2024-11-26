import React, { useId } from 'react'

//while working with react-hook form 
// 1. first give the name="password" attribut(name should be same as mention in register()) in the Custom made Input
// 2. then in child(this componeent ) also pass [...prop] to the input element to add some funcitons send by register





const Input= React.forwardRef(function Input(
    {
        label,
        type="text",
        classname="",
        ...props
    },ref
){
    const id = useId()
    return (
        <div className='w-full'>
            {label && <label className='inline-block mb-1 pl-1' htmlFor={id}>{label}</label>}
            <input type={type} id={id} autoComplete='on'
             className={` border px-2 py-2 rounded-lg text-black outline-none focus:bg-gray-200 w-full  ${classname}`} {...props} ref={ref} />
        </div>
    )
})

export default Input