import React from 'react'

const InputForm = ({ htmlFor, labelText, type, name, value, handleChange, placeholder }) => {
    return (<>
        <div>

            <label htmlFor={htmlFor} className='form-label'>
                {labelText}
            </label>
            <input type={type}
                className="form-items"
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder} />

        </div>
    </>)
}

export default InputForm