export const Table: React.FC = ({ children }) => {
  return (
    <table className="form-table" role="presentation">
      <tbody>{children}</tbody>
    </table>
  );
};

export interface TableInputRowProps {
  label: React.ReactNode;
}

export const TableInputRow: React.FC<TableInputRowProps & JSX.IntrinsicElements['input']> = ({ label, ...props }) => {
  let _id = props.id ?? props.name;

  return (
    <tr>
      <th scope="row">
        <label htmlFor={_id}>{label}</label>
      </th>
      <td>
        <input {...props} className="regular-text" />
      </td>
    </tr>
  );
};
