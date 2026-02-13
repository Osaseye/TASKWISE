import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex items-center text-sm font-medium text-text-subtle mb-6">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="material-symbols-outlined text-[16px] mx-2">chevron_right</span>}
            {isLast ? (
              <span className="text-white">{item.label}</span>
            ) : (
              <Link to={item.path} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
