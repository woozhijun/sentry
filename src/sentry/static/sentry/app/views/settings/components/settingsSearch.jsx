import {Link, browserHistory} from 'react-router';
import {css} from 'emotion';
import Downshift from 'downshift';
import React from 'react';
import styled from 'react-emotion';

import {searchIndex} from '../../../data/forms/organizationGeneralSettings';
import {t} from '../../../locale';
import IconSearch from '../../../icons/icon-search';
import replaceRouterParams from '../../../utils/replaceRouterParams';

const MIN_SEARCH_LENGTH = 2;

const SearchInputWrapper = styled.div`
  position: relative;
`;

const SearchInputIcon = styled(IconSearch)`
  color: ${p => p.theme.gray2}
  position: absolute;
  left: 10px;
  top: 8px;
`;

const SearchInput = styled.input`
  transition: border-color 0.15s ease;
  font-size: 14px;
  width: 220px;
  line-height: 1;
  padding: 5px 8px 4px 28px;
  border: 1px solid ${p => p.theme.borderDark};
  border-radius: 30px;
  height: 28px;

  box-shadow: inset ${p => p.theme.dropShadowLight};

  &:focus {
    outline: none;
    border: 1px solid ${p => p.theme.gray1};
  }

  &::placeholder {
    color: ${p => p.theme.gray2};
  }
`;

const DropdownBox = styled.div`
  background: #fff;
  border: 1px solid ${p => p.theme.borderDark};
  box-shadow: ${p => p.theme.dropShadowHeavy};
  position: absolute;
  top: 36px;
  right: 0;
  width: 400px;
  border-radius: 5px;
`;

const SettingsSearchContainer = styled.div`
  position: relative;
`;

const SearchItem = styled(Link)`
  display: block;
  color: ${p => p.theme.gray5};
  padding: 16px 16px 14px;
  border-bottom: 1px solid ${p => p.theme.borderLight};

  ${p =>
    p.highlighted &&
    css`
      color: ${p.theme.purpleDarkest};
      background: ${p.theme.offWhite};
    `} &:first-child {
    border-radius: 5px 5px 0 0;
  }

  &:last-child {
    border-bottom: 0;
    border-radius: 0 0 5px 5px;
  }
`;

const SearchDetail = styled.div`
  font-size: 0.8em;
  line-height: 1.3;
  margin-top: 4px;
  color: ${p => p.theme.gray3};
`;

class SettingsSearch extends React.Component {
  static propTypes = {};

  handleSelect = (item, state) => {
    if (!item) return;

    let {to} = item;
    if (!to) return;

    browserHistory.push(item.to);
  };

  render() {
    let {params} = this.props;

    return (
      <Downshift
        defaultHighlightedIndex={0}
        itemToString={() => ''}
        onSelect={this.handleSelect}
        onStateChange={this.handleStateChange}
      >
        {({
          getInputProps,
          getItemProps,
          getRootProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex,
          onChange,
        }) => {
          let isValidSearch = inputValue.length > MIN_SEARCH_LENGTH;

          let matches =
            isValidSearch &&
            isOpen &&
            Object.keys(searchIndex).filter(
              key => key.indexOf(inputValue.toLowerCase()) > -1
            );

          return (
            <SettingsSearchContainer {...getRootProps({refKey: 'innerRef'})}>
              <SearchInputWrapper>
                <SearchInputIcon size="14px" />
                <SearchInput
                  {...getInputProps({
                    type: 'text',
                    placeholder: 'Search settings (or press /)',
                  })}
                />
              </SearchInputWrapper>

              {isValidSearch && isOpen ? (
                <DropdownBox>
                  {matches && matches.length ? (
                    matches.map((key, index) => {
                      let item = searchIndex[key];
                      let {route, field} = item;
                      let to = `${replaceRouterParams(
                        route,
                        params
                      )}#${encodeURIComponent(field.name)}`;

                      return (
                        <SearchItem
                          {...getItemProps({
                            item: {
                              ...item,
                              to,
                            },
                          })}
                          highlighted={index === highlightedIndex}
                          to={to}
                          key={field.name}
                        >
                          <div>
                            <span>{field.label}</span>
                          </div>

                          <SearchDetail>{field.help}</SearchDetail>
                        </SearchItem>
                      );
                    })
                  ) : (
                    <SearchItem>{t('No results found')}</SearchItem>
                  )}
                </DropdownBox>
              ) : null}
            </SettingsSearchContainer>
          );
        }}
      </Downshift>
    );
  }
}

export default SettingsSearch;
