import toast, { Toaster as LibToaster } from 'react-hot-toast';

export const Toaster: React.FC = () => {
  return <LibToaster position="top-right" />;
};

export { toast };
