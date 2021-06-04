import Head from 'next/head';
import Image from 'next/image';
import { Fragment } from 'react';
import { UrlObject } from 'url';
import { IconChevronLeft } from '@tabler/icons';
import { Link } from '../Link';
import { VisuallyHidden } from '../VisuallyHidden';

interface NavLink {
  href: string | UrlObject;
  label: React.ReactNode;
}

const defaultLinks: NavLink[] = [
  { href: '/admin/retreater', label: 'Retreater' },
  { href: '/admin/anvandare', label: 'Användare' },
];

const defaultTitle = 'Styrsö Missionskyrka';

interface Props {
  title?: string;
  navLinks?: NavLink[];
  backLink?: string | UrlObject;
}

export const AdminLayout: React.FC<Props> = ({ title = defaultTitle, navLinks = defaultLinks, backLink, children }) => {
  let headTitle = title === defaultTitle ? title : `${title} | ${defaultTitle}`;

  return (
    <Fragment>
      <Head>
        <title key="title">{headTitle}</title>
      </Head>

      <header className="sticky top-0 w-screen h-14 z-10 flex items-center px-4 bg-black">
        <Image src="/icon.svg" width={48} height={48} />
      </header>

      <div className="relative min-h-screen flex flex-row">
        <section className="sticky top-14 w-1/6 bg-green-50 space-y-4 px-10" style={{ height: 'calc(100vh - 56px)' }}>
          <p className="text-lg font-semibold pt-8 flex items-center space-x-2">
            {backLink ? (
              <Link href={backLink} className="hover:text-blue-500 -ml-6">
                <IconChevronLeft size={16} />
                <VisuallyHidden>Gå tillbaka</VisuallyHidden>
              </Link>
            ) : null}
            <span>{title}</span>
          </p>

          <nav aria-label="Primary navigation">
            <ul>
              {navLinks.map(({ href, label }, index) => (
                <li key={index}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <main className="flex-1 bg-red-50" style={{ height: '200vh' }}>
          {children}
        </main>
      </div>
    </Fragment>
  );
};
