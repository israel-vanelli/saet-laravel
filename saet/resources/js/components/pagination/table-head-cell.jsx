export default function TableHeadCell({ children, withLeftBorder = false, preventSelect = true, className = '', ...props }) {
    return (
        <th
            className={
                'py-3.5 pr-4 pl-4 text-left text-sm font-semibold text-gray-900 first:border-l last:border-r sm:pl-4 ' +
                (withLeftBorder ? 'border-l' : '') +
                (preventSelect ? 'prevent-select' : '') +
                className
            }
            {...props}
        >
            {children}
        </th>
    );
}
