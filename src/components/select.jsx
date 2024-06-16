import { useState, useMemo } from 'react';
import '../assets/css/select.css';

const SelectCustom = ({
  value,
  setValue,
  options,
  placeholder = 'Selectionner',
  placeHolderNodata = 'N/A',
  create
}) => {
  const [filter, setFilter] = useState();
  const [open, setOpen] = useState(false);
  const option = options.find((v) => v.id == value);

  const filteredOptions = useMemo(() => {
    return filter ? options.filter((o) => o.label && o.label.toLowerCase().includes(filter.toLowerCase())) : options;
  }, [filter, options]);

  return (
    <>
      {open && <div className="main-select-bg" onClick={() => setOpen(false)}></div>}
      <div className="main-select">
        <div className="custom-select-input-wrapper" onClick={() => setOpen(true)}>
          <input
            value={option?.label || filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={filteredOptions.length > 0 ? placeholder : placeHolderNodata}
            style={{ background: 'transparent', width: '100%' }}
            focus={true}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && create) {
                setOpen(false);
                setValue(filter);
                setFilter('');
                e.preventDefault();
              }
            }}
          />
        </div>
        <div className="custom-select-list">
          {open &&
            filteredOptions.map &&
            filteredOptions.map((o, i) => (
              <div
                key={i}
                className="SelectItem"
                onClick={() => {
                  setValue(o.id);
                  setOpen(false);
                }}
              >
                {o.image && <img src={o.image} />}
                <div>{o.label}</div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default SelectCustom;
