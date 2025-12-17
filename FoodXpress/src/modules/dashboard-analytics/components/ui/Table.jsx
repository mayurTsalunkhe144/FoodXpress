function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-slate-700/50 ${className}`}>
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  )
}

function TableHeader({ children }) {
  return (
    <thead className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50">
      {children}
    </thead>
  )
}

function TableBody({ children }) {
  return <tbody>{children}</tbody>
}

function TableRow({ children, className = '', onClick }) {
  return (
    <tr
      className={`border-b border-slate-700/30 hover:bg-slate-800/40 transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

function TableHead({ children, className = '' }) {
  return (
    <th className={`px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  )
}

function TableCell({ children, className = '' }) {
  return (
    <td className={`px-6 py-4 text-sm text-slate-300 ${className}`}>
      {children}
    </td>
  )
}

Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.Head = TableHead
Table.Cell = TableCell

export default Table
