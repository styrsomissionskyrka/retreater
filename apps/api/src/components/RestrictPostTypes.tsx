import { Fragment } from 'react';

import { useAttribute } from '../utils/data';

interface RestrictPostTypesProps {
  types: string | string[];
}

export const RestrictPostTypes: React.FC<RestrictPostTypesProps> = ({ types, children }) => {
  let typesArr = Array.isArray(types) ? types : [types];
  let [type] = useAttribute('type');

  if (typesArr.includes(type)) return <Fragment>{children}</Fragment>;
  return null;
};
