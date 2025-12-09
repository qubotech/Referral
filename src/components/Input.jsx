import './Input.css';

const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error = null,
    ...props
}) => {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`form-input ${error ? 'form-input-error' : ''}`}
                required={required}
                {...props}
            />
            {error && <span className="form-error">{error}</span>}
        </div>
    );
};

export default Input;
