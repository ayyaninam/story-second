import React from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { useRouter } from "next/router";

function GenericPagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(
      {
        query: {
          ...router.query,
          page: page,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
          </PaginationItem>
        )}
        {currentPage > 2 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
            </PaginationItem>
        )}
        {currentPage > 3 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
        {Array.from({ length: 3 }, (_, i) => {
          const pageNumber = currentPage - 1 + i;
          if (pageNumber >= 1 && pageNumber <= totalPages) {
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink onClick={() => handlePageChange(pageNumber)}>{pageNumber}</PaginationLink>
              </PaginationItem>
            );
          }
        })}
        {currentPage < totalPages - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
          </PaginationItem>
        )}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default GenericPagination;