import {Verfication} from '@components';
import {COLORS} from '@constants';
import {yupResolver} from '@hookform/resolvers/yup';
import {OTPSchema} from '@schema';
import {useAuth, Storage, APIService} from '@utils';
import React, {useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import LinearGradient from 'react-native-linear-gradient';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,Alert
} from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import {StackScreenProps} from 'types';

export default function OTPScreen({
  navigation,
  route,
}: StackScreenProps<'OtpVerification'>) {
  const [counter, setCounter] = useState<number>(30);
  const otpInputRef = useRef<OTPTextInput | null>(null);
  const {setIsLoggedIn} = useAuth();

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    setValue,
  } = useForm({
    resolver: yupResolver(OTPSchema)});

  const {data}: any = route?.params;

  useEffect(() => {
    if (counter > 0) {
      const interval = setInterval(() => {
        setCounter(prevCounter => prevCounter - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [counter]);

  const handleVerifyOTP = async (params: any) => {
    Alert.alert("OTP","Send OTP")
    console.log('PARAMS>>>>>', params);
    // Keyboard.dismiss();
    // setCounter(30);
    // Storage.setToken('1234');
    // Storage.setUserData('1234');
    // // setIsLoggedIn('1234');
    // APIService.setAuthToken('1234');
    
  };

  const handleResendOtp = () => {
    if (counter === 0) {
      setCounter(30);
      console.log('Resending OTP...');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Controller
          control={control}
          name="otp"
          render={({field: {value, onChange}}) => (
            <Verfication
              ref={otpInputRef}
              title="Enter the 6-digit code we sent to"
              email={data?.email}
              value={value}
              onChange={onChange}
              error={errors.otp?.message}
            />
          )}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={()=>{
            handleSubmit(handleVerifyOTP)
          }
          }
          style={styles.confirmButton}>
          <LinearGradient
            colors={['#f72585', '#b5179e']}
            style={styles.confirmButton}>
            <Text style={styles.confirmText}>Confirm</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={counter > 0}
          style={styles.resendButton}>
          <Text
            style={[
              styles.resendText,
              {color: counter > 0 ? 'gray' : COLORS.Primary},
            ]}>
            {counter > 0 ? `Resend code in ${counter}s` : 'Resend code'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.Background,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    color: COLORS.Dark,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  emailText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButton: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  resendButton: {
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
