import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Slide from 'material-ui/transitions/Slide';
import Typography from 'material-ui/Typography';
import Dialog, {
  DialogContent,
} from 'material-ui/Dialog';

import connectComponent from '../../helpers/connect-component';

import { close } from '../../state/dialogs/about/actions';
import { checkForLinuxUpdates } from '../../state/root/updater/actions';
import iconSvg from '../../assets/icon.svg';
import {
  CHECKING_FOR_UPDATES,
  UPDATE_AVAILABLE,
  UPDATE_DOWNLOADED,
  UPDATE_ERROR,
  UPDATE_NOT_AVAILABLE,
  UPDATE_PROGRESS,
} from '../../constants/updater-statuses';
import {
  STRING_ABOUT,
  STRING_CHECK_FOR_UPDATES,
  STRING_CHECKING_FOR_UPDATES,
  STRING_GO_TO_THE_WEBSITE,
  STRING_PRIVACY_POLICY,
  STRING_RELEASE_NOTES,
  STRING_UPDATE_AND_RELAUNCH,
  STRING_TERMS,
  STRING_UPDATE_AVAILABLE_LINUX,
  STRING_UPDATE_AVAILABLE,
  STRING_UPDATE_DOWNLOADED,
  STRING_UPDATE_ERROR,
  STRING_UPDATE_NOT_AVAILABLE,
  STRING_UPDATE_PROGRESS,
  STRING_WEBSITE,
} from '../../constants/strings';

import {
  requestOpenInBrowser,
} from '../../senders/generic';
import {
  requestCheckForUpdates,
  requestQuitAndInstall,
} from '../../senders/updater';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = {
  icon: {
    height: 128,
    width: 128,
  },
  dialogContent: {
    minWidth: 320,
    textAlign: 'center',
  },
  title: {
    marginTop: 16,
  },
  version: {
    marginBottom: 16,
  },
  versionSmallContainer: {
    marginBottom: 24,
  },
  versionSmall: {
    fontSize: 13,
  },
  updaterStatus: {
    marginTop: 32,
    marginBottom: 12,
  },
  divider: {
    marginTop: 16,
    marginBottom: 16,
  },
  goToTheWebsiteButton: {
    marginRight: 6,
  },
};

const Transition = props => <Slide direction="left" {...props} />;

const About = (props) => {
  const {
    classes,
    onClose,
    onCheckForLinuxUpdates,
    open,
    updaterData,
    updaterStatus,
  } = props;

  let updaterStatusMessage;
  switch (updaterStatus) {
    case CHECKING_FOR_UPDATES:
      updaterStatusMessage = STRING_CHECKING_FOR_UPDATES;
      break;
    case UPDATE_AVAILABLE:
      if (window.platform === 'linux') {
        updaterStatusMessage = STRING_UPDATE_AVAILABLE_LINUX;
      } else {
        updaterStatusMessage = STRING_UPDATE_AVAILABLE;
      }
      break;
    case UPDATE_ERROR:
      updaterStatusMessage = STRING_UPDATE_ERROR;
      break;
    case UPDATE_PROGRESS:
      updaterStatusMessage = STRING_UPDATE_PROGRESS;
      break;
    case UPDATE_DOWNLOADED:
      updaterStatusMessage = STRING_UPDATE_DOWNLOADED;
      break;
    case UPDATE_NOT_AVAILABLE:
    default:
      updaterStatusMessage = STRING_UPDATE_NOT_AVAILABLE;
  }

  const isUpdaterRunning = (
    updaterStatus === CHECKING_FOR_UPDATES
    || updaterStatus === UPDATE_PROGRESS
    || updaterStatus === UPDATE_DOWNLOADED
    || (window.platform !== 'linux' && updaterStatus === UPDATE_AVAILABLE)
  );

  return (
    <Dialog
      className={classes.root}
      onRequestClose={onClose}
      open={open}
      transition={Transition}
    >
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_ABOUT}
      </EnhancedDialogTitle>
      <DialogContent className={classes.dialogContent}>
        <img src={iconSvg} alt="WebCatalog" className={classes.icon} />
        <Typography type="title" className={classes.title}>WebCatalog</Typography>
        <Typography type="body1" className={classes.version}>Version {window.version}</Typography>

        <Typography type="body1" className={classes.updaterStatus}>
          <span>{updaterStatusMessage}</span>
          {updaterStatus === UPDATE_AVAILABLE && updaterData.version && (
            <span>
              {` (${updaterData.version})`}
            </span>
          )}
          {updaterStatus === UPDATE_PROGRESS && updaterData.percent && (
            <span>
              {` (${updaterData.percent.toFixed(2)}%)`}
            </span>
          )}
        </Typography>

        {window.platform === 'linux' && updaterStatus === UPDATE_AVAILABLE && (
          <Button
            onClick={() => requestOpenInBrowser('https://webcatalog.io')}
            className={classes.goToTheWebsiteButton}
            raised
          >
            {STRING_GO_TO_THE_WEBSITE}
          </Button>
        )}

        {updaterStatus === UPDATE_DOWNLOADED ? (
          <Button
            color="primary"
            onClick={requestQuitAndInstall}
            raised
          >
            {STRING_UPDATE_AND_RELAUNCH}
          </Button>
        ) : (
          <Button
            color="primary"
            disabled={isUpdaterRunning}
            onClick={() => {
              if (window.platform === 'linux') {
                onCheckForLinuxUpdates();
              } else {
                requestCheckForUpdates();
              }
            }}
            raised
          >
            {STRING_CHECK_FOR_UPDATES}
          </Button>
        )}

        <Divider className={classes.divider} />

        <div className={classes.versionSmallContainer}>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>electron:</strong> {window.versions.electron}
          </Typography>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>chrome:</strong> {window.versions.chrome}
          </Typography>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>v8:</strong> {window.versions.v8}
          </Typography>
          <Typography type="body1" className={classes.versionSmall}>
            <strong>node:</strong> {window.versions.node}
          </Typography>
        </div>

        <Button
          onClick={() => requestOpenInBrowser('https://webcatalog.io')}
        >
          {STRING_WEBSITE}
        </Button>
        <br />

        <Button
          onClick={() => requestOpenInBrowser('https://webcatalog.io/release-notes')}
        >
          {STRING_RELEASE_NOTES}
        </Button>
        <br />

        <Button
          onClick={() => requestOpenInBrowser('https://webcatalog.io/terms')}
        >
          {STRING_TERMS}
        </Button>
        <br />

        <Button
          onClick={() => requestOpenInBrowser('https://webcatalog.io/privacy')}
        >
          {STRING_PRIVACY_POLICY}
        </Button>

      </DialogContent>
    </Dialog>
  );
};

About.defaultProps = {
  updaterData: {},
};

About.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCheckForLinuxUpdates: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  updaterData: PropTypes.object,
  updaterStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  open: state.dialogs.about.open,
  updaterData: state.updater.data,
  updaterStatus: state.updater.status,
});

const actionCreators = {
  close,
  checkForLinuxUpdates,
};

export default connectComponent(
  About,
  mapStateToProps,
  actionCreators,
  styles,
);
