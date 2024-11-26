import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default function DropDown() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-13 h-13 justify-center items-center gap-x-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900  hover:bg-gray-50">
          <img  src="https://img.icons8.com/?size=40&id=NJ5xYwFBHPd9&format=png&color=000000" alt="" />
          {/* <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" /> */}
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          <MenuItem>
           <div className='flex justify-start items-center gap-2'> 
                <div className='w-5 ml-2'><img className='w-5 h-5' src="https://img.icons8.com/?size=100&id=VV02ChcwaAyv&format=png&color=000000" alt="" /></div>
                <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
            >
              Upload Videos
            </a>
           </div>
          </MenuItem>
          <MenuItem>
            <div className='flex justify-start items-center gap-2'> 
            <div className='w-5 ml-2 '><img className='w-5 h-5' src="https://img.icons8.com/?size=100&id=6697&format=png&color=000000" alt="" /></div>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
            >
              Post Tweet
            </a>
            </div>
          </MenuItem>
        </div>
       
      </MenuItems>
    </Menu>
  )
}
