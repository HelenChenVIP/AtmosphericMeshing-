//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, WebView } from 'react-native';

/**
 * Helenchen
 * 知识库
 * @class knowledge
 * @extends {Component}
 */
class knowledgeBase extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        title: '知识库',
        tabBarLable: '知识库',
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: {alignSelf: 'center'},//标题居中
        headerStyle: { backgroundColor: '#5688f6',height:45 },
        labelStyle: {fontSize: 14},
        tabBarIcon: ({ focused, tintColor }) =>
          <Image source={focused ? require('../../images/ic_me_hover.png') : require('../../images/ic_me.png')} style={{height:20,width:20}}></Image>,
      })
    constructor(props) {
        super(props); 
        this.state = {        
            scalingEnabled:true,
        }
      }
     
    render() {
        return (
            <View style={styles.container}>
                <WebView style={{backgroundColor: '#ffffff'}}
                source={{uri: 'http://172.16.12.35:8013/development/h5/Knowledge.html'}}
                scalesPageToFit={this.state.scalingEnabled}
                javaScriptEnabled={true}
                startInLoadingState={true}/>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});

//make this component available to the app
export default knowledgeBase;
