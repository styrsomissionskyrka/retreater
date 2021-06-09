import React, { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
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
import { sharedRef } from 'lib/utils/shared-ref';
import { ChangeHandler, UseFormRegisterReturn } from 'react-hook-form';

type MarkdownProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (next: string) => void;
  onBlur?: (event: FocusEvent) => void;
  label: React.ReactNode;
  name?: string;
  id?: string;
  required?: boolean;
};

export const Markdown = forwardRef<HTMLTextAreaElement, MarkdownProps>(
  ({ value, defaultValue, onChange, label, name, id, required, onBlur }, ref) => {
    const [controlledValue, setControlledValue] = useControlledInput(value, defaultValue ?? '');
    const [tab, setTab] = useState<'write' | 'preview'>('write');

    const textareaId = useId('markdown-', id);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useResizedTextarea(textareaRef, { minRows: 8 });

    let commands = getDefaultToolbarCommands();

    useEffect(() => {
      if (textareaRef.current == null) return;
      let el = textareaRef.current;

      if (onBlur) el.addEventListener('blur', onBlur);

      toggleAttribute(el, 'id', textareaId);
      toggleAttribute(el, 'name', name);
      toggleAttribute(el, 'required', name);
      el.toggleAttribute('required', required);

      return () => {
        if (onBlur) el.removeEventListener('blur', onBlur);
      };
    }, [textareaId, name, required, onBlur, onChange]);

    const handleChange = (value: string) => {
      setControlledValue(value);
      if (onChange != null) onChange(value);
    };

    fakeRefHandler(textareaRef, ref);
    return (
      <Label
        htmlFor={textareaId}
        input={
          <MarkdownEditor
            refs={{ textarea: textareaRef }}
            value={controlledValue}
            onChange={handleChange}
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

export function useWrapMarkdownRegister({
  onChange: _onChange,
  ...props
}: UseFormRegisterReturn): UseFormRegisterReturn {
  const onChange: ChangeHandler = useCallback(
    async (next) => {
      _onChange({ target: { value: next } });
    },
    [_onChange],
  );

  return { ...props, onChange };
}

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

function fakeRefHandler<T>(ref: React.RefObject<T>, forwardedRef: React.ForwardedRef<T>) {
  if (forwardedRef == null) return;
  if (typeof forwardedRef === 'function') {
    forwardedRef(ref.current);
  } else if ('current' in forwardedRef) {
    forwardedRef.current = ref.current;
  }
}
