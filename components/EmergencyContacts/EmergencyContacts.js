import React, { Component } from 'react';
import { Text, View, ListView, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import Swipeout from 'react-native-swipeout';


import ContactDetails from '../ContactDetails/ContactDetails';
import { assets } from '../../assets/assets';
import { storage } from '../../utils/storageKeysEnum';
import styles from './Styles';

export default class EmergencyContacts extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds,
            loaded: false,
            currentContact: {},
            showDetails: false
        };
        this.ds = ds;
        this.renderEmergencyContact = this.renderEmergencyContact.bind(this);
        this.save = this.save.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.showDetails = this.showDetails.bind(this);
        this.closeDetails = this.closeDetails.bind(this);
        this.loadContacts = this.loadContacts.bind(this);
    }

    componentDidMount() {
        this.loadContacts();
    }

    async loadContacts() {
        const emergencyContacts = await AsyncStorage.getItem(storage.EMERGENCY_CONTACTS);
        if (emergencyContacts) {
            this.setState({ dataSource: this.ds.cloneWithRows( JSON.parse(emergencyContacts) ) });
        }
    }

    async save(contact) {
        try {
            let emergencyContacts = await AsyncStorage.getItem(storage.EMERGENCY_CONTACTS);
            emergencyContacts = emergencyContacts ? JSON.parse(emergencyContacts) : [];
            if (contact.id !== null && contact.id !== undefined) {
                emergencyContacts = emergencyContacts.map((cont) => {
                    if (cont.id === contact.id) {
                        return contact
                    }
                    return cont;
                });
            } else {
                const newContact = { ...contact, id: emergencyContacts.reduce((maxId, contact) => Math.max(contact.id, maxId), -1 ) + 1 }
                emergencyContacts.push(newContact);
            }
            await AsyncStorage.setItem(storage.EMERGENCY_CONTACTS, JSON.stringify(emergencyContacts));
            await this.loadContacts();
            this.closeDetails();
        } catch (error) {
            alert(`Error saving contact ${error.message}`);
        }
    }

    edit(currentContact) {
        this.setState({ currentContact });
        this.showDetails();
    }

    async delete(contact) {
        let emergencyContacts = await AsyncStorage.getItem(storage.EMERGENCY_CONTACTS);
            emergencyContacts = emergencyContacts ? JSON.parse(emergencyContacts) : [];
            emergencyContacts = emergencyContacts.filter((cont) => cont.id !== contact.id);
            await AsyncStorage.setItem(storage.EMERGENCY_CONTACTS, JSON.stringify(emergencyContacts));
            await this.loadContacts();
    }

    renderEmergencyContact(contact) {
        let swipeBtns = [{
            text: 'Delete',
            backgroundColor: 'red',
            underlayColor: '#00d',
            onPress: () => { this.delete(contact) }
          }];
      
          return (
            <Swipeout right={swipeBtns}
              autoClose={true}
              backgroundColor= 'transparent'>
                 <View style={styles.listItem}>
                     <TouchableOpacity activeOpacity={0.5} onPress={() => {this.edit(contact)}}>
                         <View>
                             <Text style={styles.listItemTitle}>{contact.name}</Text>
                             <Text style={styles.listItemDetail}>{contact.email}</Text>
                         </View>
                     </TouchableOpacity>
                </View>
            </Swipeout>
          );
    }

    showDetails() {
        this.setState({ showDetails: true });
    }

    closeDetails() {
        this.setState({ showDetails: false });
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.title}>Contactos de emergencia</Text>
                <View style={styles.separator} />
                <ListView
                    style={styles.list}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderEmergencyContact}
                />
                <TouchableOpacity activeOpacity={0.5} onPress={this.showDetails} style={styles.touchableOpacityStyle} >
                    <View style={styles.floatingButtonStyle}>
                        <Text style={styles.floatingButtonText}>+</Text>
                    </View>
                </TouchableOpacity>
                {
                    this.state.showDetails &&
                    <ContactDetails
                        name={this.state.currentContact.name}
                        email={this.state.currentContact.email}
                        id={this.state.currentContact.id}
                        close={this.closeDetails}
                        save={this.save}
                    />
                }
            </View>
        );
    }
}