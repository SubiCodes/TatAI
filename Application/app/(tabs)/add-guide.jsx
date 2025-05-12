import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, FlatList, Alert } from 'react-native'
import { Modal } from 'react-native';
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';

import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Video } from 'expo-av';

const AddGuide = () => {

    const [type, setType] = useState('repair');
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [coverImage, setCoverImage] = useState(null);
    const [toolInput, setToolInput] = useState('');
    const [tools, setTools] = useState([]);
    const [materialsNeeded, setMaterialsNeeded] = useState('');
    const [stepTitles, setStepTitles] = useState(['']);
    const [stepDescriptions, setStepDescriptions] = useState(['']);
    const [stepMedia, setStepMedia] = useState([null]);
    const [closingMessage, setClosingMessage] = useState('');
    const [additionalLinks, setAdditionalLinks] = useState('');

    const [displayImage, setDisplayImage] = useState();
    const [isOpen, setIsOpen] = useState(false);

    const clearAll = () => {
        setType('repair')
        setTitle('');
        setDescription('');
        setCoverImage(null);
        setToolInput('');
        setTools([]);
        setMaterialsNeeded('');
        setStepTitles(['']);
        setStepDescriptions(['']);
        setStepMedia([null]);
        setClosingMessage('');
        setAdditionalLinks('');
        setDisplayImage();
    }

    // Add a new step when the button is clicked
    const addStep = () => {
        setStepTitles([...stepTitles, ""]);
        setStepDescriptions([...stepDescriptions, ""]);
        setStepMedia([...stepMedia, null]);
    };

    //delete step
    const deleteStep = (indexToDelete) => {
        if (stepTitles.length <= 1) return;

        setStepTitles(stepTitles.filter((_, index) => index !== indexToDelete));
        setStepDescriptions(stepDescriptions.filter((_, index) => index !== indexToDelete));
        setStepMedia(stepMedia.filter((_, index) => index !== indexToDelete));
    };

    //Handle Inputting of Cover Image
    const handlePickCoverImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission required", "Please allow media access.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.7,
        });

        if (!result.canceled) {
            setCoverImage(result.assets[0].uri);
        }
    };

    //Handle Inputting of Cover Image
    const handleTakeCoverPhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission required", "Please allow camera access.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.7,
        });

        if (!result.canceled) {
            setCoverImage(result.assets[0].uri);
        }
    };

    //Handle Step Medias
    const handlePickStepMedia = async (index) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            quality: 1,
            videoMaxDuration: 60,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const type = asset.type === 'video' ? 'video' : 'image';

            if (type === 'video' && asset.duration && asset.duration > 60000) {
                Alert.alert("Video too long", "Please input a video no longer than a minute.");
                return;
            }

            const updatedMedia = [...stepMedia];
            updatedMedia[index] = { uri: asset.uri, type };
            setStepMedia(updatedMedia);
        }
    };

    //Handle Step Medias
    const handleTakeStepMedia = async (index) => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const type = asset.type === 'video' ? 'video' : 'image';

            const updatedMedia = [...stepMedia];
            updatedMedia[index] = { uri: asset.uri, type };
            setStepMedia(updatedMedia); // ✅ update at the correct index
        }
    };

    //Adding of tools
    const addTool = () => {
        if (toolInput.trim()) {
            setTools(prev => [...prev, toolInput.trim()]);
            setToolInput('');
        }
    };

    const removeTool = (index) => {
        setTools(prev => prev.filter((_, i) => i !== index));
    };

    //Submitting of guide
    const handlePostGuide = async () => {
        if (!type) {
            Alert.alert("Empty Field", "Please select a type for your guide");
            return;
        }

        if (!title?.trim()) {
            Alert.alert("Empty Field", "Please select a title for your guide");
            return;
        }

        if (!description?.trim()) {
            Alert.alert("Empty Field", "Please select a description for your guide");
            return;
        }

        if (!coverImage) {
            Alert.alert("Empty Field", "Please select a cover image for your guide");
            return;
        }

        if (type !== 'tool') {
            if (tools.length === 0 || (tools.length === 1 && !tools[0]?.trim())) {
                Alert.alert("Empty Field", "Please list the tools needed.");
                return;
            }

            if (type !== 'repair') {
                if (!materialsNeeded?.trim()) {
                    Alert.alert("Empty Field", "Please list materials needed.");
                    return;
                }
            }
        }

        for (let i = 0; i < stepTitles.length; i++) {
            if (!stepTitles[i]?.trim()) {
                Alert.alert("Empty Field", `Please enter a title for Step ${i + 1}`);
                return;
            }

            if (!stepDescriptions[i]?.trim()) {
                Alert.alert("Empty Field", `Please enter a description for Step ${i + 1}`);
                return;
            }

            if (!stepMedia[i]) {
                Alert.alert("Empty Field", `Please upload a media for Step ${i + 1}`);
                return;
            }
        }


        if (!closingMessage?.trim()) {
            Alert.alert("Empty Field", "Please provide a closing message for your guide");
            return;
        }

        // If all validations pass, proceed
        // Your submission logic goes here
    };


    return (
        <View className='w-full h-full bg-background dark:bg-background-dark'>

            {/* Floating Header */}
            <View className='w-full flex-row justify-center py-4 px-6 bg-white dark:bg-[#2A2A2A]'>
                <View className='items-center justify-center'>
                    <Text className='text-text text-xl dark:text-text-dark font-bold'>Create guide</Text>
                </View>
                <View className='flex-1' />
                <View className='flex-1 items-end justify-center'>
                    <TouchableOpacity
                        className='items-center justify-center flex-row bg-red-400 px-6 py-2 rounded-full'
                        onPress={() => {
                            Alert.alert(
                                "Clear Guide",
                                "Are you sure you want to clear all guide fields?",
                                [
                                    {
                                        text: "Cancel",
                                        style: "cancel",
                                    },
                                    {
                                        text: "Yes, Clear",
                                        style: "destructive",
                                        onPress: () => clearAll(),
                                    },
                                ]
                            );
                        }}
                    >
                        <Text className='text-text-dark'>
                            <EvilIcons name="trash" size={24} />
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                className="flex-1 z-50"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50, paddingTop: 20, paddingHorizontal: 20, gap: 20 }}
            >

                {/* Category */}
                <View className="w-full flex-col gap-2">
                    <Text className="text-text font-bold text-xl dark:text-text-dark">Guide Title</Text>
                    <View className='w-full flex flex-wrap flex-row gap-2'>
                        <TouchableOpacity className={`border rounded-2xl px-4 py-2  ${type === 'repair' ? ('border-primary dark:border-secondary') : ('border-gray-300 dark:border-gray-600')}`} onPress={() => { setType("repair") }}>
                            <Text className={`${type === 'repair' ? ("text-primary dark:text-secondary") : ("text-text dark:text-text-dark")} flex items-center justify-center text-lg`}><MaterialIcons name="home-repair-service" size={18} />  Repair</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className={`border rounded-2xl px-4 py-2  ${type === 'tool' ? ('border-primary dark:border-secondary') : ('border-gray-300 dark:border-gray-600')}`} onPress={() => { setType("tool") }}>
                            <Text className={`${type === 'tool' ? ("text-primary dark:text-secondary") : ("text-text dark:text-text-dark")} flex items-center justify-center text-lg`}><AntDesign name="tool" size={18} />  Tool</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className={`border rounded-2xl px-4 py-2  ${type === 'diy' ? ('border-primary dark:border-secondary') : ('border-gray-300 dark:border-gray-600')}`} onPress={() => { setType("diy") }}>
                            <Text className={`${type === 'diy' ? ("text-primary dark:text-secondary") : ("text-text dark:text-text-dark")} flex items-center justify-center text-lg`}><MaterialCommunityIcons name="table-furniture" size={18} /> DIY</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Title */}
                <View className="w-full flex-col gap-2">
                    <Text className="text-text font-bold text-xl dark:text-text-dark">Guide Title</Text>
                    <TextInput
                        placeholder="Enter your guide title"
                        placeholderTextColor="#9ca3af" // gray-400
                        className="text-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1f1f] text-black dark:text-white px-4 py-2 rounded-lg"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Description */}
                <View className="w-full flex-col gap-2">
                    <Text className="text-text font-bold text-xl dark:text-text-dark">Guide Description</Text>
                    <View className={`h-40 border border-gray-300 dark:border-gray-600 rounded-xl px-2 py-0 bg-white dark:bg-[#1f1f1f] mb-1`}>
                        <TextInput
                            placeholder="Write your message..."
                            placeholderTextColor="#9ca3af"
                            multiline
                            textAlignVertical="top"
                            className="text-base text-text h-full dark:text-text-dark"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>
                </View>


                {/* Cover */}
                <View className="w-full flex-col gap-2">
                    <Text className="text-text font-bold text-xl dark:text-text-dark">Guide Cover</Text>

                    {coverImage ? (
                        // Apply onPress then disply image here
                        <TouchableOpacity onPress={() => {
                            setDisplayImage(coverImage);
                            setIsOpen(true);
                        }}>
                            <Image
                                source={{ uri: coverImage }}
                                className="w-full h-56 rounded-xl mb-2"
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ) : (
                        <View className={`w-full h-56 border border-gray-300 dark:border-gray-600 rounded-xl px-2 py-0 bg-white dark:bg-[#1f1f1f] items-center justify-center gap-2`}>
                            <Text className='text-gray-300 dark:text-gray-600 '><FontAwesome name="image" size={50} /></Text>
                            <Text className='text-gray-300 dark:text-gray-600'>Input Cover Image</Text>
                        </View>
                    )}

                    <View className="flex-row gap-3 mt-2">
                        <TouchableOpacity
                            onPress={handlePickCoverImage}
                            className="flex-1 flex-row items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 py-3 rounded-full shadow-md"
                        >
                            <Ionicons name="image-outline" size={20} color="white" />
                            <Text className="text-white font-medium text-sm">Open Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleTakeCoverPhoto}
                            className="flex-1 flex-row items-center justify-center gap-2 bg-emerald-600 dark:bg-emerald-500 py-3 rounded-full shadow-md"
                        >
                            <Ionicons name="camera-outline" size={20} color="white" />
                            <Text className="text-white font-medium text-sm">Take a Photo</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tools */}
                {type !== 'tool' ? (
                    <View className="w-full flex-col gap-2">
                        <Text className="text-text font-bold text-xl dark:text-text-dark">Tools Needed</Text>
                        <View className='w-full flex-row gap-2'>
                            <TextInput
                                placeholder="Enter tools"
                                placeholderTextColor="#9ca3af" // gray-400
                                className="flex-1 text-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1f1f] text-black dark:text-white px-4 py-2 rounded-lg"
                                value={toolInput}
                                onChangeText={setToolInput}
                                onSubmitEditing={addTool}
                            />
                            <TouchableOpacity className='w-auto items-center justify-center px-4  bg-white border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800' onPress={addTool}>
                                <Text className='text-base font-bold text-text dark:text-text-dark'>Add</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Diplay tools here with minus button */}
                        {tools.map((tool, index) => (
                            <View key={index} className="flex-row items-center justify-between px-4 py-2 mt-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <Text className="text-black dark:text-white">{tool}</Text>
                                <TouchableOpacity onPress={() => removeTool(index)}>
                                    <Text className="text-red-500 font-bold">−</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                ) : null}

                {/* Materials Needed */}
                {type === 'diy' ? (
                    <View className="w-full flex-col gap-2">
                        <Text className="text-text font-bold text-xl dark:text-text-dark">Materials Needed</Text>
                        <View className={`h-40 border border-gray-300 dark:border-gray-600 rounded-xl px-2 py-0 bg-white dark:bg-[#1f1f1f] mb-1`}>
                            <TextInput
                                placeholder="Enter materials..."
                                placeholderTextColor="#9ca3af"
                                multiline
                                textAlignVertical="top"
                                className="text-base text-text h-full dark:text-text-dark"
                                value={materialsNeeded}
                                onChangeText={setMaterialsNeeded}
                            />
                        </View>
                    </View>
                ) : null}

                {/* Procedures or Use Cases */}
                <View className='w-full items-center justify-center mt-8'>
                    <Text className="text-text font-bold text-xl dark:text-text-dark">
                        {type === 'tools' ? "Use Cases" : "Procedures"}
                    </Text>
                </View>

                {/* Steps or Uses */}
                {stepTitles.map((title, index) => (
                    <View key={index} className="w-full flex-col gap-4">

                        {/* Step or Use Title */}
                        <View className="w-full flex-row gap-4 items-center">
                            <Text className="text-text font-bold text-xl dark:text-text-dark">
                                {type === 'tool' ? `Use ${index + 1}:` : `Step ${index + 1}:`}
                            </Text>
                            <TextInput
                                placeholder="Enter your guide title"
                                placeholderTextColor="#9ca3af"
                                className="flex-1 text-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1f1f] text-black dark:text-white px-4 py-2 rounded-lg"
                                value={stepTitles[index]}
                                onChangeText={(text) => {
                                    const newTitles = [...stepTitles];
                                    newTitles[index] = text;
                                    setStepTitles(newTitles);
                                }}
                            />
                        </View>

                        {/* Step or Use Description */}
                        <View className="h-40 border border-gray-300 dark:border-gray-600 rounded-xl px-2 py-0 bg-white dark:bg-[#1f1f1f] mb-1">
                            <TextInput
                                placeholder="In-depth description"
                                placeholderTextColor="#9ca3af"
                                multiline
                                textAlignVertical="top"
                                className="text-base text-text h-full dark:text-text-dark"
                                value={stepDescriptions[index]}
                                onChangeText={(text) => {
                                    const newDescriptions = [...stepDescriptions];
                                    newDescriptions[index] = text;
                                    setStepDescriptions(newDescriptions);
                                }}
                            />
                        </View>

                        {/* Image or Video for the Step */}
                        <View className="w-full flex-col gap-2">
                            {stepMedia[index] ? (
                                stepMedia[index].type === 'video' ? (
                                    <Video
                                        source={{ uri: stepMedia[index].uri }}
                                        useNativeControls
                                        resizeMode="cover"
                                        style={{
                                            width: '100%',
                                            height: 208, // same as h-52 (52 * 4)
                                            borderRadius: 12,
                                        }}
                                    />
                                ) : (
                                    <TouchableOpacity
                                     onPress={() => {
                                        setDisplayImage(stepMedia[index].uri);
                                        setIsOpen(true);}}>
                                        <Image
                                            source={{ uri: stepMedia[index].uri }}
                                            className="w-full h-52 rounded-xl"
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>

                                )
                            ) : (
                                <View className="w-full h-56 border border-gray-300 dark:border-gray-600 rounded-xl px-2 py-0 bg-white dark:bg-[#1f1f1f] items-center justify-center gap-2">
                                    <Text className="text-gray-300 dark:text-gray-600">
                                        <FontAwesome name="image" size={50} />
                                    </Text>
                                    <Text className="text-gray-300 dark:text-gray-600">Input a media</Text>
                                </View>
                            )}

                            {/* Media Buttons */}
                            <View className="flex-row gap-3 mt-2">
                                <TouchableOpacity
                                    onPress={() => handlePickStepMedia(index)}
                                    className="flex-1 flex-row items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 py-3 rounded-full shadow-md"
                                >
                                    <Ionicons name="image-outline" size={20} color="white" />
                                    <Text className="text-white font-medium text-sm">Open Gallery</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleTakeStepMedia(index)}
                                    className="flex-1 flex-row items-center justify-center gap-2 bg-emerald-600 dark:bg-emerald-500 py-3 rounded-full shadow-md"
                                >
                                    <Ionicons name="camera-outline" size={20} color="white" />
                                    <Text className="text-white font-medium text-sm">Capture Media</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {index > 0 && (
                            <TouchableOpacity className='w-full items-center justify-center px-4 py-2 border rounded-lg border-red-500  mt-2' onPress={() => deleteStep(index)}>
                                <Text className='text-lg font-bold text-text dark:text-text-dark'>Remove {type !== 'tool' ? "Step" : "Use"}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}


                <TouchableOpacity className='w-full items-center justify-center px-4 py-2  bg-white border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 mt-2' onPress={addStep}>
                    <Text className='text-lg font-bold text-text dark:text-text-dark'>Add</Text>
                </TouchableOpacity>

                {/* Closing Message */}
                <View className="w-full flex-col gap-2">
                    <Text className="text-text font-bold text-xl dark:text-text-dark">Closing Message</Text>
                    <View className={`h-40 border border-gray-300 dark:border-gray-600 rounded-xl px-2 py-0 bg-white dark:bg-[#1f1f1f] mb-1`}>
                        <TextInput
                            placeholder="Write your message..."
                            placeholderTextColor="#9ca3af"
                            multiline
                            textAlignVertical="top"
                            className="text-base text-text h-full dark:text-text-dark"
                            value={closingMessage}
                            onChangeText={setClosingMessage}
                        />
                    </View>
                </View>

                {/* Additional Links */}
                <View className="w-full flex-col gap-2">
                    <Text className="text-text font-bold text-xl dark:text-text-dark">Additional Links</Text>
                    <View className={`h-40 border border-gray-300 dark:border-gray-600 rounded-xl px-2 py-0 bg-white dark:bg-[#1f1f1f] mb-1`}>
                        <TextInput
                            placeholder="Only valid links will be rendered..."
                            placeholderTextColor="#9ca3af"
                            multiline
                            textAlignVertical="top"
                            className="text-base text-text h-full dark:text-text-dark"
                            value={additionalLinks}
                            onChangeText={setAdditionalLinks}
                        />
                    </View>
                </View>

                {/* Post Button */}
                <TouchableOpacity className='w-full items-center justify-center px-4 py-2  bg-primary rounded-lg  dark:bg-secondary mt-2' onPress={() => handlePostGuide()}>
                    <Text className='text-lg font-bold text-text-dark'>Post Guide</Text>
                </TouchableOpacity>


            </ScrollView>

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                    }}
                >
                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={() => setIsOpen(false)}
                        style={{
                            position: 'absolute',
                            top: 50,
                            right: 20,
                            zIndex: 10,
                            borderRadius: 20,
                        }}

                        className='bg-gray-300 w-12 h-12 rounded-full items-center justify-center'
                    >
                        <MaterialCommunityIcons name="close-thick" size={24} color="black" />
                    </TouchableOpacity>

                    {/* Fullscreen Image */}
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => setIsOpen(false)}
                        activeOpacity={1}
                    >
                        <Image
                            source={{ uri: displayImage }}
                            style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'contain',
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>

        </View>
    )
}

export default AddGuide