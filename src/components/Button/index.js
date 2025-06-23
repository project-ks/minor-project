import React from 'react'
import "./style.css"

function Button({text, onBtnClick, blue, btnDisabled}) {
  return (
    <div className={blue?"btn btn-blue":'btn'} onClick={onBtnClick} disabled={btnDisabled}>{text}</div>
  )
}

export default Button