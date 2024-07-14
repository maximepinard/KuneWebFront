import React, { useState, useMemo } from 'react';
import '../assets/css/table.css';

// Utility function to get the column key
const getColumnKey = (column) => column.name || column.label;

function KuneTable({ rows, columns, setSelectedRows, selectedRows, select }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState('');

  const handleRowSelect = (rowId) => {
    const isSelected = selectedRows.includes(rowId);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  const getCellValue = (row, column) => {
    return column.render ? column.render(row) : row[column.name] || '';
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return rows;

    const column = columns.find((col) => getColumnKey(col) === sortConfig.key);
    if (!column) return rows;

    return [...rows].sort((a, b) => {
      const aValue = getCellValue(a, column);
      const bValue = getCellValue(b, column);
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig, columns]);

  const requestSort = (col) => {
    const key = getColumnKey(col);
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredRows = useMemo(() => {
    if (!searchTerm) return sortedRows;
    return sortedRows.filter((row) =>
      columns.some((column) => String(getCellValue(row, column)).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedRows, columns, searchTerm]);

  const selectAllRows = (checked) => {
    setSelectedRows(checked ? rows.map((row) => row.id) : []);
  };

  return (
    <div>
      <form style={{ margin: '1px', marginBottom: '2px' }}>
        <input
          type="text"
          placeholder="Recherche..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            e.preventDefault();
          }}
        />
      </form>
      <table>
        <thead>
          <tr>
            {select && (
              <th key="select-all">
                <input
                  type="checkbox"
                  onChange={(e) => selectAllRows(e.target.checked)}
                  checked={selectedRows.length === rows.length}
                />
              </th>
            )}
            {columns.map((col, index) => (
              <th key={getColumnKey(col) || index} style={col.style} onClick={() => requestSort(col)}>
                {col.headerRender ? col.headerRender() : col.label}
                {sortConfig.key === getColumnKey(col) && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} onClick={() => select && handleRowSelect(row.id)}>
              {select && (
                <td key={`select-${rowIndex}`}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                  />
                </td>
              )}
              {columns.map((col, colIndex) => (
                <td key={`${row.id}-${getColumnKey(col)}-${colIndex}`} style={col.style}>
                  {getCellValue(row, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KuneTable;
