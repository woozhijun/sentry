import {Link} from 'react-router';
import {withTheme} from 'emotion-theming';
import React from 'react';
import styled from 'react-emotion';

import {searchIndex} from '../../../data/forms/organizationGeneralSettings';
import DropdownMenu from '../../../components/dropdownMenu';
import replaceRouterParams from '../../../utils/replaceRouterParams';

const MIN_SEARCH_LENGTH = 2;

const DropdownBox = withTheme(styled.div`
  box-shadow: ${p => p.theme.dropShadowLight};
  position: absolute;
  right: 0;
  width: 400px;
`);

const SettingsSearchContainer = styled.div`
  position: relative;
`;

const SearchItem = withTheme(styled.div`
  background-color: white;
  color: ${p => p.theme.gray5};
  padding: 18px;
`);

const SearchDetail = withTheme(styled.div`
  font-size: 0.8em;
  color: ${p => p.theme.gray3};
`);

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
        <input type="text" onChange={this.handleSearch} value={this.state.searchTerm} />

        <DropdownMenu visible={hasResults} renderComponent={() => <DropdownBox />}>
          {this.state.searchResults.map(({route, groupTitle, field}) => (
            <Link
              key={field.name}
              to={`${replaceRouterParams(route, params)}#${encodeURIComponent(
                field.name
              )}`}
              onClick={this.clearResults}
            >
              <SearchItem>
                <div>
                  <span>{field.label}</span>
                </div>

                <SearchDetail>{field.help}</SearchDetail>
              </SearchItem>
            </Link>
          ))}
        </DropdownMenu>
      </SettingsSearchContainer>
    );
  }
}

export default SettingsSearch;
