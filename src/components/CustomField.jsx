function CustomField({ data, setData, field }) {
  return (
    <input
      id={field.name}
      name={field.name}
      value={data?.[field.name]}
      placeholder={field.placeholder}
      type={field.type}
      onChange={(e) => setData({ ...data, [field.name]: e.target.value })}
    />
  );
}

export default CustomField;
