import { useState, useMemo } from 'react';
import '../assets/css/select.css';

const SelectBase = ({
  value,
  setValue,
  options,
  placeholder = 'Selectionner',
  placeHolderNodata = 'N/A',
  create,
  multiple = false,
  renderOption,
  getValue,
  getLabel,
  getSelectedLabel
}) => {
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);

  const selectedOptions = useMemo(() => {
    if (multiple) {
      return options.filter((o) => value.includes(getValue(o)));
    } else {
      return options.find((v) => getValue(v) === value) || null;
    }
  }, [value, options, multiple, getValue]);

  const filteredOptions = useMemo(() => {
    return filter ? options.filter((o) => getLabel(o).toLowerCase().includes(filter.toLowerCase())) : options;
  }, [filter, options, getLabel]);

  const handleSelect = (option) => {
    if (multiple) {
      const newValues = value.includes(getValue(option))
        ? value.filter((v) => v !== getValue(option))
        : [...value, getValue(option)];
      setValue(newValues);
    } else {
      setValue(getValue(option));
      setOpen(false);
    }
  };

  const handleRemove = (optionValue) => {
    if (multiple) {
      const newValues = value.filter((v) => v !== optionValue);
      setValue(newValues);
    }
  };

  const handleCreate = () => {
    if (create && filter && !options.some((o) => getLabel(o) === filter)) {
      const newOption = { id: filter, label: filter, image: null };
      options.push(newOption);
      setValue(multiple ? [...value, getValue(newOption)] : getValue(newOption));
      setFilter('');
      setOpen(false);
    }
  };

  return (
    <>
      {open && <div className="main-select-bg" onClick={() => setOpen(false)}></div>}
      <div className="main-select">
        <div className="custom-select-input-wrapper" onClick={() => setOpen(true)}>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={filteredOptions.length > 0 ? placeholder : placeHolderNodata}
            style={{ background: 'transparent', width: '100%' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreate();
                e.preventDefault();
              }
            }}
          />
        </div>
        {multiple && (
          <div className="selected-options">
            {selectedOptions.map((o, i) => (
              <div key={i} className="selected-option">
                {getSelectedLabel(o)}
                <span onClick={() => handleRemove(getValue(o))}>&times;</span>
              </div>
            ))}
          </div>
        )}
        <div className="custom-select-list">
          {open &&
            filteredOptions.map((o, i) => (
              <div key={i} className="SelectItem" onClick={() => handleSelect(o)}>
                {renderOption(o)}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export const SelectCustomObject = ({ value, setValue, options, placeholder, placeHolderNodata, create, multiple }) => {
  return (
    <SelectBase
      value={value}
      setValue={setValue}
      options={options}
      placeholder={placeholder}
      placeHolderNodata={placeHolderNodata}
      create={create}
      multiple={multiple}
      renderOption={(o) => (
        <>
          {o.image && <img src={o.image} />}
          <div>{o.label}</div>
        </>
      )}
      getValue={(o) => o.id}
      getLabel={(o) => o.label}
      getSelectedLabel={(o) => o.label}
    />
  );
};

export const SelectCustomString = ({ value, setValue, options, placeholder, placeHolderNodata, create, multiple }) => {
  return (
    <SelectBase
      value={value}
      setValue={setValue}
      options={options}
      placeholder={placeholder}
      placeHolderNodata={placeHolderNodata}
      create={create}
      multiple={multiple}
      renderOption={(o) => <div>{o}</div>}
      getValue={(o) => o}
      getLabel={(o) => o}
      getSelectedLabel={(o) => o}
    />
  );
};
