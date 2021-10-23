import { UrlObject } from 'url';

import { cloneElement, Fragment, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { IconCalendarEvent, IconChevronLeft, IconClipboardList, IconUsers } from '@tabler/icons';
import { useRect } from '@reach/rect';

import { useAuthenticatedUser, useIsomorphicLayoutEffect, useUserHasRoles } from 'lib/hooks';
import { setGlobalVariable } from 'lib/utils/css';
import { compact } from 'lib/utils/array';
import { styled } from 'styles/stitches.config';

import { Link, NavLink } from '../Link';
import { VisuallyHidden } from '../VisuallyHidden';

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
  const isAdmin = useUserHasRoles(['admin', 'superadmin']);
  let navLinks: NavLinkConfig[];
  if (passedNavLinks) {
    navLinks = passedNavLinks;
  } else {
    navLinks = compact([
      { href: '/admin/retreater', label: 'Retreater', icon: <IconCalendarEvent size={16} /> },
      { href: '/admin/bokningar', label: 'Bokningar', icon: <IconClipboardList size={16} /> },
      isAdmin ? { href: '/admin/anvandare', label: 'Användare', icon: <IconUsers size={16} /> } : null,
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

      <Header ref={headerRef}>
        <Image src="/icon.svg" width={48} height={48} alt="" />
      </Header>

      <PageWrapper>
        <Sidebar style={{ top: rect?.height ?? 0, height: `calc(100vh - ${rect?.height ?? 0}px)` }}>
          <SidebarTitle>
            {!backLink ? (
              <SidebarBackLink href={backLink ?? '/'}>
                <IconChevronLeft size={16} />
                <VisuallyHidden>Gå tillbaka</VisuallyHidden>
              </SidebarBackLink>
            ) : null}
            <span>{sidebarTitle}</span>
          </SidebarTitle>

          <nav aria-label="Primär navigation">
            <NavList>
              {navLinks.map(({ href, label, icon }, index) => (
                <li key={index}>
                  <SidebarNavLink href={href} shallow={shallowLinks}>
                    {cloneElement(icon, { style: { flex: 'none' } })}
                    <span>{label}</span>
                  </SidebarNavLink>
                </li>
              ))}
            </NavList>
          </nav>

          <Footer>
            <Link href={`/admin/anvandare/${encodeURIComponent(user.sub ?? '')}`}>
              <ProfileImage src={user.picture!} width={32} height={32} alt="" />
            </Link>
            <FooterMeta>
              <FooterLink href={`/admin/anvandare/${encodeURIComponent(user.sub ?? '')}`}>
                {user.name ?? user.email}
              </FooterLink>
              <FooterSignOutLink href="/admin/logout" replace>
                Logga ut
              </FooterSignOutLink>
            </FooterMeta>
          </Footer>
        </Sidebar>

        <Main>
          <MainHeader>
            <TitleWrapper>
              <PageTitle>{headerTitle}</PageTitle>
              {subTitle ? <SubTitle>{subTitle}</SubTitle> : null}
            </TitleWrapper>
            {actions ? <Actions>{actions}</Actions> : null}
          </MainHeader>

          <Content>{children}</Content>
        </Main>
      </PageWrapper>
    </Fragment>
  );
};

const Header = styled('header', {
  position: 'sticky',
  display: 'flex',
  alignItems: 'center',
  top: '0',
  px: '$4',
  width: '100vw',
  height: '$14',
  background: '$black',
  zIndex: '$10',
});

const PageWrapper = styled('div', {
  position: 'relative',
  display: 'flex',
  flexFlow: 'row nowrap',
});

const Main = styled('main', {
  flex: '1 1 0%',
  px: '$8',
  paddingTop: '$10',
  paddingBottom: '$20',
});

const Content = styled('div', {
  position: 'relative',
  width: '100%',
  maxWidth: '$max4xl',
  mx: 'auto',
});

const MainHeader = styled('div', {
  display: 'flex',
  alignItems: 'start',
  width: '100%',
  maxWidth: '$max4xl',
  mx: 'auto',
  marginBottom: '$20',
});

const TitleWrapper = styled('div', {
  display: 'flex',
  alignItems: 'baseline',
  spaceX: '$4',
});

const PageTitle = styled('h1', {
  text: '$4xl',
  fontWeight: '$medium',
});

const SubTitle = styled('small', {
  text: '$sm',
  color: '$gray500',
});

const Actions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
  spaceX: '$2',
});

const Sidebar = styled('div', {
  position: 'sticky',
  display: 'flex',
  flexFlow: 'column nowrap',
  width: '$1/4',
  py: '$8',
  px: '$10',
  borderRight: '1px solid $gray200',
  '@md': { width: '$1/6' },
});

const SidebarTitle = styled('p', {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '$12',
  text: '$lg',
  fontWeight: '$medium',
  spaceX: '$2',
});

const SidebarBackLink = styled(Link, {
  marginLeft: 'calc($6 * -1)',
  '&:hover': {
    color: '$blue500',
  },
});

const NavList = styled('ul', {
  spaceY: '$4',
});

const SidebarNavLink = styled(NavLink, {
  display: 'flex',
  alignItems: 'center',
  spaceX: '$2',
  borderRadius: '$md',
  marginLeft: 'calc($2 * -1)',
  px: '$2',
  py: '$1',

  '&:hover': {
    background: '$black',
    color: '$white !important',
  },

  '&[data-active="true"]': {
    color: '$blue600',
  },
});

const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginTop: 'auto',
  spaceX: '$2',
});

const ProfileImage = styled(Image, { borderRadius: '$full' });

const FooterMeta = styled('div', { display: 'flex', flexFlow: 'column nowrap' });

const FooterLink = styled(Link, {
  text: '$sm',
  '&:hover': { color: '$blue500' },
});

const FooterSignOutLink = styled(Link, {
  text: '$xs',
  color: '$red500',
  '&:hover': { color: '$red800' },
});
