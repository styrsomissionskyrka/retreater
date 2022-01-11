import { NextPage } from 'next';

import { authenticated } from 'lib/auth/page';
import { authenticatedGetServerSideProps } from 'lib/auth/ssr';

interface Props {
  name: string;
}

export const Admin: NextPage<Props> = ({ name }) => {
  return <p>{name}</p>;
};

export default authenticated(Admin);

export const getServerSideProps = authenticatedGetServerSideProps<Props>(async (context) => {
  return { props: { name: 'Foo' } };
});
