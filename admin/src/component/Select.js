import React from 'react';

const Select = props => {
  return (
    <div className="form-group">
      <label htmlFor={props.name}> {props.title} </label>
      <select
        multiple={false}
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
      >
        <option value="" disabled>
          {props.placeholder}
        </option>

        {props.options &&
          props.options.map(option => {
            return (
              <option
                key={option.id}
                value={option.id}
                label={option.name}
              >
                {option.name}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default Select;
