import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationBlocksProps {
  currentPage: number;
  prevPage: () => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  totalPages: number;
}
const CustomPaginationBlocks = ({
  currentPage,
  goToPage,
  nextPage,
  prevPage,
  totalPages,
}: CustomPaginationBlocksProps) => {
  return (
    <Pagination className="text-primary-foreground">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious className="cursor-pointer" onClick={prevPage} />
        </PaginationItem>
        {currentPage - 1 > 0 && (
          <PaginationItem className="cursor-pointer">
            <PaginationLink onClick={() => goToPage(currentPage - 1)}>
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink className="bg-primary hover:bg-orange-400 cursor-pointer">
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        {currentPage < totalPages && (
          <PaginationItem className="cursor-pointer">
            <PaginationLink onClick={() => goToPage(currentPage + 1)}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>{/* <PaginationEllipsis /> */}</PaginationItem>
        <PaginationItem>
          <PaginationNext className="cursor-pointer" onClick={nextPage} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPaginationBlocks;
