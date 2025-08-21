import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Image, StyleSheet, KeyboardAvoidingView, Platform, Dimensions, ImageBackground,
  Alert, Animated, Permissions, PermissionsAndroid, AppState
} from 'react-native';
import Video from 'react-native-video';
import Voice from '@react-native-voice/voice';
import { useMutation, useQuery } from '@tanstack/react-query';
// import Loader from '../../components/Loader/Loader';
import OptionSelector from '../../components/OptionSelector';
import felptxt from "../../assets/images/felp-txt.svg";
import arrowup from "../../assets/images/arrow-up.png";
import user from "../../assets/images/user.png";
import mic from "../../assets/images/mic.png";
import mic_hov from "../../assets/images/mic_hov.png";
import robotuser from "../../assets/images/robot-user.png";
import correct from "../../assets/images/correct.svg";
import cancel from "../../assets/images/cancel.svg";

import question1 from "../../assets/felp_ai_1.mp4";
import question2 from "../../assets/felp_ai_2.mp4";
import question3 from "../../assets/felp_ai_3.mp4";
import question4 from "../../assets/felp_ai_4.mp4";
import question5 from "../../assets/felp_ai_5.mp4";
import question6 from "../../assets/felp_ai_6.mp4";
import question7 from "../../assets/felp_ai_7.mp4";
import describes from "../../assets/describes.mp4";
import nameValidation from "../../assets/name_validation.mp4";
import otpSend from "../../assets/otp_send_success.mp4";
import otpValidation from "../../assets/otp_validation.mp4";
import resentOtp from "../../assets/resend_otp_send_success.mp4";
import emailValidate from "../../assets/felp_ai_email-validation-2.mp4";
import emailexist from "../../assets/felp_ai_email-exist.mp4";
import errorUnexpected from "../../assets/felp_ai_error_unexpected.mp4";
import businessValidation from "../../assets/Business-website-validation.mp4";

import { checkName, fetchCaptchaToken, sendOtp, SignUp, reSendOtp, checkBusinessName } from "../../api/api";
import { IMAGES } from '@constants';
import TypewriterText from '../../constants/TypewriterText'
import DelayedRender from '../../constants/DelayedRender'
import { animateBotTextWithVideo } from "../../components/lib/animateBotTextWithVideo";
import { dummyInterests, dummyListingTypes } from "../../assets/json/data";
import { animateText } from "../../components/lib/conversationUtils/animateText";
import { isValidEmail } from "../../components/lib/conversationUtils/validateEmail";
import { LoaderCircleIcon, Loader } from 'lucide-react-native';
import NetworkUtils from '../../components/common/NetworkUtils';


