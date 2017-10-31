import React from 'react';
import styled from 'react-emotion';

class SettingsPageHeading extends React.Component {
  render() {
    // Todo(ckj) support tabs
    return (
      <Wrapper>
        {this.props.label &&
          <div style={{flex: '1'}}><Label>{this.props.label}</Label></div>}
        {this.props.action && <div>{this.props.action}</div>}
      </Wrapper>
    );
  }
}

SettingsPageHeading.propTypes = {
  label: React.PropTypes.string,
  action: React.PropTypes.Component
};

const Wrapper = styled.div`
  display: flex;
  font-size: 14px;
  box-shadow: inset 0 -1px 0 ${p => p.theme.borderLight};
  margin-bottom: 30px;
`;

const Label = styled.div`
  display: inline-block;
  font-weight: bold;
  padding-bottom: 14px;
  border-bottom: 3px solid ${p => p.theme.purple};
`;

export default SettingsPageHeading;
