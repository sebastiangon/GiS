import React, { Component } from 'react';
import { NativeEventEmitter, Text, View, Button, AppState, AsyncStorage } from 'react-native';
import * as mailService from './../mail_service/mailService';

import Header from './Header/Header';
import TabBar from './TabBar/TabBar';
import Landing from './Landing/Landing';
import EmergencyContacts from './EmergencyContacts/EmergencyContacts';
import Settings from './Settings/Settings';

import * as notiService from '../utils/notificationService';
import { appTabsEnum } from '../utils/appTabsEnum';

import styles from './Styles';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: appTabsEnum.LANDING
    };
    this.setActiveTab = this.setActiveTab.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    // AsyncStorage.clear();
    AppState.addEventListener('change', this.handleAppStateChange);
    notiService.init(this.onPushNotification.bind(this));
  }

  onPushNotification(noti) {
    console.log(`onPushNotification fired ${JSON.stringify(noti)}`);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    if(appState === 'background') {
      notiService.scheduleNotification('${NotificationMessage}', new Date(Date.now() + (3 * 1000)));
    }
  }

  // handleSendMail() {
  //   const mailList = [{ to: { name: 'NOMBRE CONTACTO EMERGENCIA', mail: 'sebastiangon11@gmail.com' }, from: { name: 'NOMBRE DEL USER DE APP' } } ];
  //   mailService.sendMail(mailList);
  // }

  setActiveTab(activeTab) {
    this.setState({ activeTab });
  }

  renderTab(tab) {
    switch(tab){
      case(appTabsEnum.EMERGENCY_CONTACTS):
        return <EmergencyContacts />;
        break;
      case(appTabsEnum.LANDING):
        return <Landing />;
        break;
      case(appTabsEnum.SETTINGS):
        return <Settings />;
        break;
      default:
        return 'INVALID_TAB_VALUE';
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.activeTabContainer}>
          {this.renderTab(this.state.activeTab)}
        </View>
        <TabBar onTabSelected={this.setActiveTab} activeTab={this.state.activeTab} />
      </View>
    );
  }
}

