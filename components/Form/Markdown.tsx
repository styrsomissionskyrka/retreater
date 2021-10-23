import { useState, useRef, useEffect, forwardRef } from 'react';
import MarkdownEditor from 'react-mde';
import { GetIcon, ToolbarCommands } from 'react-mde/lib/definitions/types';
import {
  IconBlockquote,
  IconBold,
  IconHeading,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconPhoto,
  IconStrikethrough,
} from '@tabler/icons';

import { useIsomorphicLayoutEffect, useResizedTextarea, useId, useProxyRefObject } from 'lib/hooks';
import { setAttribute, toggleAttribute } from 'lib/utils/dom';
import { css } from 'styles/stitches.config';

import { Label } from './Controls';

export interface MarkdownProps {
  value?: string;
  defaultValue?: string;
  onChange?: (next: string) => void;
  onBlur?: (event: FocusEvent) => void;
  label: React.ReactNode;
  name?: string;
  id?: string;
  required?: boolean;
  error?: React.ReactNode;
}

export const Markdown = forwardRef<HTMLTextAreaElement, MarkdownProps>(
  ({ value, defaultValue, onChange, label, name, id, required, onBlur, error }, ref) => {
    const [tab, setTab] = useState<'write' | 'preview'>('write');

    const textareaId = useId('markdown-', id);
    const textareaRef = useProxyRefObject<HTMLTextAreaElement>(null, ref);
    useResizedTextarea(textareaRef, { minRows: 8 });

    const hasSetDefaultValue = useRef(defaultValue == null);
    useIsomorphicLayoutEffect(() => {
      if (textareaRef.current == null) return;
      if (hasSetDefaultValue.current) return;
      textareaRef.current.innerText = defaultValue ?? '';
      hasSetDefaultValue.current = true;
    }, [defaultValue, textareaRef]);

    useEffect(() => {
      if (textareaRef.current == null) return;
      let el = textareaRef.current;

      if (onBlur) el.addEventListener('blur', onBlur);

      setAttribute(el, 'id', textareaId);
      setAttribute(el, 'name', name);
      setAttribute(el, 'required', name);
      setAttribute(el, 'aria-invalid', error != null ? 'true' : undefined);
      toggleAttribute(el, 'required', required);

      return () => {
        if (onBlur) el.removeEventListener('blur', onBlur);
      };
    }, [textareaId, name, required, onBlur, onChange, textareaRef, error]);

    let commands: ToolbarCommands = [
      ['header', 'bold', 'italic', 'strikethrough'],
      ['unordered-list', 'ordered-list'],
      ['link', 'quote', 'image'],
    ];

    const classes = {
      // ...styles,
      reactMde: reactMde({ invalid: error != null }).toString(),
      toolbar: toolbar().toString(),
      textArea: textArea().toString(),
      preview: preview().toString(),
      suggestionsDropdown: suggestionsDropdown().toString(),
    };

    console.log(classes);

    return (
      <Label
        error={error}
        htmlFor={textareaId}
        input={
          <MarkdownEditor
            refs={{ textarea: textareaRef }}
            value={value}
            onChange={onChange}
            selectedTab={tab}
            onTabChange={setTab}
            generateMarkdownPreview={(source) => Promise.resolve(source)}
            classes={classes}
            toolbarCommands={commands}
            getIcon={getIcon}
          />
        }
      >
        {label}
      </Label>
    );
  },
);

Markdown.displayName = 'Markdown';

const getIcon: GetIcon = (name) => {
  let props = { size: 18 };
  switch (name) {
    case 'header':
      return <IconHeading {...props} />;
    case 'bold':
      return <IconBold {...props} />;
    case 'italic':
      return <IconItalic {...props} />;
    case 'strikethrough':
      return <IconStrikethrough {...props} />;
    case 'link':
      return <IconLink {...props} />;
    case 'quote':
      return <IconBlockquote {...props} />;
    // case 'code':
    //   return <IconCode {...props} />;
    case 'image':
      return <IconPhoto {...props} />;
    case 'unordered-list':
      return <IconList {...props} />;
    case 'ordered-list':
      return <IconListNumbers {...props} />;
    // case 'checked-list':
    //   return <IconListCheck {...props} />;
    default:
      return null;
  }
};

const reactMde = css({
  border: '1px solid $black',
  borderRadius: '$md',
  width: '100%',

  '&:focus-within': { outline: '$black' },

  '& .invisible': {
    display: 'hidden',
  },

  variants: {
    invalid: {
      true: {
        borderWidth: '2px',
        borderColor: '$red500',
      },
    },
  },
});

const toolbar = css({
  borderBottom: '1px solid black',
  spaceX: '$8',
  roundedTop: '$md',
  backgroundColor: '$white',
  position: 'sticky',
  top: 'var(--header-height)',
  display: 'flex',
  alignItems: 'center',

  '& .mde-tabs button': {
    padding: '$3',
    lineHeight: 1,
  },
  '& .mde-tabs button:hover, & .mde-tabs button.selected': {
    backgroundColor: '$gray200',
  },

  '& .mde-header-group': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .mde-header-group .mde-header-item button': {
    padding: '$3',
    display: 'flex',
    alignItems: 'center',
  },
  '& .mde-header-group .mde-header-item button:hover': {
    backgroundColor: '$gray200',
  },
});

const textArea = css({
  borderRadius: '$md',
  padding: '$3',
  display: 'block',
  width: '100%',
  margin: 0,
  border: 0,
  tabSize: '4',
  resize: 'none',
  overflowY: 'auto',
  minHeight: '$48',

  '&:focus': {
    outline: 'none',
  },
});

const preview = css({});
const suggestionsDropdown = css({});
