import { Alert, Platform, ToastAndroid } from "react-native";

export const showToast = (title: string, message?: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message ?? title, ToastAndroid.SHORT);
  } else {
    Alert.alert(title, message);
  }
};
