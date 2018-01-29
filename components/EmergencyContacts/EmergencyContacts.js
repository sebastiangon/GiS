import React, { Component } from 'react';
import { Text, View, Button, ListView, Image, TouchableOpacity, Modal, AsyncStorage } from 'react-native';
import Swipeout from 'react-native-swipeout';

import { assets } from '../../assets/assets';
import styles from './Styles';

export default class EmergencyContacts extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds,
            loaded: false,
            adding: true
        };
        this.ds = ds;
        this.renderEmergencyContact = this.renderEmergencyContact.bind(this);
        this.edit = this.edit.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        this.setState({
            dataSource: this.ds.cloneWithRows([{
                name: 'Rocio Diaz',
                mail: 'rociodiaz0296@gmail.com'
            }, {
                name: 'Sebastian Gonzalez',
                mail: 'sebastiangon11@gmail.com'
            }])
        });
    }

    edit(contact) {
        alert(`Contact selected ${JSON.stringify(contact)}`);
    }

    add() {
        alert(`Add Contact`);
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

    closeAddModal() {
        this.setState({ adding: false });
    }

    renderAddModal() {
        // return(
        //     <Modal
        //         visible={this.state.adding}
        //         animationType={'slide'}
        //         onRequestClose={() => this.closeAddModal()}
        //     >
        //         <View style={ { flex: 1, backgroundColor: 'green' }}>
        //             <View style={ { marginTop: 70 } }>
        //                 <Text>This is content inside of modal component</Text>
        //                 <Button
        //                     onPress={() => this.closeAddModal()}
        //                     title="Close modal"
        //                 >
        //                 </Button>
        //             </View>
        //         </View>
        //   </Modal>
        // );
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
                { this.state.adding && this.renderAddModal() }
            </View>
        );
    }
}