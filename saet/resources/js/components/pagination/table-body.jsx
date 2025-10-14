export default function TableBody ({ children, className = "", ...props }) {
    return (
        <tbody className={"divide-y divide-gray-200 bg-white " + className} {...props}>
                {children}
        </tbody>
    );
};
