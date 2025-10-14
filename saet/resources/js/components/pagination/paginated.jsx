import React, { useEffect } from "react";
import useState from "react-usestateref";
import Pagination from "@/components/pagination/links";

import axios from "axios";

import useStateRef from "react-usestateref";

import { convertSortingStateToString } from "@/lib/query-builder-tools";
import Links from "@/components/pagination/links";
import { useNonInitialEffect } from "@/hooks/use-non-initial-effect";
import If from "../if";
import Loading from "../Loading";

export default function Paginated({
    endpoint,
    params,
    initialPagination = {},
    fillInMissingItems = false,
    sortKeyLimit = null,
    compactLinks = true,
    paginated = (pagination) => null,
    onPaginationUpdated = (pagination) => null,
}) {
    const [pagination, setPagination, paginationRef] = useStateRef({
        data: [],
        meta: {},
        loading: true,
        page: initialPagination.page ?? 1,
        per_page: initialPagination.per_page ?? 10,
        initialLoad: true,
        sortBy: [],
    });

    useNonInitialEffect(() => {
        setPagination((prevState) => ({
            ...prevState,
            page: 1,
            loading: true,
        }));

        fetchResources();
    }, [params ?? {}]);

    useNonInitialEffect(() => {
        onPaginationUpdated(pagination);
    }, [pagination]);

    const fetchResources = () => {
        setPagination((prevState) => ({ ...prevState, loading: true }));

        let queryParams = {
            page: paginationRef.current.page,
            per_page: paginationRef.current.per_page,
            ...params,
        };

        if (paginationRef.current.sortBy?.length > 0) {
            queryParams.sort = convertSortingStateToString(
                paginationRef.current.sortBy
            );
        }

        axios
            .get(endpoint, {
                params: queryParams,
            })
            .then((response) => {
                let data = response.data.data;

                if (
                    fillInMissingItems &&
                    data.length < paginationRef.current.per_page
                ) {
                    let missingRows =
                        paginationRef.current.per_page - data.length;
                    for (let i = 0; i < missingRows; i++) {
                        data.push({
                            is_empty_row: true,
                        });
                    }
                }

                setPagination((prevState) => ({
                    ...prevState,
                    data: response.data.data,
                    meta: response.data.meta,
                    loading: false,
                    initialLoad: false,
                }));
            })
            .catch((error) => {
                console.error(error);
                setPagination((prevState) => ({
                    ...prevState,
                    loading: false,
                }));
            });
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const paginateTo = ({ page, perPage }) => {
        setPagination((prevState) => ({
            ...prevState,
            page,
            per_page: perPage,
        }));
        fetchResources();
    };

    const handleSortBy = (field, sortByValue) => {
        let currentSortBy = paginationRef.current.sortBy;
        // find the field in the current sortBy, update it, or add it
        let index = currentSortBy.findIndex((item) => item.field == field);
        if (index != -1) {
            currentSortBy[index].value = sortByValue;
        } else {
            currentSortBy.push({ field: field, value: sortByValue });
        }
        // remove the ones where value is zero
        currentSortBy = currentSortBy.filter((item) => item.value != 0);

        let limit = sortKeyLimit;
        // get the last ones from the list, up to the limit
        if (limit != null) {
            currentSortBy = currentSortBy.slice(-limit);
        }

        setPagination((prevState) => ({
            ...prevState,
            sortBy: currentSortBy,
        }));

        fetchResources();
    };

    return (
        <>
            <Loading condition={pagination.loading} />
            {paginated({pagination, handleSortBy})}
            <If condition={!pagination.initialLoad}>
                <Links
                    compact={compactLinks}
                    className="mt-4"
                    onPaginateTo={paginateTo}
                    pagination={pagination}
                />
            </If>
        </>
    );
};
