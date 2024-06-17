function CustomField({ data, setData, field }) {
  return (
    <input
      id={field.name}
      name={field.name}
      value={getData(data, field)}
      placeholder={field.placeholder}
      type={field.type}
      onChange={(e) => setData({ ...data, [field.name]: e.target.value })}
    />
  );
}

function getData(data, field) {
  if (field?.type === "date") {
    const newVal =
      data && data[field.name] ? data?.[field.name]?.split("T")[0] : undefined;
    return newVal;
  }
  return data?.[field.name];
}

export default CustomField;
