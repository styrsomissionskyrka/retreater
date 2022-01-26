import { Fragment } from 'react';

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

interface TableRadioGroupRowProps {
  label: React.ReactNode;
  name: string;
  options: { value: string; label: React.ReactNode }[];
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const TableRadioGroupRow: React.FC<TableRadioGroupRowProps> = ({ label, name, options, value, onChange }) => {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>
        <fieldset>
          <p>
            {options.map((option, i, self) => (
              <Fragment key={option.value}>
                <label>
                  <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={option.value === value}
                    onChange={onChange}
                  />{' '}
                  {option.label}
                </label>
                {i < self.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        </fieldset>
      </td>
    </tr>
  );
};
