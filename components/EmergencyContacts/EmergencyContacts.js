import React, { Component } from 'react';
import { Text, View, TextInput, ListView, Image, TouchableOpacity, AsyncStorage } from 'react-native';

import styles from './Styles';

export default class EmergencyContacts extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds,
            loaded: false
        };
        this.ds = ds;
        this.renderEmergencyContact = this.renderEmergencyContact.bind(this);
        this.handleContactClick = this.handleContactClick.bind(this);
    }

    componentDidMount() {
        this.setState({
            dataSource: this.ds.cloneWithRows([{
                name: 'Rocio Diaz',
                mail: 'chinii96@gmail.com'
            }, {
                name: 'Sebastian Gonzalez',
                mail: 'sebastiangon11@gmail.com'
            }])
        });
    }

    handleContactClick() {
        alert('Contact selected');
    }

    sampleFunction() {
        alert('Add Contact');
    }

    renderEmergencyContact(contact) {
        return(
            <TouchableOpacity activeOpacity={0.5} onPress={this.handleContactClick}>
                <View style={styles.listItem}>
                    <Text style={styles.listItemTitle}>{contact.name}</Text>
                    <Text style={styles.listItemDetail}>{contact.mail}</Text>
                </View>
            </TouchableOpacity>
        );
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
                <TouchableOpacity activeOpacity={0.5} onPress={this.sampleFunction} style={styles.touchableOpacityStyle} >
                    <View style={styles.floatingButtonStyle}>
                        <Text style={styles.floatingButtonText}>+</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}