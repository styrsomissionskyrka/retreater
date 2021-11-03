import { UrlObject } from 'url';

import { cloneElement, Fragment, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { IconCalendarEvent, IconChevronLeft, IconClipboardList, IconUsers } from '@tabler/icons';
import { useRect } from '@reach/rect';

import { useIsomorphicLayoutEffect, useAuthenticatedUser } from 'lib/hooks';
import { setGlobalVariable } from 'lib/utils/css';
import { compact } from 'lib/utils/array';

import { Link, NavLink } from '../Link';
import { VisuallyHidden } from '../VisuallyHidden';
import { Avatar } from '../Avatar';

export interface NavLinkConfig {
  href: string | UrlObject;
  label: React.ReactNode;
  icon: React.ReactElement;
}

const defaultTitle = 'Styrsö Missionskyrka';

interface Props {
  title?: string;
  headerTitle?: React.ReactNode;
  sidebarTitle?: React.ReactNode;
  subTitle?: React.ReactNode;
  navLinks?: NavLinkConfig[];
  backLink?: string | UrlObject;
  actions?: React.ReactNode;
  shallowLinks?: boolean;
}

export const Admin: React.FC<Props> = ({
  title = defaultTitle,
  headerTitle = title,
  sidebarTitle = headerTitle,
  subTitle,
  navLinks: passedNavLinks,
  backLink,
  actions,
  shallowLinks,
  children,
}) => {
  let navLinks: NavLinkConfig[];
  if (passedNavLinks) {
    navLinks = passedNavLinks;
  } else {
    navLinks = compact([
      { href: '/admin/retreater', label: 'Retreater', icon: <IconCalendarEvent size={16} /> },
      { href: '/admin/bokningar', label: 'Bokningar', icon: <IconClipboardList size={16} /> },
      { href: '/admin/anvandare', label: 'Användare', icon: <IconUsers size={16} /> },
    ]);
  }

  const user = useAuthenticatedUser();
  const headerRef = useRef<HTMLElement>(null);
  const rect = useRect(headerRef, { observe: false });

  useIsomorphicLayoutEffect(() => {
    if (rect != null) setGlobalVariable('--header-height', `${rect.height}px`);
  }, [rect]);

  let headTitle = title === defaultTitle ? title : `${title} | ${defaultTitle}`;

  return (
    <Fragment>
      <Head>
        <title key="title">{headTitle}</title>
      </Head>

      <header ref={headerRef} className="sticky flex items-center top-0 px-4 w-screen h-14 bg-black z-10">
        <Image src="/icon.svg" width={48} height={48} alt="" />
      </header>

      <div className="relative flex flex-row">
        <div
          className="sticky flex flex-col w-1/4 py-8 px-10 border-r border-gray-200 md:w-1/6"
          style={{ top: rect?.height ?? 0, height: `calc(100vh - ${rect?.height ?? 0}px)` }}
        >
          <p className="flex items-center mb-12 text-lg font-medium space-x-2">
            {backLink ? (
              <Link href={backLink ?? '/'} className="-ml-6 hover:text-blue-500">
                <IconChevronLeft size={16} />
                <VisuallyHidden>Gå tillbaka</VisuallyHidden>
              </Link>
            ) : null}
            <span>{sidebarTitle}</span>
          </p>

          <nav aria-label="Primär navigation">
            <ul className="space-y-4">
              {navLinks.map(({ href, label, icon }, index) => (
                <li key={index}>
                  <NavLink
                    href={href}
                    className="flex items-center space-x-2 rounded-md -ml-2 px-2 py-1 hover:bg-black hover:text-white"
                    activeClassName="text-blue-600"
                  >
                    {cloneElement(icon, { style: { flex: 'none' } })}
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center mt-auto space-x-2">
            <Avatar id={user.id ?? ''} image={user.picture ?? undefined} />
            <div className="flex flex-col">
              <Link href={`/admin/anvandare/${encodeURIComponent(user.id)}`} className="text-sm">
                {user.name ?? user.email ?? '-'}
              </Link>
              <Link href="/admin/logout" replace className="text-xs text-red-500 hover:text-red-800">
                Logga ut
              </Link>
            </div>
          </div>
        </div>

        <main className="flex-1 px-8 pt-10 pb-20">
          <div className="flex items-start w-full max-w-4xl mx-auto mb-20">
            <div className="flex items-baseline space-x-4">
              <h1 className="text-4xl font-medium">{headerTitle}</h1>
              {subTitle ? <small className="text-sm text-gray-500">{subTitle}</small> : null}
            </div>
            {actions ? <div className="flex items-center ml-auto space-x-2">{actions}</div> : null}
          </div>

          <div className="relative w-full max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </Fragment>
  );
};
