import React, { useState, useRef } from 'react';
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

import classes from './Markdown.module.css';
import { useResizedTextarea } from 'lib/hooks';

type MarkdownProps = { initialValue?: string | null };

const Markdown: React.FC<MarkdownProps> = ({ initialValue }) => {
  const [value, setValue] = useState(initialValue ?? '');
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useResizedTextarea(textareaRef, { minRows: 8 });

  let commands = getDefaultToolbarCommands();

  return (
    <div>
      <MarkdownEditor
        refs={{ textarea: textareaRef }}
        value={value}
        onChange={setValue}
        selectedTab={tab}
        onTabChange={setTab}
        generateMarkdownPreview={(source) => Promise.resolve(source)}
        classes={classes}
        toolbarCommands={commands}
        getIcon={getIcon}
      />
    </div>
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
