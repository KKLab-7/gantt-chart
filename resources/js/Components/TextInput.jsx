import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, name, id, value, required, onChange, placeholder = '', disabled = false, min = '', max = '', onBlur, autoComplete = 'none' }
    , ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            id={id}
            name={name}
            value={value}
            type={type}
            required={required}
            placeholder={placeholder}
            onChange={(e) => onChange(e)}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                className
            }
            autoComplete={autoComplete}
            ref={input}
            disabled={disabled}
            min={min}
            max={max}
            onBlur={onBlur}
        />
    );
});
