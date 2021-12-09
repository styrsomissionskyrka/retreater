import { useHover } from '@fransvilhelm/hooks';

export interface ProgressProps {
  progress: number;
  total: number;
}

export const Progress: React.FC<ProgressProps> = ({ progress, total }) => {
  const [isHovering, elProps] = useHover();

  return (
    <div className="relative w-full h-full" {...elProps}>
      {!isHovering ? (
        <div className="absolute w-full h-full inset-0 flex items-center justify-center">
          <div className="relative w-full h-2 rounded-md border border-black overflow-hidden">
            <div className="h-full bg-black rounded-md" style={{ width: `calc(100% * (${progress} / ${total}))` }} />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center tabular-nums">
          {progress} / {total}
        </div>
      )}
    </div>
  );
};
