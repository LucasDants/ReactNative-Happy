import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons'
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps'
import mapMarker from '../images/mapMarker.png'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface Orphanage {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
}

const OrphanagesMap: React.FC = () => {
    const navigation = useNavigation()

    const [orphanages, setOrphanages] = useState<Orphanage[]>([])

    useFocusEffect(() => {
        api.get('/orphanages').then(response => {
            setOrphanages(response.data)
        })
    })

    function handleNavigateToOrphanagesDetails(id: number) {
        navigation.navigate('OrphanagesDetails', { id })
    }
    function handleNavigateToCreateOrphanage() {
        navigation.navigate('SelectMapPosition')
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: -3.8079951,
                    longitude: -38.5367151,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008,
                }} >

                {orphanages.map(orphanage => {
                    return (
                        <Marker key={orphanage.id} icon={mapMarker} coordinate={{
                            latitude: orphanage.latitude,
                            longitude: orphanage.longitude,
                        }}
                            calloutAnchor={{
                                x: 2.7,
                                y: 0.8
                            }}
                        >
                            <Callout tooltip={true} onPress={() => handleNavigateToOrphanagesDetails(orphanage.id)}>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutText}>{orphanage.name}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    )
                })}
            
            </MapView>
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    {orphanages.length} orfanatos encontrados.
                </Text>
                <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanage}>
                    <Feather name="plus" size={20} color="#fff" />
                </RectButton>
            </View>
        </View>
    )
}


export default OrphanagesMap;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    calloutContainer: {
        width: 160,
        height: 46,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 16,
        justifyContent: 'center',
    },
    calloutText: {
        color: '#0089a5',
        fontSize: 14,
        fontFamily: 'Nunito_700Bold'
    },
    footer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 32,
        backgroundColor: '#fff',
        borderRadius: 20,
        height: 46,
        paddingLeft: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 3,

    },
    footerText: {
        color: '#8fa7b3',
        fontFamily: 'Nunito_700Bold'
    },
    createOrphanageButton: {
        width: 56,
        height: 56,
        backgroundColor: '#15c3d6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'

    }
});
