import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, StyleSheet } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import CustomListItem from '../components/CustomListItem';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { auth, db } from '../firebase';

const Home = ({ navigation }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('chats').onSnapshot(snapshot => {
            setChats(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                }))
            )
        })

        return unsubscribe;
    }, [])

    const signOut = () => {
        navigation.replace("Login")
        auth.signOut()
            .then(() => {
                navigation.replace("Login")
            })
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Signal",
            headerStyle: { backgroundColor: 'white' },
            headerTitleStyle: { color: 'black' },
            headerTintColor: 'black',
            headerTitleStyle: { alignSelf: 'center' },
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    {/* make opacity change on press of avatar */}
                    <TouchableOpacity onPress={signOut} activeOpacity={0.5}>
                        <Avatar
                            rounded
                            source={{
                                uri: auth?.currentUser.photoURL != null ? auth?.currentUser.photoURL : 'https://www.seekpng.com/png/detail/110-1100707_person-avatar-placeholder.png'
                            }}
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View 
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 80,
                        marginRight: 20
                    }}
                >
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name="camerao" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("AddChat")} activeOpacity={0.5}>
                        <SimpleLineIcons name="pencil" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation])

    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", {
            id,
            chatName
        })
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {chats.map(({ id, data: { chatName } }) => (
                    <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        height: '100%',
    }
})
