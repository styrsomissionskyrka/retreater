import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';
import { Fragment, useMemo } from 'react';

import { Link } from '../Link';

export type Replacements = Partial<{
  [Key in keyof JSX.IntrinsicElements]:
    | React.FC<JSX.IntrinsicElements[Key]>
    | false;
}>;

interface Props {
  html?: string | null;
  replacements?: Replacements;
}

let defaultReplacements: Replacements = {
  strong({ children, ...props }) {
    return <strong {...props}>{children}</strong>;
  },
  em({ children, ...props }) {
    return <em {...props}>{children}</em>;
  },
  a({ children, href = '', ...props }) {
    try {
      let url = new URL(href);
      return (
        <Link href={url.toString().replace(url.origin, '')}>{children}</Link>
      );
    } catch (error) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
  },
};

function createReplaceOptions(
  replacements: Replacements = {},
): HTMLReactParserOptions {
  let replace = { ...defaultReplacements, ...replacements };
  return {
    replace(node) {
      if ('name' in node && 'children' in node && node.name in replace) {
        let Component = replace[node.name as keyof JSX.IntrinsicElements]!;
        if (Component === false) return <Fragment />;

        return (
          <Component {...node.attribs}>
            {domToReact(node.children, createReplaceOptions(replacements))}
          </Component>
        );
      }
    },
  };
}

export const HTML: React.FC<Props> = ({ html, replacements: replace }) => {
  let dom = useMemo(() => {
    if (html == null || html === '') return null;
    return parse(html, createReplaceOptions(replace));
  }, [html, replace]);

  return <Fragment>{dom}</Fragment>;
};
