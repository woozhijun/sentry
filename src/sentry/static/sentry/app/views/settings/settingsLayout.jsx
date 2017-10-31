import {Box, Flex} from 'grid-emotion';
import {Link} from 'react-router';
import {withTheme} from 'emotion-theming';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import {searchIndex} from '../../data/forms/organizationGeneralSettings';
import SettingsActivity from './components/settingsActivity';
import SettingsBreadcrumb from './components/settingsBreadcrumb';
import SettingsHeader from './components/settingsHeader';
import replaceRouterParams from '../../utils/replaceRouterParams';

const MIN_SEARCH_LENGTH = 2;

let StyledWarning = styled.div`
  margin-bottom: 30px;
`;

// TODO(billy): Temp
let NewSettingsWarning = ({location = {}}) => {
  // TODO(billy): Remove this warning when ready
  let oldLocation = location.pathname
    ? location.pathname.replace(/^\/settings\/organization\//, '/organizations/')
    : '';
  // members or auth should not be react routes
  let isRouter = !/\/(members|auth)\//.test(location.pathname);

  let linkProps = {
    href: isRouter ? undefined : oldLocation,
    to: isRouter ? oldLocation : undefined,
  };
  let Component = isRouter ? Link : 'a';

  return (
    <StyledWarning className="alert alert-warning">
      These settings are currently in beta. Please report any issues. You can temporarily
      visit the <Component {...linkProps}>old settings page</Component> if necessary.
    </StyledWarning>
  );
};

const Content = styled(Box)`
  flex: 1;
`;

const DropdownBox = withTheme(styled.div`
  position: absolute;
  width: 400px;
  box-shadow: ${p => p.theme.dropShadowLight};
`);

class SettingsLayout extends React.Component {
  static propTypes = {
    renderNavigation: PropTypes.func,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      searchResults: [],
    };
  }

  handleSearch = e => {
    let searchText = e.target.value;
    // min search length
    let isValidSearch = searchText.length > MIN_SEARCH_LENGTH;
    let searchResults = !isValidSearch
      ? []
      : Object.keys(searchIndex)
          .filter(index => index.indexOf(searchText) > -1)
          .map(index => searchIndex[index]);

    this.setState({
      searchResults,
    });
  };

  render() {
    let {params, renderNavigation, children} = this.props;
    // We want child's view's props
    let childProps = (children && children.props) || this.props;
    let childRoutes = childProps.routes || [];
    let childRoute = childProps.route || {};

    return (
      <div>
        <SettingsHeader>
          <Box flex="1">
            <SettingsBreadcrumb params={params} routes={childRoutes} route={childRoute} />
          </Box>
          <div>
            <SettingsActivity />
            <div style={{position: 'relative'}}>
              <input type="text" onChange={this.handleSearch} />
              {this.state.searchResults.length > 0 ? (
                <DropdownBox>
                  {this.state.searchResults.map(({route, groupTitle, field}) => (
                    <Link
                      key={field.name}
                      to={`${replaceRouterParams(route, params)}#${encodeURIComponent(
                        field.name
                      )}`}
                      onClick={() => this.setState({searchResults: []})}
                    >
                      <div style={{backgroundColor: 'white', padding: '18px'}}>
                        <div style={{color: '#2f2837'}}>
                          <span style={{color: '#2f2837'}}>{field.label}</span>
                        </div>

                        <div style={{fontSize: '0.8em', color: '#655674'}}>
                          {field.help}
                        </div>
                      </div>
                    </Link>
                  ))}
                </DropdownBox>
              ) : null}
            </div>
          </div>
        </SettingsHeader>

        <Flex>
          <Box flex="0 0 210px">
            <StickySidebar>
              {typeof renderNavigation === 'function' && renderNavigation()}
            </StickySidebar>
          </Box>

          <Content>
            <NewSettingsWarning location={this.props.location} />

            {children}
          </Content>
        </Flex>
      </div>
    );
  }
}

const StickySidebar = styled.div`
  position: sticky;
  top: 105px;
`;

export default SettingsLayout;
