import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import searchStore from '@/store/search.store'
import CardRecentGuidePerTypeVertical from '@/components/card-recent-guide-pertype-vertical';

const Tools = () => {
    const { tool } = useLocalSearchParams();

    const getTools = searchStore((state) => state.getTools);
    const tools = searchStore((state) => state.tools);
    const isFetchingTools = searchStore((state) => state.isFetchingTools);
    const errors = searchStore((state) => state.errors);
    
    useEffect(() => {
        getTools(tool);
    }, [tool]);

    return (
        <View className='flex-1 px-4 py-2 bg-background dark:bg-background-dark'>
            <Text className='text-text text-xl dark:text-text-dark mb-4'>
                Search Results for <Text className='font-bold'>{tool}</Text>
            </Text>

            {isFetchingTools ? (
                <ActivityIndicator size="large" color="#FF5733" />
            ) : errors ? (
                <Text className='text-red-500 text-base text-center'>There was a problem fetching the results.</Text>
            ) : tools?.length === 0 ? (
                <Text className='text-gray-500 text-base text-center'>No Results</Text>
            ) : (
                <ScrollView className='w-full space-y-4'>
                    {tools.map((guide) => (
                        <View key={guide._id} className='w-full mb-2'>
                            <CardRecentGuidePerTypeVertical guide={guide} />
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    )
}

export default Tools