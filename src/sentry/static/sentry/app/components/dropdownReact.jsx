import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import DropdownMenu from './dropdownMenu';

class DropdownReact extends React.Component {
  static propTypes = {
    title: PropTypes.node,
    /** display dropdown caret */
    caret: PropTypes.bool,
    disabled: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,

    /**
     * Callback function to check if we should ignore click outside to
     * hide dropdown menu
     */
    shouldIgnoreClickOutside: PropTypes.func,

    /**
     * If this is set, then this will become a "controlled" component.
     * It will no longer set local state and dropdown visiblity will
     * only follow `isOpen`.
     */
    isOpen: PropTypes.bool,

    /** anchors menu to the right */
    anchorRight: PropTypes.bool,

    /** Keeps dropdown menu open when menu is clicked */
    keepMenuOpen: PropTypes.bool,

    /**
     * Always render children of dropdown menu, this is included to support
     * menu items that open a confirm modal. Otherwise when dropdown menu hides,
     * the modal also gets unmounted
     */
    alwaysRenderMenu: PropTypes.bool,

    topLevelClasses: PropTypes.string,
    menuClasses: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    anchorRight: false,
    keepMenuOpen: false,
    caret: true,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      isOpen: false,
    };
  }

  // Gets open state from props or local state when appropriate
  isOpen = () => {
    let {isOpen} = this.props;
    let isControlled = typeof isOpen !== 'undefined';
    return (isControlled && isOpen) || this.state.isOpen;
  };

  // Callback function from <DropdownMenu> to see if we should close menu
  shouldIgnoreClickOutside = e => {
    let {shouldIgnoreClickOutside} = this.props;
    if (this.dropdownActor.contains(e.target)) return true;
    if (typeof shouldIgnoreClickOutside === 'function') {
      return shouldIgnoreClickOutside(e);
    }

    return false;
  };

  // Opens dropdown menu
  handleOpen = e => {
    let {onOpen, isOpen} = this.props;
    let isControlled = typeof isOpen !== 'undefined';
    if (!isControlled) {
      this.setState({
        isOpen: true,
      });
    }

    if (typeof onOpen === 'function') {
      onOpen(e);
    }
  };

  // Closes dropdown menu
  handleClose = e => {
    let {onClose, isOpen} = this.props;
    let isControlled = typeof isOpen !== 'undefined';
    if (!isControlled) {
      this.setState({isOpen: false});
    }

    if (typeof onClose === 'function') {
      onClose(e);
    }
  };

  // When dropdown menu is displayed and mounted to DOM,
  // bind a click handler to `document` to listen for clicks outside of
  // this component and close menu if so
  handleToggle = e => {
    if (this.isOpen()) {
      this.handleClose(e);
    } else {
      this.handleOpen(e);
    }
  };

  render() {
    let {
      anchorRight,
      disabled,
      title,
      caret,
      children,
      menuClasses,
      className,
      alwaysRenderMenu,
      keepMenuOpen,
      topLevelClasses,
    } = this.props;

    // Default anchor = left
    let isRight = anchorRight;
    let shouldShowDropdown = this.isOpen();

    let cx = classNames('dropdown-actor', className, {
      'dropdown-menu-right': isRight,
      'dropdown-toggle': true,
      disabled,
    });

    let topLevelCx = classNames('dropdown', topLevelClasses, {
      'pull-right': isRight,
      'anchor-right': isRight,
      open: shouldShowDropdown,
    });

    // .dropdown-actor-title = flexbox to fix vertical alignment on firefox
    // Need the extra container because dropdown-menu alignment is off if `dropdown-actor` is a flexbox
    return (
      <span className={topLevelCx}>
        <a
          className={cx}
          ref={ref => (this.dropdownActor = ref)}
          onClick={this.handleToggle}
        >
          <div className="dropdown-actor-title">
            <span>{title}</span>
            {caret && <i className="icon-arrow-down" />}
          </div>
        </a>
        <DropdownMenu
          visible={shouldShowDropdown}
          keepMenuOpen={keepMenuOpen}
          alwaysRenderMenu={alwaysRenderMenu}
          shouldIgnoreClickOutside={this.shouldIgnoreClickOutside}
          onClose={this.handleClose}
          renderComponent={() => (
            <ul className={classNames(menuClasses, 'dropdown-menu')} />
          )}
        >
          {children}
        </DropdownMenu>
      </span>
    );
  }
}

export default DropdownReact;
