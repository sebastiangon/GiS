import React, { Component } from 'react';
import { Text, View, ListView, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import Swipeout from 'react-native-swipeout';


import ContactDetails from '../ContactDetails/ContactDetails';
import { assets } from '../../assets/assets';
import styles from './Styles';

export default class EmergencyContacts extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds,
            loaded: false,
            currentContact: null,
            showDetails: true
        };
        this.ds = ds;
        this.renderEmergencyContact = this.renderEmergencyContact.bind(this);
        this.edit = this.edit.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.showDetails = this.showDetails.bind(this);
        this.closeDetails = this.closeDetails.bind(this);
    }

    componentDidMount() {
        this.setState({
            dataSource: this.ds.cloneWithRows([{
                id: 1,
                name: 'Rocio Diaz',
                mail: 'rociodiaz0296@gmail.com'
            }, {
                id: 2,
                name: 'Sebastian Gonzalez',
                mail: 'sebastiangon11@gmail.com'
            }])
        });
    }

    edit(contact) {
        alert(`Contact selected ${JSON.stringify(contact)}`);
    }

    add() {
        this.showDetails();
    }

    delete(contact) {
        alert(`Delete contact ${JSON.stringify(contact)}`);
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
                             <Text style={styles.listItemDetail}>{contact.mail}</Text>
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
                <TouchableOpacity activeOpacity={0.5} onPress={this.add} style={styles.touchableOpacityStyle} >
                    <View style={styles.floatingButtonStyle}>
                        <Text style={styles.floatingButtonText}>+</Text>
                    </View>
                </TouchableOpacity>
                <ContactDetails visible={this.state.showDetails} contact={this.state.currentContact} close={this.closeDetails}/>
            </View>
        );
    }
}