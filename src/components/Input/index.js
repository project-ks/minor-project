import React from 'react'
import "./style.css"

function InputComponent({label, state, setState, placeholder, inputType}) {
  return (
    <div className='input-wrapper'>
        <p className='input-label'>{label}</p>
        <input 
            type={inputType}
            value={state}
            placeholder={placeholder}
            onChange={(e)=>setState(e.target.value)} 
            className='custom-input'
        />
    </div>
  )
}

export default InputComponent