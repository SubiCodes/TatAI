import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
  } from "react-native";
  import React, { useCallback, useRef, useState } from "react";
  import { AntDesign } from "@expo/vector-icons";
  
  type OptionItem = {
    value: string;
    label: string;
  };
  
  interface DropDownProps {
    data: OptionItem[];
    onChange: (item: OptionItem) => void;
    placeholder: string;
    height: number;
    color: string;
  }
  
  export default function Dropdown({ data, onChange, placeholder, height, color }: DropDownProps) {
    const [expanded, setExpanded] = useState(false);
    const [value, setValue] = useState("");
    const buttonRef = useRef<View>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
    const toggleExpanded = useCallback(() => {
      if (!expanded) {
        buttonRef.current?.measureInWindow((x, y, width, buttonHeight) => {
          setDropdownPosition({
            top: y + buttonHeight,
            left: x,
            width,
          });
        });
      }
      setExpanded(!expanded);
    }, [expanded]);
  
    const onSelect = useCallback((item: OptionItem) => {
      onChange(item);
      setValue(item.label);
      setExpanded(false);
    }, []);
  
    return (
      <View ref={buttonRef}>
        <TouchableOpacity
          style={[styles.button, { height, borderColor: color }]}
          activeOpacity={0.8}
          onPress={toggleExpanded}
        >
          <Text style={styles.text}>{value || placeholder}</Text>
          <AntDesign name={expanded ? "caretup" : "caretdown"} />
        </TouchableOpacity>
  
        {expanded && (
          <Modal visible={expanded} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
              <View style={styles.backdrop}>
                <View
                  style={[
                    styles.options,
                    {
                      position: "absolute",
                      top: dropdownPosition.top,
                      left: dropdownPosition.left,
                      width: dropdownPosition.width,
                    },
                  ]}
                >
                  <FlatList
                    keyExtractor={(item) => item.value}
                    data={data}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.optionItem}
                        onPress={() => onSelect(item)}
                      >
                        <Text>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    backdrop: {
      flex: 1,
    },
    optionItem: {
      height: 40,
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    separator: {
      height: 4,
    },
    options: {
      backgroundColor: "white",
      padding: 10,
      borderRadius: 6,
      maxHeight: 250,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    text: {
      fontSize: 15,
      opacity: 0.8,
    },
    button: {
      justifyContent: "space-between",
      backgroundColor: "white",
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      paddingHorizontal: 15,
      borderRadius: 4,
      borderWidth: 2,
    },
  });
