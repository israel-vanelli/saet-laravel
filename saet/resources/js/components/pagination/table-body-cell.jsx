export default function TableBodyCell ({ children, className = "", withTopBorder = true, withLeftBorder = true, ...props }) {
    return (
        <td className={`whitespace-nowrap px-3 py-4 text-sm text-gray-700 last:border-r ${withLeftBorder ? 'border-l' : ''} ${withTopBorder ? 'border-t' :''} ${className}`} {...props}>
            
            {children}
            
        </td>
    );
};
