import { useTranslation } from "react-i18next"

export default function TableBodyRow ({children, className = '', emptyRowTdClassName = '', isEmptyRow = false, colSpan = 0, emptyRowContent = null , emptyRow = null ,...props}) {

    const {t} = useTranslation();

    if(isEmptyRow && emptyRow){ 
        key = Math.random().toString(36).substring(7);

        return (<tr className={"hover:bg-gray-200 focus-within:bg-gray-200 odd:bg-gray-50 " + className} {...props}>
            {emptyRow}
        </tr>)
    }

    return (<tr className={"hover:bg-gray-200 focus-within:bg-gray-200 even:bg-gray-50 " + className} {...props}>
        {children}
    </tr>)
}