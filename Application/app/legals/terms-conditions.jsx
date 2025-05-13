import React, { useEffect, useState } from 'react';
import { ScrollView, useWindowDimensions, ActivityIndicator, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const TermsAndConditions = () => {
  const { width } = useWindowDimensions();
  const [htmlContent, setHtmlContent] = useState(null);

  useEffect(() => {
    const loadHtml = async () => {
      try {
        const asset = Asset.fromModule(require('../../assets/terms-conditions.html'));
        await asset.downloadAsync(); // ensures it's available locally
        const content = await FileSystem.readAsStringAsync(asset.localUri);
        setHtmlContent(content);
      } catch (err) {
        console.error('Error loading HTML file:', err);
      }
    };

    loadHtml();
  }, []);

  // Define custom styles for the HTML tags
  const tagsStyles = {
    h1: { fontSize: 28, fontWeight: 'bold', marginVertical: 10 },
    h2: { fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
    h3: { fontSize: 20, fontWeight: 'bold', marginVertical: 6 },
    p: { fontSize: 16, marginVertical: 4, lineHeight: 24 },
    li: { fontSize: 16, marginVertical: 2 },
    strong: { fontWeight: 'bold' },
    div: { marginVertical: 4 }, // Fix for white box issue
    ul: { paddingLeft: 20, marginVertical: 4 },
    ol: { paddingLeft: 20, marginVertical: 4 },
  };

  if (!htmlContent) {
    return <ActivityIndicator size="large" className="mt-10" />;
  }

  return (
    <ScrollView style={{ padding: 16, paddingBottom: 30 }}>
      <RenderHtml
        contentWidth={width}
        source={{ html: htmlContent }} // Apply custom styles
      />
      <View className='border'/>
    </ScrollView>
  );
};

export default TermsAndConditions;
