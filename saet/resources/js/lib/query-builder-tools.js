import queryParams from "./query-params";

export const getSortingStateFromUrl = (resourceConfig = {}) => {
    let params = queryParams();

    let sort = params.sort ? params.sort.split(',') : [];

    if(sort.length === 0){
        return resourceConfig.defaultSortBy ? [resourceConfig.defaultSortBy] : [];
    }

    let state = [];

    sort.map((item) => {
        let startsWithDash = item.startsWith('-');
        let name = startsWithDash ? item.replace('-', '') : item;
        state.push({field: name, value: startsWithDash ? -1 : 1});
    });

    return state;
}

export const getFilteringStateFromUrl = (filter = null) => {
    let params = queryParams();

    if(filter){
        return params[`filter[${filter}]`] ?? '';
    }

    let state = {};

    Object.keys(params).map((item) => {
        if(item.startsWith('filter[')){
            let name = item.replace('filter[', '').replace(']', '');
            state[name] = params[item];
        }
    });

    return state;
}

export const convertSortingStateToString = (state) => {
    let sort = [];

    state.map((filter) => {
        let value = filter.value;
        if(value === 1){
            sort.push(filter.field);
        }else if(value === -1){
            sort.push(`-${filter.field}`);
        }
    });

    return sort.join(',');
}