/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  // Find the category for the current product
  const category = categoriesFromServer.find(
    categori => categori.id === product.categoryId,
  );

  // Find the user who owns this category
  const user = usersFromServer.find(use => use.id === category.ownerId);

  return {
    ...product,
    category: {
      id: category.id,
      title: category.title,
      icon: category.icon,
    },
    user: {
      id: user.id,
      name: user.name,
      sex: user.sex,
    },
  };
});

// console.log(products);

export const App = () => {
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');
  const [categories, setCategori] = useState('All');

  const whatSexIs = sex => {
    return sex === 'm' ? `has-text-link` : `has-text-danger`;
  };

  const finder = () => {
    if (query) {
      return products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase().trim()),
      );
    }

    return products;
  };

  const filterByName = () => {
    if (active === 'All') {
      return finder() || [...products];
    }

    return finder().filter(product => product.user.name === active);
  };

  const filterCategirie = () => {
    if (categories === 'All') {
      return finder() || [...products];
    }

    return finder().filter(product => product.category.title === categories);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => setActive('All')}
                data-cy="FilterAllUsers"
                href="#/"
                className={active === 'All' ? 'is-active' : ''}
              >
                All
              </a>

              {products
                .map(user => user.user.name)
                .filter((value, index, array) => array.indexOf(value) === index)
                .map(user => (
                  <a
                    onClick={() => setActive(user)}
                    data-cy="FilterUser"
                    href="#/"
                    className={active === user ? 'is-active' : ''}
                    key={user}
                  >
                    {user}
                  </a>
                ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setCategori('All')}
              >
                All
              </a>
              {filterCategirie().map(categorie => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                  key={categorie.id}
                >
                  {categorie.category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filterByName().length < 1 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            {filterByName().length > 0 ? (
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
            ) : (
              ''
            )}

            <tbody>
              {filterByName().map(product => (
                <tr key={product.id} data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                  <td
                    data-cy="ProductUser"
                    className={whatSexIs(product.user.sex)}
                  >
                    {product.user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
