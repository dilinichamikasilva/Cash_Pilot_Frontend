import React , { type JSX } from "react"

type MenuItemProps = {
    icon: JSX.Element
    label:string
    open:boolean
}

export default function MenuItem({icon , label , open} : MenuItemProps): JSX.Element {
    return (
        <div className="flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 hover:shadow-md transition-all">
            <div className="w-6 h-6 text-indigo-600">{icon}</div>
            {open && <span className="text-slate-700">{label}</span>}
        </div>    
    )
}