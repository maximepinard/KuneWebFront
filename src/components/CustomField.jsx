function CustomField({ data, setData, field }) {
  if (field.InputType === 'label-group') {
    return (
      <div className="fullwidth separator">
        <label>{field.title}</label>
      </div>
    );
  }
  return (
    <input
      id={field.name}
      name={field.name}
      value={getData(data, field) ?? ''}
      placeholder={field.placeholder}
      type={field.type}
      onChange={(e) => outPutData(e, data, field, setData)}
      step={field?.step}
    />
  );
}

function outPutData(e, data, field, setData) {
  let value = e.target.value;
  if (field && field.formatOutput) {
    value = field.formatOutput(value);
  }
  setData({ ...data, [field.name]: value });
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
