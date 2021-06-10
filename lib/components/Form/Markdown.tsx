import React, { useState, useRef, useEffect, forwardRef } from 'react';
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
import { useIsomorphicLayoutEffect, useResizedTextarea } from 'lib/hooks';
import { useId } from 'lib/hooks';
import { useProxyRefObject } from 'lib/utils/refs';
import { setAttribute, toggleAttribute } from 'lib/utils/dom';
import { Label } from './Ui';
import classes from './Markdown.module.css';

export interface MarkdownProps {
  value?: string;
  defaultValue?: string;
  onChange?: (next: string) => void;
  onBlur?: (event: FocusEvent) => void;
  label: React.ReactNode;
  name?: string;
  id?: string;
  required?: boolean;
}

export const Markdown = forwardRef<HTMLTextAreaElement, MarkdownProps>(
  ({ value, defaultValue, onChange, label, name, id, required, onBlur }, ref) => {
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
      toggleAttribute(el, 'required', required);

      return () => {
        if (onBlur) el.removeEventListener('blur', onBlur);
      };
    }, [textareaId, name, required, onBlur, onChange, textareaRef]);

    let commands: ToolbarCommands = [
      ['header', 'bold', 'italic', 'strikethrough'],
      ['unordered-list', 'ordered-list'],
      ['link', 'quote', 'image'],
    ];

    return (
      <Label
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
