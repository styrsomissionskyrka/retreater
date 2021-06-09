import React, { useState, useRef, useEffect } from 'react';
import MarkdownEditor, { getDefaultToolbarCommands } from 'react-mde';
import { GetIcon } from 'react-mde/lib/definitions/types';
import {
  IconBlockquote,
  IconBold,
  IconCode,
  IconHeading,
  IconItalic,
  IconLink,
  IconList,
  IconListCheck,
  IconListNumbers,
  IconPhoto,
  IconStrikethrough,
} from '@tabler/icons';
import { useResizedTextarea } from 'lib/hooks';
import { Label } from './Ui';
import classes from './Markdown.module.css';
import { useControlledInput, useId } from 'lib/hooks';

type MarkdownProps = {
  value?: string;
  defaultValue?: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
  label: React.ReactNode;
  name?: string;
  id?: string;
};

const Markdown: React.FC<MarkdownProps> = ({ value, defaultValue, onChange, label, name, id }) => {
  const [controlledValue, setControlledValue] = useControlledInput(value, onChange, defaultValue ?? '');
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  const textareaId = useId('markdown-', id);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useResizedTextarea(textareaRef, { minRows: 8 });

  let commands = getDefaultToolbarCommands();

  useEffect(() => {
    let el = textareaRef.current;
    if (el == null) return;

    toggleAttribute(el, 'id', textareaId);
    toggleAttribute(el, 'name', name);
  }, [textareaId, name]);

  return (
    <Label
      htmlFor={textareaId}
      input={
        <MarkdownEditor
          refs={{ textarea: textareaRef }}
          value={controlledValue}
          onChange={setControlledValue}
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
};

export default Markdown;

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
    case 'code':
      return <IconCode {...props} />;
    case 'image':
      return <IconPhoto {...props} />;
    case 'unordered-list':
      return <IconList {...props} />;
    case 'ordered-list':
      return <IconListNumbers {...props} />;
    case 'checked-list':
      return <IconListCheck {...props} />;
  }
  return null;
};

function toggleAttribute(el: HTMLElement, attr: string, value: string | undefined | null) {
  if (value) {
    el.setAttribute(attr, value);
  } else {
    el.removeAttribute(attr);
  }
}
