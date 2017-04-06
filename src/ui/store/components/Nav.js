/* global shell os remote */
import React from 'react';
import { connect } from 'react-redux';
import { Menu, MenuItem, Popover, Button, Position, Classes } from '@blueprintjs/core';
import classNames from 'classnames';
import { replace, push, goBack } from 'react-router-redux';

import { refresh } from '../actions/home';
import { search, setSearchQuery } from '../actions/search';
import { toggleCustomDialog } from '../actions/custom';

const Nav = ({
  query, pathname,
  requestToggleCustomDialog,
  requestSearch, requestSetSearchQuery, requestRefresh,
  goTo,
}) => (
  <nav
    className="pt-navbar"
    style={{
      display: 'flex',
      WebkitUserSelect: 'none',
      WebkitAppRegion: 'drag',
      flexBasis: 50,
      paddingLeft: (os.platform() === 'darwin') ? 80 : null,
    }}
  >
    <div className="pt-navbar-group pt-align-left" style={{ flex: 1, paddingRight: 12 }}>
      <div className="pt-input-group" style={{ width: '100%', maxWidth: 300 }}>
        <span className="pt-icon pt-icon-search" />
        <input
          className="pt-input"
          placeholder="Search (name, URL)..."
          type="text"
          style={{ width: '100%', WebkitUserSelect: 'text', WebkitAppRegion: 'no-drag' }}
          value={query}
          onKeyDown={(e) => {
            if ((e.keyCode || e.which) === 13) {
              requestSearch();
              e.target.blur();
            }
          }}
          onChange={e => requestSetSearchQuery(e.target.value, pathname)}
        />
        {query.length > 0 ? (
          <Button
            iconName="cross"
            className={Classes.MINIMAL}
            style={{ WebkitAppRegion: 'no-drag' }}
            onClick={() => requestSetSearchQuery('', pathname)}
          />
        ) : null}
      </div>
    </div>
    <div className="pt-navbar-group pt-align-right">
      <Button
        iconName="home"
        className={classNames(
          { [Classes.ACTIVE]: (pathname === '/') },
          Classes.MINIMAL,
        )}
        style={{ WebkitAppRegion: 'no-drag' }}
        text="Home"
        onClick={() => goTo('/')}
      />
      <Button
        iconName="import"
        className={classNames(
          { [Classes.ACTIVE]: (pathname === '/installed') },
          Classes.MINIMAL,
        )}
        style={{ WebkitAppRegion: 'no-drag' }}
        text="Installed"
        onClick={() => goTo('/installed')}
      />
      <Popover
        content={(
          <Menu>
            <MenuItem
              iconName="refresh"
              text="Refresh"
              onClick={() => requestRefresh(pathname)}
            />
            <MenuItem
              iconName="wrench"
              text="Install custom app"
              onClick={() => requestToggleCustomDialog()}
            />
            <MenuItem
              iconName="add"
              text="Submit new app"
              onClick={() => shell.openExternal('https://goo.gl/forms/QIFncw8dauDn61Mw1')}
            />
            <MenuItem
              iconName="heart"
              text="Donate"
              onClick={() => shell.openExternal('https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=JZ2Y4F47ZMGHE&lc=US&item_name=WebCatalog&item_number=webcatalog&currency_code=USD')}
            />
            <MenuItem
              iconName="help"
              text="Help"
              onClick={() => shell.openExternal('https://getwebcatalog.com/support')}
            />
          </Menu>
        )}
        position={Position.BOTTOM_RIGHT}
      >
        <Button
          iconName="more"
          className={Classes.MINIMAL}
          style={{ WebkitAppRegion: 'no-drag' }}
        />
      </Popover>

      {os.platform() !== 'darwin' ? [
        <span className="pt-navbar-divider" key="divider" />,
        <Button
          iconName="minus"
          className={Classes.MINIMAL}
          style={{ WebkitAppRegion: 'no-drag' }}
          onClick={() => {
            const window = remote.getCurrentWindow();
            window.minimize();
          }}
          key="minimize"
        />,
        <Button
          iconName="applications"
          className={Classes.MINIMAL}
          style={{ WebkitAppRegion: 'no-drag' }}
          onClick={() => {
            const window = remote.getCurrentWindow();
            if (!window.isMaximized()) {
              window.maximize();
            } else {
              window.unmaximize();
            }
          }}
          key="maximize"
        />,
        <Button
          iconName="cross"
          className={Classes.MINIMAL}
          style={{ WebkitAppRegion: 'no-drag' }}
          onClick={() => {
            const window = remote.getCurrentWindow();
            window.close();
          }}
          key="close"
        />,
      ] : null}
    </div>
  </nav>
);

Nav.propTypes = {
  query: React.PropTypes.string,
  pathname: React.PropTypes.string,
  requestSearch: React.PropTypes.func,
  requestSetSearchQuery: React.PropTypes.func,
  requestRefresh: React.PropTypes.func,
  requestToggleCustomDialog: React.PropTypes.func,
  goTo: React.PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  query: state.search.get('query'),
  searchStatus: state.search.get('status'),
  pathname: ownProps.pathname,
});

const mapDispatchToProps = dispatch => ({
  requestSearch: () => {
    dispatch(search());
    dispatch(push('/search'));
  },
  requestSetSearchQuery: (query, pathname) => {
    if (pathname === '/search') {
      dispatch(goBack());
    }
    dispatch(setSearchQuery(query));
  },
  requestRefresh: (pathname) => {
    dispatch(refresh(pathname));
  },
  requestToggleCustomDialog: () => {
    dispatch(toggleCustomDialog());
  },
  goTo: (pathname) => {
    dispatch(replace(pathname));
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Nav);