export const Card = ({ children, className }) => (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>{children}</div>
  );
  
export const CardContent = ({ children }) => <div className="p-4">{children}</div>;
  