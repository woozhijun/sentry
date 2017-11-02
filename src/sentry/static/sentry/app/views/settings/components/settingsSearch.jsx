import {Link} from 'react-router';
import React from 'react';
import styled from 'react-emotion';

import {searchIndex} from '../../../data/forms/organizationGeneralSettings';
import DropdownMenu from '../../../components/dropdownMenu';
import replaceRouterParams from '../../../utils/replaceRouterParams';

import IconSearch from '../../../icons/icon-search';

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
  transition: border-color .15s ease;
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
    color: ${p => p.theme.gray2}
  }
`;

const DropdownBox = styled.div`
  background: #fff;
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

  &:hover {
    color: ${p => p.theme.purpleDarkest}
    background: ${p => p.theme.offWhite};
  }

  &:first-child {
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

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      searchResults: [],
    };
  }

  clearResults = () => {
    this.setState({
      searchTerm: '',
      searchResults: [],
    });
  };

  handleSearch = e => {
    let searchTerm = e.target.value;
    // min search length
    let isValidSearch = searchTerm.length > MIN_SEARCH_LENGTH;
    let searchResults = !isValidSearch
      ? []
      : Object.keys(searchIndex)
          .filter(index => index.indexOf(searchTerm) > -1)
          .map(index => searchIndex[index]);

    this.setState({
      searchTerm,
      searchResults,
    });
  };

  render() {
    let {params} = this.props;
    let hasResults = this.state.searchResults.length > 0;

    return (
      <SettingsSearchContainer>
        <SearchInputWrapper>
          <SearchInputIcon size="14px" />
          <SearchInput
            type="text"
            onChange={this.handleSearch}
            value={this.state.searchTerm}
            placeholder="Search settings (or press t)"
          />
        </SearchInputWrapper>

        <DropdownMenu visible={hasResults} renderComponent={() => <DropdownBox />}>
          {this.state.searchResults.map(({route, groupTitle, field}) => (
            <SearchItem
              key={field.name}
              to={`${replaceRouterParams(route, params)}#${encodeURIComponent(field.name)}`}
              onClick={this.clearResults}
            >
              <div>
                <span>{field.label}</span>
              </div>

              <SearchDetail>{field.help}</SearchDetail>
            </SearchItem>
          ))}
        </DropdownMenu>
      </SettingsSearchContainer>
    );
  }
}

export default SettingsSearch;
