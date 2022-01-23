import React from 'react';
import * as components from '@wordpress/components';

declare module '@wordpress/components' {
  namespace Dropdown {
    interface Props {
      popoverProps: any;
    }
  }

  namespace Button {
    interface ButtonProps {
      variant?: string;
    }
  }

  namespace PanelRow {
    interface Props {
      ref?: React.RefObject<HTMLElement>;
    }
  }
}
