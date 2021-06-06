import { Fragment, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { UrlObject } from 'url';
import { IconChevronLeft } from '@tabler/icons';
import { useRect } from '@reach/rect';
import { Link, NavLink } from '../Link';
import { VisuallyHidden } from '../VisuallyHidden';
import { useAuthenticatedUser } from 'lib/hooks';

export interface NavLinkConfig {
  href: string | UrlObject;
  label: React.ReactNode;
  icon: React.ReactElement;
}

const defaultTitle = 'Styrsö Missionskyrka';

interface Props {
  title?: string;
  navLinks?: NavLinkConfig[];
  backLink?: string | UrlObject;
}

export const AdminLayout: React.FC<Props> = ({ title = defaultTitle, navLinks = [], backLink, children }) => {
  const user = useAuthenticatedUser();
  const headerRef = useRef<HTMLElement>(null);
  const rect = useRect(headerRef, { observe: false });

  let headTitle = title === defaultTitle ? title : `${title} | ${defaultTitle}`;

  return (
    <Fragment>
      <Head>
        <title key="title">{headTitle}</title>
      </Head>

      <header className="sticky top-0 w-screen h-14 z-10 flex items-center px-4 bg-black" ref={headerRef}>
        <Image src="/icon.svg" width={48} height={48} />
      </header>

      <div className="relative min-h-screen flex flex-row">
        <div
          className="sticky w-1/6 flex flex-col py-8 px-10 border-r border-gray-200"
          style={{ top: rect?.height ?? 0, height: `calc(100vh - ${rect?.height ?? 0}px)` }}
        >
          <p className="text-lg font-semibold mb-12 flex items-center space-x-2">
            {backLink ? (
              <Link href={backLink} className="hover:text-blue-500 -ml-6">
                <IconChevronLeft size={16} />
                <VisuallyHidden>Gå tillbaka</VisuallyHidden>
              </Link>
            ) : null}
            <span>{title}</span>
          </p>

          <nav aria-label="Primär navigation">
            <ul className="space-y-4">
              {navLinks.map(({ href, label, icon }, index) => (
                <li key={index}>
                  <NavLink
                    href={href}
                    className="flex space-x-2 items-center hover:text-blue-500"
                    activeClassName="text-blue-600"
                  >
                    {icon}
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex items-center space-x-2">
            <Link href={`/admin/anvandare/${user.sub}`}>
              <Image src={user.picture!} width={32} height={32} className="rounded-full" />
            </Link>
            <div className="flex flex-col">
              <Link href={{ pathname: `/admin/anvandare/${user.sub}` }} className="text-sm hover:text-blue-500">
                {user.name ?? user.email}
              </Link>
              <Link href="/admin/logout" className="text-xs text-red-500 hover:text-red-800" replace>
                Logga ut
              </Link>
            </div>
          </div>
        </div>

        <main className="flex-1" style={{ height: '200vh' }}>
          {children}
        </main>
      </div>
    </Fragment>
  );
};

// briefcase
// building-church
// calendar-event
