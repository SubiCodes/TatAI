import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import React, { useEffect } from "react";
import { useState, useRef } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import Dropdown from "@/components/dropdown.tsx";
import CheckBox from "expo-checkbox";
import { Link } from "expo-router";

const SignUp = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [rePassword, setRePassword] = useState("");
  const [showRePassword, setShowRePassword] = useState(true);
  const [isPasswordMatch, setIsPassswordMatch] = useState(true);

  const [strength, setStrength] = useState(0);
  const [strengthTerm, setStrengthTerm] = useState("weak");
  const [loading, setLoading] = useState(false);

  const [aggreed, setAgreed] = useState(false);

  const isFirstRun = useRef(true);

  const checkPasswordStrength = async () => {
    let score = 0;
    const hasMinLength = password.length >= 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasMinLength || !(hasLetter && hasNumber)) {
      setStrength(0);
      setStrengthTerm("Weak");
      return;
    }

    score++;
    score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    if (password.length >= 10) score++;

    setStrength(score);

    if (score <= 1) {
      setStrengthTerm("Weak");
    }
    if (score > 1) {
      setStrengthTerm("Good");
    }
    if (score > 3) {
      setStrengthTerm("Strong");
    }
  };

  useEffect(() => {
    checkPasswordStrength();
  }, [password]);

  const checkPasswordMatch = async() => {
    if (password !== rePassword){
      setIsPassswordMatch(false);
    }
    else {
      setIsPassswordMatch(true);
    }
  }

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false; // Skip first render
      return;
    }
    checkPasswordMatch();
  }, [password]);

  const checkEmailValidity = async () => {
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (emailFormat){
      setIsEmailValid(true);
    }
    else{
      setIsEmailValid(false);
    }
  }
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false; // Skip first render
      return;
    }
    checkEmailValidity();
  }, [email]);


  return (
    <>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <SafeAreaView className="h-[100%] w-screen flex justify-center items-center flex-col bg-background ">
        <ScrollView
          className="flex-1 gap-4 min-h-[100%] overflow-y-auto px-12 pt-28"
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            width: 320,
          }}
        >
          <View className="flex-row justify-between items-center w-80 self-start">
            <View className="flex-col gap-2">
              <Text className="font-extrabold text-4xl">Sign up</Text>
              <Text className="text-base text-gray-500">
                Create an account to get started
              </Text>
            </View>
          </View>

          <View className="flex-col w-80 self-start gap-4">
            <View className="w-80 items-start gap-2 self-start">
              <Text className="text-lg font-bold">First Name</Text>
              <TextInput
                placeholder="Enter First Name"
                className="h-12 w-80 border-black border-2 rounded-md bg-white"
              ></TextInput>
            </View>

            <View className="w-80 items-start gap-2 self-start ">
              <Text className="text-lg font-bold">Last Name</Text>
              <TextInput
                placeholder="Enter Last Name"
                className="h-12 w-80 border-black border-2 rounded-md bg-white"
              ></TextInput>
            </View>

            <View className="w-80 items-start gap-2 self-start">
              <Text className="text-lg font-bold">Enter Birthdate</Text>
              <TouchableOpacity onPress={() => setOpen(true)}>
                <TextInput
                  placeholder="e.g. 01/01/2001"
                  className="h-12 w-80 border-black border-2 rounded-md p-2 bg-white"
                  editable={false}
                  value={date ? date.toLocaleDateString("en-US") : ""}
                />
              </TouchableOpacity>
              {open && (
                <DateTimePicker
                  value={date || new Date()}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setOpen(false);
                    if (selectedDate) {
                      setDate(selectedDate);
                    }
                  }}
                />
              )}
            </View>

            <View className="w-80 items-start gap-2 self-start">
              <Text className="text-lg font-bold">Gender</Text>
              <Dropdown
                data={[
                  { value: "Male", label: "♂️ Male" },
                  { value: "Female", label: "♀️ Female" },
                  { value: "Non-Binary", label: "🏳️‍🌈 Non-Binary" },
                  { value: "Rather not say", label: "🤐 Rather not say" },
                ]}
                onChange={(item) => setGender(item.value)}
                placeholder="Gender"
                height={40}
              />
            </View>

            <View className="w-80 items-start gap-2 self-start">
              <Text className="text-lg font-bold">Email Address</Text>
              <TextInput
                placeholder="Enter Email Address"
                className="h-12 w-80 border-black border-2 rounded-md bg-white"
                style={{borderColor: isEmailValid ? "black" : "red",}}
              ></TextInput>
              {!isEmailValid ? (<Text className="font-bold text-sm text-red-600 md:text-xl">❗ Invalid Email Format</Text>) : (<></>)}
            </View>

            <View className="w-80 items-start gap-2 md:w-3/5">
              <Text className="text-base font-bold md:text-2xl">
                New Password
              </Text>
              <TextInput
                placeholder="Enter Password"
                className="h-12 w-80 border-black border-2 rounded-md md:w-full md:h-16 bg-white"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={showPassword}
              ></TextInput>

              <View className="flex-row items-center gap-4 mr-auto mb-2 md:gap-8 md:mb-6 ">
                <View className="flex-row items-center justify-center gap-1 mr-auto">
                  <Text className="font-bold text-sm md:text-xl">
                    ⓘ Password Strength:
                  </Text>
                  <Text
                    className={`font-bold md:text-xl ${
                      strengthTerm === "Weak"
                        ? "text-red-500"
                        : strengthTerm === "Good"
                        ? "text-lime-400"
                        : "text-green-500"
                    }`}
                  >
                    {strengthTerm}
                  </Text>
                </View>

                <View className="flex-row items-center justify-center gap-1 mr-auto md:gap-2">
                  <CheckBox
                    value={!showPassword}
                    onValueChange={(newValue) => setShowPassword(!newValue)}
                    color={"black"}
                    className="transform scale-75 md:transform md:scale-150"
                  />
                  <Text className="text-sm md:text-lg">Show password</Text>
                </View>
              </View>

              <Text className="text-base font-bold md:text-2xl">
                Re-enter Password
              </Text>
              <TextInput
                placeholder="Re-enter Password"
                className="h-12 w-80 border-black border-2 rounded-md md:w-full md:h-16 bg-white"
                value={rePassword}
                onChangeText={(text) => setRePassword(text)}
                secureTextEntry={showRePassword}
              ></TextInput>

              <View className="flex-row items-center gap-8 mr-auto mb-2 md:gap-14 md:mb-4">
                <Text className="font-bold text-sm md:text-xl">
                  ⓘ Re-enter you password
                </Text>
                <View className="flex-row items-center gap-1 mr-auto md:gap-2">
                  <CheckBox
                    value={!showRePassword}
                    onValueChange={(newValue) => setShowRePassword(!newValue)}
                    color={"black"}
                    className="transform scale-75 md:transform md:scale-150"
                  />
                  <Text className="text-sm md:text-lg">Show password</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-center gap-6 w-80 mr-auto">
            <CheckBox
              value={aggreed}
              onValueChange={(newValue) => setAgreed(newValue)}
              color={"black"}
              className="transform scale-125"
            />
            <Text className="text-sm max-w-64 md:text-lg">
              I've read and agree with the <Link href={'/terms-conditions'} className="font-bold">Terms and Conditions</Link> and the <Link  className="font-bold" href={'/terms-conditions'}>Privacy Policy</Link>
              </Text>
          </View>

          <View className="flex-row items-center justify-center gap-6 w-80 mr-auto">
            <TouchableOpacity className='w-80 h-12 items-center justify-center bg-blue-700 rounded-md md:w-3/5'>
              {loading ? (<ActivityIndicator size={'small'} color={'white'}/>) : (
              <Text className='text-lg text-white font-bold '> Change Password</Text>
              )}
            </TouchableOpacity>
          </View>

         

          <View className="min-h-40"></View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SignUp;
