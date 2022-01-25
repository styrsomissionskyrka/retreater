export const PostBox: React.FC<{ title: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="postbox" style={{ marginTop: 24 }}>
      <div className="postbox-header">
        <h2 className="hndle ui-sortable-handle">{title}</h2>
      </div>
      <div className="inside">{children} </div>
    </div>
  );
};
