import { AppProps } from 'next/app';
import { NextPage, NextComponentType, NextPageContext } from 'next';

export type ExtendedNextPage<P = {}, IP = P> = NextPage<P, IP> & {
  wrapper?: React.ComponentType;
};

export type ExtendedNextComponentType<P = {}> = NextComponentType<NextPageContext, any, P> & {
  wrapper?: React.ComponentType;
};

export interface ExtendedAppProps<P = {}> extends AppProps<P> {
  Component: ExtendedNextComponentType<P>;
}
