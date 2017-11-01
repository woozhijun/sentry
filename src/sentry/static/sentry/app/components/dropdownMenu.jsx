import PropTypes from 'prop-types';
import React from 'react';

class DropdownReact extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,

    /**
     * Callback function to check if we should ignore click outside to
     * hide dropdown menu
     */
    shouldIgnoreClickOutside: PropTypes.func,

    /**
     * Dropdown is visible or not
     */
    visible: PropTypes.bool,

    /** Keeps dropdown menu open when menu is clicked */
    keepMenuOpen: PropTypes.bool,

    /**
     * Always render children of dropdown menu, this is included to support
     * menu items that open a confirm modal. Otherwise when dropdown menu hides,
     * the modal also gets unmounted
     */
    alwaysRenderMenu: PropTypes.bool,

    /**
     * Function that returns the component you want to render as the dropdown menu's
     * container
     */
    renderComponent: PropTypes.func,
  };

  static defaultProps = {
    keepMenuOpen: false,
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.checkClickOutside, true);
  }

  // Checks if click happens inside of dropdown menu (or its button)
  // Closes dropdownmenu if it is "outside"
  checkClickOutside = e => {
    let {shouldIgnoreClickOutside} = this.props;

    if (!this.dropdownMenu) return;
    // Dropdown menu itself
    if (this.dropdownMenu.contains(e.target)) return;

    if (typeof shouldIgnoreClickOutside === 'function' && shouldIgnoreClickOutside(e))
      return;

    this.handleClose(e);
  };

  // Closes dropdown menu
  handleClose = e => {
    let {onClose} = this.props;

    if (typeof onClose === 'function') {
      onClose(e);
    }
  };

  // When dropdown menu is displayed and mounted to DOM,
  // bind a click handler to `document` to listen for clicks outside of
  // this component and close menu if so
  handleMenuMount = ref => {
    this.dropdownMenu = ref;

    if (this.dropdownMenu) {
      // 3rd arg = useCapture = so event capturing vs event bubbling
      document.addEventListener('click', this.checkClickOutside, true);
    } else {
      document.removeEventListener('click', this.checkClickOutside, true);
    }
  };

  // Control whether we should hide dropdown menu when it is clicked
  handleDropdownMenuClick = e => {
    if (this.props.keepMenuOpen) return;

    this.handleClose(e);
  };

  render() {
    let {children, visible, alwaysRenderMenu, renderComponent} = this.props;

    let shouldShowDropdown = visible;

    if (!shouldShowDropdown && !alwaysRenderMenu) {
      return null;
    }

    let Component = typeof renderComponent === 'function' ? renderComponent() : 'div';

    return React.cloneElement(Component, {
      ref: this.handleMenuMount,
      onClick: this.handleDropdownMenuClick,
      children,
    });
  }
}

export default DropdownReact;
