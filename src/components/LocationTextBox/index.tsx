import { FC, useRef } from "react";
import { HiXMark } from "react-icons/hi2";

const LocationTextBox:FC<{inputProps: React.InputHTMLAttributes<HTMLInputElement>, error?:string, reset?:()=>unknown, label:string, name:string}> = ({inputProps, error,reset, label, name}) => {
  //TODO: location auto complete
  const inputRef = useRef<HTMLInputElement>(null);
  return <div className="flex flex-col w-full">
    <span className="w-full relative mt-2">
      <label htmlFor={"input-"+name} className="top-0 absolute -translate-y-full text-xs ">{label}</label>
      <input ref={inputRef} id={"input-"+name} type="text" className="w-full rounded-md ring-base-500 ring-1 focus:ring-primary-500 focus:ring-2 focus:outline-none px-2 py-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
        {...inputProps} />
      <button  type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={()=>{reset?.()}} disabled={inputProps.disabled}><HiXMark className="w-icon h-icon"/> </button>
    </span>
    {error?
      <span className="text-xs text-error-500">{error}</span>:<>
      </>}
  </div>
};

export default LocationTextBox;