import { useState } from "react";

export const useFilter = (initialValues) => {
    const [filterInitialValues, setFormInitialValues] = useState(initialValues);
    const [filterData, setFilterData] = useState(initialValues);

    const setFilter = (data, value = null) => {
        if(typeof data === 'object'){
            setFilterData(data);
        }else{
            setFilterData({...filterData, [data]: value});
        }
    }

    const reset = (field = null) => {
        if(field){
            setFilterData({...filterData, [field]: filterInitialValues[field]});
        }else{
            setFilterData(filterInitialValues);
        }
    }

    return {
        filters: filterData,
        setFilter,
        reset,
    }
}