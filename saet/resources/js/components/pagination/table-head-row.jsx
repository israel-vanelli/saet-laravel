export default function TableHeadRow ({children, className = '', ...props}) {
    return (<tr className={"bg-gray-100  " + className} {...props}>
        {children}
    </tr>)
}