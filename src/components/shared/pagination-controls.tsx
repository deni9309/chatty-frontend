import { cn } from '../../lib/utils/clsx'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const PaginationControls = ({ currentPage, totalPages, onPageChange }: PaginationControlsProps) => {
  if (totalPages <= 1) return null

  const generatePageNumbers = () => {
    const pages = new Set<number>()
    pages.add(1)
    pages.add(totalPages)

    if (currentPage > 2) pages.add(currentPage - 1)
    pages.add(currentPage)

    if (currentPage < totalPages - 1) pages.add(currentPage + 1)

    const sortedPages = Array.from(pages).sort((a, b) => a - b)
    const result: (number | string)[] = []

    let lastPage: number | null = null

    for (const page of sortedPages) {
      if (lastPage !== null && page - lastPage > 1) {
        result.push('...')
      }
      result.push(page)
      lastPage = page
    }
    return result
  }

  const pageNumbers = generatePageNumbers()

  return (
    <div className="flex justify-center mt-4">
      <div className="join">
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &laquo;
        </button>
        {pageNumbers.map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              className={cn('join-item btn btn-sm', currentPage === page && 'btn-active')}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : (
            <button key={index} className="join-item btn btn-sm btn-disabled">
              &hellip;
            </button>
          ),
        )}
        <button
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </button>
      </div>
    </div>
  )
}

export default PaginationControls
