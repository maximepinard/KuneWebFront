import { useState } from 'react';
import Switch from './switch';

function CustomField({ data, setData, field, debounce, disabled = false }) {
  const [localValue, setLocalValue] = useState(getData(data, field));
  // Define the common props for the input element
  const inputProps = {
    id: field.name,
    name: field.name,
    placeholder: field.placeholder,
    type: field.type,
    step: field?.step,
    onChange: (e) => !disabled && outPutData(e, data, field, setData, setLocalValue),
    disabled: disabled
  };

  if (field.InputType === 'label-group') {
    return (
      <div className="fullwidth separator">
        <label>{field.title}</label>
      </div>
    );
  }

  if (field.type === 'switch') {
    return (
      <Switch
        {...inputProps}
        value={getData(data, field)}
        setValue={() => !disabled && setData({ ...data, [field.name]: !data[field.name] })}
      />
    );
  }

  if (field.isValueOnlyDefault) {
    return <input {...inputProps} defaultValue={getData(data, field) ?? ''} />;
  }
  return <input {...inputProps} value={getData(data, field) ?? ''} />;
}

function outPutData(e, data, field, setData, setLocalValue) {
  let value = e.target.value;
  if (field && field.formatOutput) {
    value = field.formatOutput(value);
  }
  setData({ ...data, [field.name]: value });
  setLocalValue(value);
}

function getData(data, field) {
  if (field?.type === 'date') {
    const newVal = data && data[field.name] ? data?.[field.name]?.split('T')[0] : undefined;
    return newVal;
  }
  if (field.formatInput && data && data[field.name] !== null && data[field.name] !== undefined) {
    return field.formatInput(data[field.name]);
  }
  return data?.[field.name];
}

export default CustomField;