export default function LoginScreen({ navigation }) {

  const { width, height } = Dimensions.get('window');
  const questions = [
    "Hello! Welcome to Felp.AI. Let’s get you started.",
    "What’s your name?",
    "Great! Select your interest from the list below.",
    "Awesome! What’s the name of your \nbusiness/website URL?",
    "What best describes you?",
    "Thank you! Lastly, could you provide your email? We’ll send you a link to complete your listing.",
    "We have sent an OTP to your email. Please check your inbox and enter it to verify.",
    "You are all set! Keep an eye on your inbox for the next steps. Have a fantastic day!",
  ];

  const videos = [
    question1,
    question2,
    question3,
    question4,
    describes,
    question6,
    otpSend,
    question7,
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    role: "",
    business_input: "",
    email: "",
    otp: ""
  });
  const [conversation, setConversation] = useState([{ sender: 'bot', text: questions[0] }]);
  const [visibleChars, setVisibleChars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const [autoProgressionDone, setAutoProgressionDone] = useState(false);
  const [listening, setListening] = useState(false);
  const [success, setSuccess] = useState(false);
  const [textload, setTextload] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [IsLastSentence, setIsLastSentence] = useState(false);
  const [userName, setUserName] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [videoKey, setVideoKey] = useState(0);
  const [videoSource, setVideoSource] = useState(videos[0]); // Default source
  const [showResendButton, setShowResendButton] = useState(false);
  const [otpResent, setOtpResent] = useState(false);
  const [shouldContinue, setShouldContinue] = useState(false);
  const [touchableOpacityDisable, settouchableOpacityDisable] = useState(true);
  const [isNetworkConnected, setisNetworkConnected] = useState(false);


  const videoRef = useRef(null);

  console.log("Voice native module:", Voice);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground (Resumed)');
        setVideoKey(prev => prev + 1);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (stepIndex === 6 && autoProgressionDone && !otpResent) {
      const timer = setTimeout(() => {
        setShowResendButton(true);
      }, 20000); // 20 Sec
      return () => clearTimeout(timer);
    }
  }, [stepIndex, autoProgressionDone, otpResent]);

  // ⏱ Re-show button again after 20 Sec if it was clicked
  useEffect(() => {
    if (otpResent) {
      const timer = setTimeout(() => {
        setShowResendButton(true);
        setOtpResent(false); // reset so next click can hide again
      }, 20000); // 20 Sec
      return () => clearTimeout(timer);
    }
  }, [otpResent]);

  // 🧠 Button handler
  const handleResendOTP = () => {
    setShowResendButton(false); // Hide button immediately
    setOtpResent(true); // Start countdown to re-show
    setLoading(true);
    reSendOTPMutation.mutate(
      { email: formData.email },
      {
        onSuccess: (data) => {
          setLoading(false);
          console.log("OTP resent successfully", data);
          appendBotOnlyMessage(
            "We have resent the OTP to your registered email. It will expire shortly, so enter it soon.",
            resentOtp
          );
        },
        onError: (error) => {
          setLoading(false);
          console.error("Resend OTP failed:", error);
          appendBotOnlyMessage(
            "Failed to resend OTP. Please try again shortly."
          );
        },
      }
    );
  };

  const appendBotOnlyMessage = (botText, videoSrc) => {
    const updatedConvo = [...conversation, { sender: "bot", text: botText }];
    setConversation(updatedConvo);

    const lastIndex = updatedConvo.length - 1;
    animateText(
      botText,
      lastIndex,
      setVisibleChars,
      3000,
      updatedConvo,
      visibleChars
    );

    videos[stepIndex] = videoSrc;
    // Then update state to re-render the player with the new video
    setStepIndex(stepIndex);
    setVideoSource(videos[stepIndex]);
    setVideoKey(prev => prev + 1);
  };



  const reSendOTPMutation = useMutation({
    mutationFn: reSendOtp,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const mutation = useMutation({
    mutationFn: SignUp,
    onSuccess: (data) => {
      console.log("Submitted successfully", data);
      setUserName(data.name || "User");
      setIsLastSentence(true);
      setSuccess(true);
    },
    onError: (err) => {
      console.log(err, "Error in submission");
      setSuccess(false);
      setIsLastSentence(false);
      //setSuccess(true);
    },
  });

  const sendOTPMutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      console.log(data);

    },
    onError: (error) => {
      console.log(error);
    },
  });

  const checkNameMutation = useMutation({
    mutationFn: checkName,
    onSuccess: (data) => {
      console.log(data);

    },
    onError: (error) => {
      console.log(error);
    },
  });





  useEffect(() => {
    animateText(
      questions[0],
      stepIndex,
      setVisibleChars,
      3000,
      conversation,
      visibleChars
    );
  }, [])

  useEffect(() => {
    setVideoSource(videos[stepIndex])
  }, [stepIndex])

  // Voice handlers
  useEffect(() => {
    // Speech start
    Voice.onSpeechStart = () => {
      console.log('Speech started');
    };

    // Speech end: restart listening if needed
    Voice.onSpeechEnd = () => {
      console.log('Speech ended');
      if (shouldContinue) {
        startListening();
      }
    };

    // Speech results
    Voice.onSpeechResults = (e) => {
      console.log('Speech results:', e.value);

      let result = '';
      if (e?.value && e.value.length > 0) {
        result = e.value[e.value.length - 1];
      }

      setInputValue((prev) => prev.trim() + ' ' + result.trim());

      // Restart listening for continuous recognition
      if (shouldContinue) {
        stopListening().then(() => startListening());
      }
    };

    // Speech error
    Voice.onSpeechError = (e) => {
      console.log('Speech error:', e.error);

      // Restart on error if needed
      if (shouldContinue) {
        stopListening().then(() => startListening());
      }
    };

    // Cleanup on unmount
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [shouldContinue]);

  // Start listening
  const startListening = async () => {
    const hasPermission = await requestMicPermission();
    if (!hasPermission) {
      console.warn('Microphone permission not granted');
      Alert.alert('Microphone permission not granted');
      return;
    }

    setShouldContinue(true);
    setIsListening(true);

    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error('Voice start error:', e);
    }
  };

  // Stop listening
  const stopListening = async () => {
    setShouldContinue(false);
    setIsListening(false);

    try {
      await Voice.stop();
    } catch (e) {
      console.error('Voice stop error:', e);
    }
  };

  // Animate bot text
  useEffect(() => {
    const full = conversation[conversation.length - 1];
    if (full.sender === 'bot') {
      let i = visibleChars.length;
      const interval = setInterval(() => {
        setVisibleChars(vc => {
          const next = [...vc];
          next.push((next[next.length] || 0) + 1);
          return next;
        });
      }, 30);
      setTimeout(() => clearInterval(interval), full.text.length * 30);
    }

  }, []);


  const handleVideoPlay = () => {
    console.log("*****conversation***" + conversation)
    console.log("*****visibleChars***" + visibleChars)
    animateBotTextWithVideo({
      videoElement: Video,
      conversation,
      setVisibleChars,
    });
  };



  // Video end handler
  const onVideoEnd = () => {
    setTextload(false);

    // Handle disabling/enabling touchable opacity
    if (stepIndex === 0) {
      setTimeout(() => {
        settouchableOpacityDisable(false);
      }, 2000);
    } else if ([1, 3, 5, 6].includes(stepIndex)) {
      settouchableOpacityDisable(false);
    }

    // Check if this is the last step
    if (stepIndex === questions.length - 1) {
      if (IsLastSentence) {
        navigation.replace('ThankYou', { user: formData.name });
      }
      // End function early, no further processing
      return;
    }

    // Handle progression logic
    if (stepIndex === 0) {
      // Move to step 1 with a delay
      setTimeout(() => {
        const updatedConvo = [
          ...conversation,
          { sender: 'bot', text: questions[1] }
        ];

        const successIndex = updatedConvo.length - 1;

        animateText(
          questions[1],
          successIndex,
          setVisibleChars,
          3000,
          updatedConvo,
          visibleChars
        );

        setConversation(updatedConvo);
        setStepIndex(1);
      }, 1500);
    } else {
      // For steps with user input
      const stepsWithInput = [1, 3, 5];
      if (stepsWithInput.includes(stepIndex)) {
        setAutoProgressionDone(true);
      }
    }
  };


  useEffect(() => {
    requestMicPermission();
  }, []);

  const requestMicPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,

          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone to recognize your speech.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;

      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  // Scroll to bottom each new message
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [conversation]);

  const goNext = async () => {
    if (inputValue.trim() === '') {
      setSnackbarVisible(true);
      return;
    }

    settouchableOpacityDisable(true);

    if (listening) {
      stopListening();
      setListening(false);
    }

    if (!autoProgressionDone || !inputValue.trim()) {
      return;
    }

    const userText = inputValue.trim();

    // Email validation step
    if (stepIndex === 5 && !isValidEmail(userText)) {
      const errorMsg = "That doesn't look like a valid email address.\nCan you try again?";
      const updatedConvo = [
        ...conversation,
        { sender: "user", text: userText },
        { sender: "bot", text: errorMsg }
      ];

      setConversation(updatedConvo);
      setInputValue("");

      animateText(
        errorMsg,
        updatedConvo.length - 1,
        setVisibleChars,
        3000,
        updatedConvo,
        visibleChars
      );

      videos[stepIndex] = emailValidate;
      setVideoSource(videos[stepIndex]);
      setVideoKey(prev => prev + 1);
      return;
    }

    // Handle User name
    if (stepIndex === 1) {
      setFormData(prev => ({ ...prev, name: userText }));
      setInputValue("");
      setLoading(true);

      checkNameMutation.mutate(
        { name: userText },
        {
          onSuccess: (data) => {
            setLoading(false);
            setUserName(data.name || "User");

            const successMsg = "Great! Select your interest from the list below.";
            const updatedConvo = [
              ...conversation,
              { sender: "user", text: userText },
              { sender: "bot", text: successMsg }
            ];

            animateText(
              successMsg,
              updatedConvo.length - 1,
              setVisibleChars,
              3000,
              updatedConvo,
              visibleChars
            );

            setConversation(updatedConvo);
            setStepIndex(stepIndex + 1);
          },
          onError: (error) => {
            setLoading(false);
            const errorMsg = error.response?.status === 400
              ? "Please enter a valid name."
              : "Oops! An unexpected error occurred. Please try again shortly.";

            const updatedConvo = [
              ...conversation,
              { sender: "user", text: userText },
              { sender: "bot", text: errorMsg }
            ];

            setConversation(updatedConvo);
            setInputValue("");

            animateText(
              errorMsg,
              updatedConvo.length - 1,
              setVisibleChars,
              3000,
              updatedConvo,
              visibleChars
            );

            videos[stepIndex] = error.response?.status === 400 ? nameValidation : errorUnexpected;
            setVideoSource(videos[stepIndex]);
            setVideoKey(prev => prev + 1);
            setStepIndex(stepIndex);
          }
        }
      );

      return;
    }

    //**** Business URl */
    if (stepIndex === 3) {
      setFormData(prev => ({ ...prev, business_input: userText }));
      const updatedConvo = [
        ...conversation,
        { sender: "user", text: userText },
        { sender: "bot", text: questions[stepIndex + 1] }
      ];

      animateText(
        questions[stepIndex + 1],
        updatedConvo.length - 1,
        setVisibleChars,
        3000,
        updatedConvo,
        visibleChars
      );

      setConversation(updatedConvo);
      setStepIndex(i => i + 1);
      setInputValue("");
      return;
    }

    //**** Email Validate */
    if (stepIndex === 5) {
      setFormData(prev => ({ ...prev, email: userText }));
      setInputValue("");
      setLoading(true);

      sendOTPMutation.mutate(
        { email: userText },
        {
          onSuccess: (data) => {
            setLoading(false);
            setUserName(data.name || "User");

            const successMsg = "We have sent an OTP to your email. Please check your inbox and enter it to verify.";
            const updatedConvo = [
              ...conversation,
              { sender: "user", text: userText },
              { sender: "bot", text: successMsg }
            ];

            animateText(
              successMsg,
              updatedConvo.length - 1,
              setVisibleChars,
              3000,
              updatedConvo,
              visibleChars
            );

            setConversation(updatedConvo);
            setStepIndex(stepIndex + 1);
          },
          onError: (error) => {
            setLoading(false);
            const errorMsg = error.response?.status === 400
              ? "This email address is already registered. Please log in or use a different email to sign up."
              : "Oops! An unexpected error occurred. Please try again shortly.";

            const updatedConvo = [
              ...conversation,
              { sender: "user", text: userText },
              { sender: "bot", text: errorMsg }
            ];

            setConversation(updatedConvo);
            setInputValue("");

            animateText(
              errorMsg,
              updatedConvo.length - 1,
              setVisibleChars,
              3000,
              updatedConvo,
              visibleChars
            );

            videos[stepIndex] = error.response?.status === 400 ? emailexist : errorUnexpected;
            setVideoSource(videos[stepIndex]);
            setVideoKey(prev => prev + 1);
            setStepIndex(stepIndex);
          }
        }
      );

      return;
    }

    //**** Otp Validate */
    if (stepIndex === 6) {
      setFormData(prev => ({ ...prev, otp: userText }));
      setInputValue("");
      setLoading(true);

      mutation.mutate(
        { payload: { ...formData, otp: userText } },
        {
          onSuccess: (data) => {
            setLoading(false);
            setOtpResent(true);
            setUserName(data.name || "User");

            const successMsg = "You are all set! Keep an eye on your inbox for the next steps. Have a fantastic day!";
            const updatedConvo = [
              ...conversation,
              { sender: "user", text: userText },
              { sender: "bot", text: successMsg }
            ];

            animateText(
              successMsg,
              updatedConvo.length - 1,
              setVisibleChars,
              3000,
              updatedConvo,
              visibleChars
            );

            setConversation(updatedConvo);
            videos[stepIndex + 1] = question7;
            setVideoSource(videos[stepIndex + 1]);
            setVideoKey(prev => prev + 1);
            setStepIndex(stepIndex + 1);
          },
          onError: (error) => {
            setLoading(false);
            const errorMsg = error.response?.status === 400
              ? "Incorrect OTP. Make sure you’ve entered the latest one sent to you."
              : "Oops! An unexpected error occurred. Please try again shortly.";

            const updatedConvo = [
              ...conversation,
              { sender: "user", text: userText },
              { sender: "bot", text: errorMsg }
            ];

            setConversation(updatedConvo);
            setInputValue("");

            animateText(
              errorMsg,
              updatedConvo.length - 1,
              setVisibleChars,
              3000,
              updatedConvo,
              visibleChars
            );

            videos[stepIndex] = error.response?.status === 400 ? otpValidation : errorUnexpected;
            setVideoSource(videos[stepIndex]);
            setVideoKey(prev => prev + 1);
            setStepIndex(stepIndex);
          }
        }
      );

      return;
    }

    // Generic step progression
    const newConversation = [
      ...conversation,
      { sender: "user", text: userText }
    ];

    if (stepIndex + 1 < questions.length) {
      newConversation.push({ sender: "bot", text: questions[stepIndex + 1] });
    }

    setConversation(newConversation);
    setInputValue("");
    setStepIndex(prev => Math.min(prev + 1, questions.length - 1));
  };

  const handleClick = (e) => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };


  //  source={videos[stepIndex]}
  return (
    <ImageBackground
      source={IMAGES.Card}
      resizeMode="cover"
      style={s.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.container}
      >
        {/* Top Video & Branding */}
        <View style={{
          padding: 10,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexDirection: 'row'
        }}>
          <Video
            ref={videoRef}
            key={videoKey}
            source={videoSource}
            style={s.video}
            paused={false}
            resizeMode="contain"
            // onPlaybackResume={handleVideoPlay}  // used when video starts/resumes       
            onEnd={onVideoEnd}
            muted={false}
          />
          <View
            style={{
              padding: 10,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'column',
              flex: 1,
            }}>

            {/* <Image
              source={require('../../assets/images/felp-txt.png')}
              style={{ width: '100%', marginBottom: 5 }}
              resizeMode='contain'
            /> */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Image
                source={require('../../assets/images/felp-txt.png')}
                style={{
                  flex: 1, // makes image take remaining space
                  marginBottom: 5,
                }}
                resizeMode="contain"
              />

              <TouchableOpacity
                onPress={handleClick} // <-- your function to reset
                style={{
                  padding: 5,
                  marginLeft: 10,
                }}
              >
                <Image
                  source={require('../../assets/images/reset.png')}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: 5 }}>
              <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: 'bold', }}>
                Your Super AI Agent,{'\n'} Ask Me Anything!
              </Text>
            </View>
          </View>
        </View>

        {/* Chat Container */}
        <View style={s.chatContainer}>
          <ScrollView ref={scrollRef} contentContainerStyle={s.scrollArea}>
            {conversation.map((msg, i) => (
              <View
                key={i}
                style={[
                  s.bubble,
                  msg.sender === 'bot' ? s.botBubble : s.userBubble,
                ]}
              >
                <Image
                  source={msg.sender === 'bot' ? robotuser : user}
                  style={s.avatar}
                />
                <Text style={s.text}>
                  {msg.sender === 'bot'
                    ? msg.text.slice(0, visibleChars[i] || 0)
                    : msg.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Resend OTP Button */}
          {stepIndex === 6 && autoProgressionDone && showResendButton && (
            <TouchableOpacity style={s.resendBtn} onPress={handleResendOTP}>
              <View style={[s.bubble, s.botBubble]}>
                <Image source={robotuser} style={s.avatar} />
                <Text style={s.resendBtnText}>Resend OTP</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Option Selector Steps */}
          {(stepIndex === 2 || stepIndex === 4) && (
            <View style={s.inputContainer}>
              <OptionSelector
                options={stepIndex === 2 ? dummyInterests : dummyListingTypes}
                onSelect={(opt) => {
                  setFormData((p) => ({
                    ...p,
                    [stepIndex === 2 ? 'domain' : 'role']: opt.label,
                  }));

                  const updatedConvo = [
                    ...conversation,
                    { sender: "user", text: opt.label },
                    { sender: "bot", text: questions[stepIndex + 1] },
                  ];

                  animateText(
                    questions[stepIndex + 1],
                    updatedConvo.length - 1,
                    setVisibleChars,
                    3000,
                    updatedConvo,
                    visibleChars
                  );

                  setConversation(updatedConvo);
                  setStepIndex((i) => i + 1);
                  setVideoKey((prev) => prev + 1);
                  setAutoProgressionDone(false);
                }}
              />

              <View style={s.inputRow}>
                <TextInput
                  value={inputValue}
                  onChangeText={setInputValue}
                  style={s.input}
                  placeholder="Type your answer or tap mic..."
                  placeholderTextColor="gray"
                  editable={false}
                />
                <View style={s.iconWrapper}>
                  <Image source={mic} style={s.iconBtn} />
                </View>
                <Image source={arrowup} style={s.iconBtn} />
              </View>
            </View>
          )}

          {/* Text Input Steps */}
          {![2, 4, 7].includes(stepIndex) && (
            <View style={s.inputContainer}>
              <View style={s.inputRow}>
                <TextInput
                  value={inputValue}
                  onChangeText={setInputValue}
                  style={s.input}
                  placeholder="Type your answer or tap mic..."
                  placeholderTextColor="gray"
                  editable={!touchableOpacityDisable}
                  multiline
                  numberOfLines={2}
                  scrollEnabled
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  disabled={touchableOpacityDisable}
                  onPress={async () => {
                    const connected = await NetworkUtils.isConnected();
                    if (!connected) {
                      setisNetworkConnected(true);
                      return;
                    }
                    if (listening) {
                      stopListening();
                      setListening(false);
                    } else {
                      startListening();
                      setListening(true);
                    }
                  }}
                >
                  <View style={s.iconWrapper}>
                    <Image
                      source={listening ? mic_hov : mic}
                      style={s.iconBtn}
                    />
                  </View>
                </TouchableOpacity>

                {loading ? (
                  <Loader size={32} color="white" />
                ) : (
                  <TouchableOpacity
                    disabled={touchableOpacityDisable}
                    onPress={async () => {
                      const connected = await NetworkUtils.isConnected();
                      if (!connected) {
                        setisNetworkConnected(true);
                        return;
                      }
                      goNext();
                    }}
                  >
                    <Image source={arrowup} style={s.iconBtn} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Snackbars */}
              <CustomSnackbar
                visible={snackbarVisible}
                message="Enter your input"
                onDismiss={() => setSnackbarVisible(false)}
              />
              <CustomSnackbar
                visible={isNetworkConnected}
                message="No Internet. Please check your connection."
                onDismiss={() => setisNetworkConnected(false)}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );

}

const s = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: { flex: 1 },
  video: { width: '40%', height: 100, backgroundColor: '#00000', marginTop: 20 },
  chatContainer: { flex: 1, padding: 10 },
  scrollArea: { paddingBottom: 20 },
  bubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  botBubble: {
    alignSelf: 'flex-start',
    marginEnd: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center'
  },
  userBubble: { alignSelf: 'flex-end', marginEnd: 5 },
  avatar: { width: 28, height: 28, marginRight: 8 },
  text: {
    fontSize: 14, color: 'white', flexDirection: 'row',
    flexWrap: 'wrap', marginRight: 10
  },
  inputRow: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ffffff',
    color: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 'auto',
    maxHeight: 100,
    padding: 10,
    placeholdercolor: 'lightgray'
  },
  iconBtn: { width: 32, height: 32 },
  snackbar: {
    position: 'absolute',
    alignItems: 'center',
    left: 20,
    right: 20,
    backgroundColor: '#FF0000',
    padding: 16,
    borderRadius: 8,
    zIndex: 999,
  },
  text: {
    color: '#fff',
  },
  iconWrapper_red: {
    backgroundColor: 'red',
    marginLeft: 8,
    marginRight: 5,
    borderRadius: 50, // make it circular
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  iconWrapper: {
    marginLeft: 8,
    marginRight: 5,
    borderRadius: 50, // make it circular
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  resendBtn: {
    borderWidth: 1,
    borderColor: '#ffffff',
    color: '#ffffff',
    width: 180,
    borderRadius: 20,
  },
  resendBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chatBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 10,
    marginVertical: 5,
  },
});

const CustomSnackbar = ({ message, visible, onDismiss }) => {
  const slideAnim = useRef(new Animated.Value(100)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => onDismiss(), 2000);
      });
    }
  }, [visible]);

  return (
    visible && (
      <Animated.View style={[s.snackbar, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={s.text}>{message}</Text>
      </Animated.View>
    )
  );
};

