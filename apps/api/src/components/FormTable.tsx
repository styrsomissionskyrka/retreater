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
  description?: React.ReactNode;
}

export const TableInputRow: React.FC<TableInputRowProps & JSX.IntrinsicElements['input']> = ({
  label,
  description,
  ...props
}) => {
  let _id = props.id ?? props.name;

  return (
    <tr>
      <th scope="row">
        <label htmlFor={_id}>{label}</label>
      </th>
      <td>
        <input
          {...props}
          className="regular-text"
          aria-describedby={description != null ? `${_id}-description` : undefined}
        />
        {description != null ? (
          <p className="description" id={`${_id}-description`}>
            {description}
          </p>
        ) : null}
      </td>
    </tr>
  );
};

interface TableRadioGroupRowProps {
  options: { value: string; label: React.ReactNode }[];
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
}

export const TableRadioGroupRow: React.FC<
  TableRadioGroupRowProps & Omit<JSX.IntrinsicElements['input'], 'type' | 'value'>
> = ({ value, options, label, description, ...props }) => {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>
        <fieldset>
          <p>
            {options.map((option, i, self) => (
              <Fragment key={option.value}>
                <label>
                  <input type="radio" value={option.value} checked={option.value === value} {...props} /> {option.label}
                </label>
                {i < self.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
          {description != null ? <p className="description">{description}</p> : null}
        </fieldset>
      </td>
    </tr>
  );
};
