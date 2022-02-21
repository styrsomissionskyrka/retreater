import * as components from '@wordpress/components';
import React from 'react';

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

  namespace FormTokenField {
    interface Props {
      label?: React.ReactNode;
      messages?: any;
    }
  }
}
