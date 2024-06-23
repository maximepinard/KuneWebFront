import '../assets/css/table.css';

function KuneTable({ rows, columns }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={'head_' + i} style={c.style}>
              {c.headerRender ? c.headerRender() : c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows?.map &&
          rows.map((row, i) => (
            <tr key={'row' + i}>
              {columns.map((c, j) => (
                <td key={`cell ${j}`} style={c.style}>
                  {c.render ? c.render(row) : row[c.name]}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default KuneTable;
