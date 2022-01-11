import { GetServerSideProps, GetServerSidePropsContext, PreviewData } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { ParsedUrlQuery } from 'querystring';

export function authenticatedGetServerSideProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(handler: GetServerSideProps<P, Q, D>): GetServerSideProps<P & { session: Session }, Q, D> {
  return async (context) => {
    let session = await getSession({ req: context.req });

    if (session == null) {
      return {
        redirect: {
          statusCode: 307,
          destination: getSignInPath(context),
        },
      };
    }

    let handlerResult = await handler(context);
    if ('props' in handlerResult) {
      return {
        props: {
          ...(await maybePromise(handlerResult.props)),
          session,
        },
      };
    }

    return handlerResult;
  };
}

async function maybePromise<T>(value: T | Promise<T>): Promise<T> {
  let res = await value;
  return res;
}

function getSignInPath(context: GetServerSidePropsContext) {
  let callbackUrl = new URL(context.resolvedUrl, process.env.NEXTAUTH_URL!);
  let signInUrl = new URL('/api/auth/signin', process.env.NEXTAUTH_URL!);
  signInUrl.searchParams.set('callbackUrl', callbackUrl.toString());
  return `${signInUrl.pathname}${signInUrl.search}`;
}
