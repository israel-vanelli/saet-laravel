import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNonInitialEffect } from '@/hooks/use-non-initial-effect';
import { SelectItem } from '@radix-ui/react-select';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useState from 'react-usestateref';
import { Input } from '../ui/input';

export default function Links({
    pagination,
    hidePageInput = false,
    hidePerPageSelector = false,
    hidePageSelector = false,
    showGoToStartButton = false,
    showGoToEndButton = false,
    hideTotal = false,
    compact = true,
    onPaginateTo,
    perPageOptions = [5, 8, 10, 15, 25, 50, 100],
    className = '',
    ...props
}) {
    const [perPage, setPerPage] = useState(pagination.meta.per_page);
    const [currentPage, setCurrentPage, currentPageRef] = useState(pagination.meta.current_page);
    const [currentPageInput, setCurrentPageInput, currentPageInputRef] = useState(pagination.meta.current_page);
    // const [pageInputTemp, setPageInputTemp, pageInputTempRef] = useState(pagination.meta.current_page);
    const pageRange = 1;

    const { t } = useTranslation();

    const pages = useMemo(() => {
        const total = pagination.meta.last_page;

                  // Build the core set: first, current, last
        const pageNumbers = (compact ? [1, currentPage, total] : [1, currentPage - 1, currentPage, currentPage + 1, total])
            .filter((n, index, self) => n >= 1 && n <= total && self.indexOf(n) === index) // Remove duplicates
            .sort((a, b) => a - b);

        // Inject ellipsis for gaps >1
        const pagesArray = [];
        for (let i = 0; i < pageNumbers.length; i++) {
            if (i > 0 && pageNumbers[i] - pageNumbers[i - 1] > 1) {
                pagesArray.push('...');
            }
            pagesArray.push(pageNumbers[i]);
        }

        return pagesArray;
    }, [pagination.meta.last_page, currentPage]);

    const paginateTo = () => {
        onPaginateTo({ page: currentPage, perPage });
    };

    const handleUpdatePerPage = (e) => {
        setPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const onBlur = () => {
        let value = currentPageInputRef.current;

        if (value == currentPageRef.current) {
            return;
        }

        if (value > pagination.meta.last_page) {
            value = pagination.meta.last_page;
        }

        if (value < 1) {
            value = 1;
        }

        setCurrentPageInput(value);
        setCurrentPage(value);
    };

    useNonInitialEffect(() => {
        paginateTo();
        setCurrentPageInput(currentPage);
    }, [perPage, currentPage]);

    useNonInitialEffect(() => {
        if (pagination.meta.current_page !== currentPage) {
        setCurrentPage(pagination.meta.current_page);
        setCurrentPageInput(pagination.meta.current_page);
        }
    }, [pagination.meta.current_page]);

    return (
        <div className={'flex items-center w-full ' + className} {...props}>
            <div className="flex items-center">
                {!hideTotal && (
                    <label htmlFor="per-page-selector" className="mr-2 whitespace-nowrap">
                        {t('pagination.showing_of_results', {
                            from: pagination.meta.from,
                            to: pagination.meta.to,
                            total: pagination.meta.total,
                        })}
                    </label>
                )}
            </div>

            {!hidePageSelector && (
                <Pagination>
                    <PaginationContent>
                        <Select
                            value={String(perPage)} // Ensure the value matches the selected option
                            onValueChange={(value) => handleUpdatePerPage({ target: { value } })}
                        >
                            <SelectTrigger className="w-[80px]">
                                <SelectValue>{perPage}</SelectValue> {/* Display the current perPage value */}
                            </SelectTrigger>
                            <SelectContent className="w-[80px]">
                                {perPageOptions.map((option) => (
                                    <SelectItem key={option} value={String(option)} className="hover:bg-gray-100 p-1 dark:hover:bg-gray-700">
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="mx-4 py-2 text-black/50 dark:text-white/50">|</span>

                        <PaginationItem>
                            <PaginationPrevious disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                        </PaginationItem>
                        {/* <ul className="flex list-none overflow-hidden rounded border border-gray-300"> */}
                        {pages.map((page, index) => (
                            <PaginationItem key={`paginator-${page}-${index}`} onClick={() => typeof page === 'number' && setCurrentPage(page)}>
                                {typeof page === 'number' ? (
                                    <PaginationLink isActive={page == currentPage}>{page}</PaginationLink>
                                ) : (
                                    <PaginationEllipsis />
                                )}
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.meta.last_page))}
                                disabled={currentPage === pagination.meta.last_page}
                            />
                        </PaginationItem>
                        {!hidePageSelector && !hidePageInput && <span className="mx-4 py-2 text-black/50 dark:text-white/50">|</span>}
                        {!hidePageInput && (
                            <>
                                <Input
                                    id="current-page-input"
                                    type="number"
                                    value={currentPageInput}
                                    onChange={(e) => setCurrentPageInput(e.target.value)}
                                    max={pagination.meta.last_page}
                                    onBlur={onBlur}
                                    className="w-16 [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
