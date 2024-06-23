import '../assets/css/table.css';

function KuneTable({ rows, columns }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((c) => (
            <th style={c.style}>{c.headerRender ? c.headerRender() : c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows?.map &&
          rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td style={c.style}>{c.render ? c.render(row) : row[c.name]}</td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default KuneTable;
