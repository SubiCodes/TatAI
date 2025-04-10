import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import React, { useEffect } from "react";
import { useState, useRef } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import Dropdown from "@/components/dropdown.tsx";
import CheckBox from "expo-checkbox";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_URL } from "@/constants/links.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {
  const router = useRouter();

  const today = new Date();
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [gender, setGender] = useState("");
  const [open, setOpen] = useState(false);

  const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false);
  const [isLastNameEmpty, setIsLastNameEmpty] = useState(false);
  const [isBirthdateEmpty, setIsBirthdateEmpty] = useState(false);
  const [isGenderEmpty, setIsGenderEmpty] = useState(false);

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordvalid] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [rePassword, setRePassword] = useState("");
  const [showRePassword, setShowRePassword] = useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  const [strength, setStrength] = useState(0);
  const [strengthTerm, setStrengthTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [aggreed, setAgreed] = useState(false);

  const isFirstRunFirstName = useRef(true);
  const isFirstRunLastName = useRef(true);
  const isFirstRunEmail = useRef(true);
  const isFirstRunPassword = useRef(true);

  const checkFieldValidity = async () => {
    firstName.trim() === "" ? (setIsFirstNameEmpty(true)) : (setIsFirstNameEmpty(false));
    lastName.trim() === "" ? (setIsLastNameEmpty(true)) : (setIsLastNameEmpty(false));
    birthDate ===  null ? (setIsBirthdateEmpty(true)) : (setIsBirthdateEmpty(false));
    gender.trim() === "" ? (setIsGenderEmpty(true)) : (setIsGenderEmpty(false));
  }

  const checkFirstNameValidity = () => {
    firstName.trim() === "" ? (setIsFirstNameEmpty(true)) : (setIsFirstNameEmpty(false));
  }

  useEffect(() => {
    if (isFirstRunFirstName.current) {
      isFirstRunFirstName.current = false; 
      return;
    }
    checkFirstNameValidity();
  }, [firstName]);

  const checkLastNameValidity = () => {
    lastName.trim() === "" ? (setIsLastNameEmpty(true)) : (setIsLastNameEmpty(false));
  }

  useEffect(() => {
    if (isFirstRunLastName.current) {
      isFirstRunLastName.current = false; 
      return;
    }
    checkLastNameValidity();
  }, [lastName]);

  const handleDropdownChange = (item) => {
    setGender(item.value);
    setIsGenderEmpty(false);
  };

  const checkPasswordStrength = async () => {
    let score = 0;
    const hasMinLength = password.length >= 7;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasMinLength || !(hasLetter && hasNumber)) {
      setStrength(0);
      setStrengthTerm("Weak");
      setIsPasswordvalid(false);
      return;
    }

    score++;
    score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    if (password.length >= 10) score++;

    setStrength(score);

    if (score <= 1) {
      setStrengthTerm("Weak");
      setIsPasswordvalid(false);
    }
    if (score > 1) {
      setStrengthTerm("Good");
      setIsPasswordvalid(true);
    }
    if (score > 3) {
      setStrengthTerm("Strong");
      setIsPasswordvalid(true);
    }
  };

  useEffect(() => {
    if (isFirstRunPassword.current) {
      isFirstRunPassword.current = false; 
      return;
    }
    checkPasswordStrength();
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
    if (isFirstRunEmail.current) {
      isFirstRunEmail.current = false; 
      return;
    }
    checkEmailValidity();
  }, [email]);

  const handleCreateAccount = async () => {

    setLoading(true);

    try {
      
      checkFieldValidity();
      checkEmailValidity();
      checkPasswordStrength();

      if (isFirstNameEmpty || isLastNameEmpty || isBirthdateEmpty || isGenderEmpty) {
        Alert.alert("Empty Fields", "Fill up all fields to create an account.", [
          {text: 'Ok'}
        ])
        setLoading(false);
        return;
      }

      if (!isEmailValid) {
        Alert.alert("Invalid Email", "Enter a valid email. (e.g sample123@gmail.com)", [
          {text: 'Ok'}
        ])
        setLoading(false);
      }

      if (!isPasswordValid) {
        Alert.alert("Invalid Password", "Must contain alphanumeric values and is 8 characters long.", [
          {text: 'Ok'}
        ])
        setLoading(false);
        return;
      }

      if (password !== rePassword) {
        setIsPasswordMatch(false);
        setLoading(false);
        return;
      } else {setIsPasswordMatch(true); setLoading(false);}

      if (!aggreed) {
        Alert.alert("Agreed Terms", "In order to continue, please agree to the terms and conditions.", [
          {text: 'Ok'}
        ])
        setLoading(false);
        return;
      }

      const res = await axios.post(`${API_URL}/api/v1/auth/sign-up`, {firstName: firstName, lastName: lastName, gender: gender, birthday: birthDate, email: email, password: password}, 
        { 
          validateStatus: (status) => status < 500, // Only throw errors for 500+ status codes
        }
      );

      if (res.data.success) {
        Alert.alert("Account Created", "You're account is successfully created.", [
          {text: 'Ok'}
        ])
        await router.replace(`/(auth-screens)/verify-account/${email}`);
        setLoading(false);
        return;
      }

      if (!res.data.success) {
        Alert.alert("Existing Account", "There is an account exisiting with the same email.", [
          {text: 'Ok'}
        ]);
        setIsEmailValid(false);
      }

    } catch (error) {
      await Alert.alert("Signup Error", error.message, [
        {text: 'Ok'}
      ])
      setLoading(false);
    }
    finally {
      console.log(`${firstName}, ${lastName}, ${birthDate}, ${gender}`);
    }
  }

 

  return (
    <>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <SafeAreaView className="h-[100%] w-screen flex justify-center items-center flex-col bg-background ">
        <ScrollView
          className="flex-1 gap-4 min-h-[100%] overflow-y-auto px-10 pt-28"
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
                style={{borderColor: !isFirstNameEmpty ? "black" : "red",}}
                value={firstName}
                onChangeText={(text) => {setFirstName(text)}}
              ></TextInput>
              {!isFirstNameEmpty ? (<></>) : (<Text className="font-bold text-sm text-red-600 md:text-xl">ⓘ This field cannot be empty</Text>)}
            </View>

            <View className="w-80 items-start gap-2 self-start ">
              <Text className="text-lg font-bold">Last Name</Text>
              <TextInput
                placeholder="Enter Last Name"
                className="h-12 w-80 border-black border-2 rounded-md bg-white"
                style={{borderColor: !isLastNameEmpty ? "black" : "red",}}
                value={lastName}
                onChangeText={(text) => {setLastName(text)}}
              ></TextInput>
              {!isLastNameEmpty ? (<></>) : (<Text className="font-bold text-sm text-red-600 md:text-xl">ⓘ This field cannot be empty</Text>)}
            </View>

            <View className="w-80 items-start gap-2 self-start">
              <Text className="text-lg font-bold">Birthdate</Text>
              <TouchableOpacity onPress={() => setOpen(true)}>
                <TextInput
                  placeholder="e.g. 01/01/2001"
                  className="h-12 w-80 border-black border-2 rounded-md p-2 bg-white"
                  editable={false}
                  value={birthDate ? birthDate.toLocaleDateString("en-US") : ""}
                  style={{borderColor: !isBirthdateEmpty ? "black" : "red"}}
                  onChange={() => birthDate !== null ? setIsBirthdateEmpty(false) : setIsBirthdateEmpty(true)}
                />
              </TouchableOpacity>
              {!isBirthdateEmpty ? (<></>) : (<Text className="font-bold text-sm text-red-600 md:text-xl">ⓘ This field cannot be empty</Text>)}
              {open && (
                <DateTimePicker
                  value={birthDate || new Date()}
                  mode="date"
                  display="default"
                  maximumDate={eighteenYearsAgo}
                  onChange={(event, selectedDate) => {
                    setOpen(false);
                    if (selectedDate) {
                      setBirthDate(selectedDate);
                      setIsBirthdateEmpty(false);
                    } else {
                      setIsBirthdateEmpty(true);
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
                  { value: "Prefer not to say", label: "🤐 Prefer not to say" },
                ]}
                onChange={handleDropdownChange}
                placeholder="Gender"
                height={40}
                color={!isGenderEmpty ? 'black' : 'red'}
                bgColor="white"
              />
              {!isGenderEmpty ? (<></>) : (<Text className="font-bold text-sm text-red-600 md:text-xl">ⓘ This field cannot be empty</Text>)}
            </View>

            <View className="w-80 items-start gap-2 self-start">
              <Text className="text-lg font-bold">Email Address</Text>
              <TextInput
                placeholder="Enter Email Address"
                className="h-12 w-80 border-black border-2 rounded-md bg-white"
                style={{borderColor: isEmailValid ? "black" : "red",}}
                value={email}
                onChangeText={(text) => setEmail(text)}
              ></TextInput>
              {isEmailValid ? (<></>) : (<Text className="font-bold text-sm text-red-600 md:text-xl">ⓘ Invalid Email</Text>)}
            </View>

            <View className="w-80 items-start gap-2 md:w-3/5">
              <Text className="text-base font-bold md:text-2xl">
                Password
              </Text>
              <TextInput
                placeholder="Enter 8+ alphaneumeric characters"
                className="h-12 w-80 border-black border-2 rounded-md md:w-full md:h-16 bg-white"
                style={{borderColor: isPasswordValid ? "black" : "red",
                        borderTopColor: isPasswordMatch ? "black" : "red",
                        borderBottomColor: isPasswordMatch ? "black" : "red",
                        borderLeftColor: isPasswordMatch ? "black" : "red",
                        borderRightColor: isPasswordMatch ? "black" : "red",
                      }}
                value={password}
                onChangeText={(text) => {setPassword(text)}}
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
                Confirm Password
              </Text>
              <TextInput
                placeholder="Confirm Password"
                className="h-12 w-80 border-black border-2 rounded-md md:w-full md:h-16 bg-white"
                style={{borderColor: isPasswordMatch ? "black" : "red",}}
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
            <TouchableOpacity className='w-80 h-12 items-center justify-center bg-primary rounded-md md:w-3/5' onPress={handleCreateAccount} disabled={loading}>
              {loading ? (<ActivityIndicator size={'small'} color={'white'}/>) : (
              <Text className='text-lg text-white font-bold '>Create Account</Text>
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
