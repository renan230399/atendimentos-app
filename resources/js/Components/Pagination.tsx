import React from 'react';

interface PaginationProps {
  meta: {
    current_page: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  } | null; // Permitir que seja null
}

const Pagination: React.FC<PaginationProps> = ({ meta }) => {
  if (!meta || !meta.links) {
    return null; // Retorna nada se meta ou links for undefined ou null
  }

  const { links, current_page, last_page } = meta;

  return (
    <nav aria-label="Paginação" className="mt-6">
      <ul className="inline-flex -space-x-px">
        {links.map((link, index) => (
          <li key={index}>
            {link.url ? (
              <a
                href={link.url}
                className={`px-3 py-2 border rounded-md ${
                  link.active ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-600'
                }`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ) : (
              <span
                className="px-3 py-2 border bg-gray-200 text-gray-500 rounded-md"
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
