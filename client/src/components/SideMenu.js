import React from 'react';
import AppMode from './../AppMode.js'

class SideMenu extends React.Component {

//renderModeItems -- Renders correct subset of mode menu items based on
//current mode, which is stored in this.prop.mode. Uses switch statement to
//determine mode.
renderModeMenuItems = () => {
  switch (this.props.mode) {
    case AppMode.FEED:
      return(
        <div>
        <a className="sidemenu-item">
            <span className="fa fa-users"></span>&nbsp;Followed Users</a>
        <a className="sidemenu-item ">
            <span className="fa fa-search"></span>&nbsp;Search Feed</a>
        </div>
      );
    break;
    case AppMode.ROUNDS:
      return(
        <div>
          <a className="sidemenu-item">
            <span className="fa fa-plus"></span>&nbsp;Log New Round</a>
          <a className="sidemenu-item">
            <span className="fa fa-search"></span>&nbsp;Search Rounds</a>
        </div>
      );
    break;
    case AppMode.COURSES:
      return(
        <div>
        <a className="sidemenu-item">
            <span className="fa fa-plus"></span>&nbsp;Add a Course</a>
        <a className="sidemenu-item">
            <span className="fa fa-search"></span>&nbsp;Search Courses</a>
        </div>
      );
    default:
        return null;
    }
}

getDisplayName = () => {
  if (this.props.userId == "") {
    return "";
  } else {
    const data = JSON.parse(localStorage.getItem(this.props.userId));
    return data.displayName;
  }
}

getProfilePic = () => {
  if (this.props.userId == "") {
    return "";
  } else {
    const data = JSON.parse(localStorage.getItem(this.props.userId));
    if (data.profilePicURL != "") {
      return data.profilePicURL;
    } else {
      return data.profilePicDataURL;
    }
  }
}

    render() {
       return (
        <div className={"sidemenu " + (this.props.menuOpen ? "sidemenu-open" : "sidemenu-closed")}
             onClick={this.props.toggleMenuOpen}>
          {/* SIDE MENU TITLE */}
          <div className="sidemenu-title">
            <img src={this.getProfilePic()} height='60' width='60' />
            <span id="userID" className="sidemenu-userID">&nbsp;{this.getDisplayName()}</span>
        </div>
          {/* MENU CONTENT */}
          {this.renderModeMenuItems()}
          {/* The following menu items are present regardless of mode */}
          <a id="aboutBtn" className="sidemenu-item">
            <span className="fa fa-info-circle"></span>&nbsp;About</a>
          <a id="logOutBtn" className="sidemenu-item" onClick={this.props.logOut}>
            <span className="fa fa-sign-out-alt"></span>&nbsp;Log Out</a>
        </div>
       );
    }
}

export default SideMenu;
