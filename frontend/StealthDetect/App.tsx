import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { showToast } from "./lib/toast";
import { StartScreen } from "./components/StartScreen";
import { SetupPinsScreen } from "./components/SetupPinsScreen";
import { EnterPinScreen } from "./components/EnterPinScreen";
import { DecoyDashboard } from "./components/DecoyDashboard";
import { WelcomeSlideshow } from "./components/WelcomeSlideshow";
import { PermissionsScreen } from "./components/PermissionsScreen";
import { HomeScreen } from "./components/HomeScreen";
import { MainDashboard } from "./components/MainDashboard";
import { ScanInProgress } from "./components/ScanInProgress";
import { ScanReport } from "./components/ScanReport";


import {
  ChevronRight,
  Shield,
  AlertTriangle,
  Radar,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react";

import { Platform } from "react-native";
import { SQLiteProvider } from "expo-sqlite";

// Move platform detection outside component to avoid recalculation
const isIOSDevice =
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

// Simple validation function - no need to memoize
const validatePin = (pin: string) => /^\d{4,8}$/.test(pin);

export function WebApp() {
  const [showExplainer, setShowExplainer] = useState(false);
  const [setupStep, setSetupStep] = useState<
    | "start"
    | "welcome"
    | "permissions"
    | "main-pin"
    | "duress-pin"
    | "ready"
    | "home"
    | "faq"
    | "decoy"
    | "setup-pins"
    | "enter-pin"
    | "dashboard-pin"
    | "main-dashboard"
    | "scan-progress"
    | "scan-report"
    | "network-map"
  >("start");
  const [showSecurityInfo, setShowSecurityInfo] =
    useState(false);
  const [showDuressWhy, setShowDuressWhy] = useState(false);

  // User state management
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [storedMainPin, setStoredMainPin] = useState("");
  const [storedDuressPin, setStoredDuressPin] = useState("");
  const [hasPermissions, setHasPermissions] = useState(false);
  const [cameFromWelcome, setCameFromWelcome] = useState(false);

  // Setup flow state
  const [permissions, setPermissions] = useState({
    systemUsage: false,
    notifications: false,
  });
  const [mainPin, setMainPin] = useState("");
  const [confirmMainPin, setConfirmMainPin] = useState("");
  const [duressPin, setDuressPin] = useState("");
  const [confirmDuressPin, setConfirmDuressPin] = useState("");

  // Optimized initialization
  useEffect(() => {
    try {
      const hasUsedApp = localStorage.getItem(
        "stealthdetect_setup_complete",
      );
      const savedMainPin = localStorage.getItem(
        "stealthdetect_main_pin",
      );
      const savedDuressPin =
        localStorage.getItem("stealthdetect_duress_pin") || "";
      const savedPermissions = localStorage.getItem(
        "stealthdetect_permissions",
      );

      let parsedPermissions = {
        systemUsage: false,
        notifications: false,
      };
      if (savedPermissions) {
        try {
          parsedPermissions = JSON.parse(savedPermissions);
        } catch (e) {
          console.warn("Failed to parse saved permissions");
        }
      }

      if (hasUsedApp && savedMainPin) {
        setIsReturningUser(true);
        setIsFirstRun(false);
        setStoredMainPin(savedMainPin);
        setStoredDuressPin(savedDuressPin);
      }

      setPermissions(parsedPermissions);
      setHasPermissions(parsedPermissions.systemUsage);
    } catch (error) {
      console.warn("Error loading saved data:", error);
    }
  }, []);

  const handlePinEntry = useCallback(
    (enteredPin: string) => {
      if (enteredPin === storedMainPin) {
        setSetupStep("home");
      } else if (
        storedDuressPin &&
        enteredPin === storedDuressPin
      ) {
        setSetupStep("decoy");
      } else {
        showToast("Invalid PIN", "Please try again");
        setCurrentPin("");
      }
    },
    [storedMainPin, storedDuressPin],
  );

  const handleDashboardPinEntry = useCallback(
    (enteredPin: string) => {
      if (enteredPin === storedMainPin) {
        setSetupStep("main-dashboard");
      } else if (
        storedDuressPin &&
        enteredPin === storedDuressPin
      ) {
        setSetupStep("decoy");
      } else {
        showToast("Invalid PIN", "Please try again");
        setCurrentPin("");
      }
    },
    [storedMainPin, storedDuressPin],
  );

  const savePermissions = useCallback(() => {
    try {
      localStorage.setItem(
        "stealthdetect_permissions",
        JSON.stringify(permissions),
      );
      setHasPermissions(permissions.systemUsage);
    } catch (error) {
      console.warn("Error saving permissions:", error);
    }
  }, [permissions]);

  const savePins = useCallback(
    (mainPin: string, duressPin: string) => {
      try {
        localStorage.setItem("stealthdetect_main_pin", mainPin);
        if (duressPin) {
          localStorage.setItem(
            "stealthdetect_duress_pin",
            duressPin,
          );
        }
        localStorage.setItem(
          "stealthdetect_setup_complete",
          "true",
        );
        setStoredMainPin(mainPin);
        setStoredDuressPin(duressPin);
      } catch (error) {
        console.warn("Error saving pins:", error);
      }
    },
    [],
  );

  // Simplified validation checks
  const canProceedPermissions = permissions.systemUsage;
  const canProceedMainPin =
    validatePin(mainPin) && mainPin === confirmMainPin;
  const canProceedDuressPin =
    duressPin === "" ||
    (validatePin(duressPin) &&
      duressPin === confirmDuressPin &&
      duressPin !== mainPin);

  if (showExplainer) {
    return (
      <View className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
        {/* Header */}
        <View className="flex justify-between items-center px-5 py-4 h-14 flex-row">
          <TouchableOpacity
            onPress={() => setShowExplainer(false)}
          >
            <Text className="text-muted-foreground">← Back</Text>
          </TouchableOpacity>
          <Text className="font-medium text-foreground">
            About StealthDetect
          </Text>
          <View className="w-12" />
        </View>

        {/* Explainer Content */}
        <View className="flex-1 px-5 py-8">
          <View className="space-y-6">
            <View className="text-center mb-8 items-center">
              <Shield className="w-20 h-20 text-primary mx-auto mb-4" />
              <Text className="mb-2 text-lg font-semibold">
                Privacy by Design
              </Text>
              <Text className="text-muted-foreground text-center">
                StealthDetect is built with privacy as the foundation, not an afterthought.
              </Text>
            </View>

            <View className="space-y-4">
              <View className="p-4 bg-muted rounded-lg">
                <Text className="mb-2 font-semibold">No Data Collection</Text>
                <Text className="text-sm text-muted-foreground">
                  We don't collect, store, or transmit your personal information. Everything stays on your device.
                </Text>
              </View>

              <View className="p-4 bg-muted rounded-lg">
                <Text className="mb-2 font-semibold">Open Source Ready</Text>
                <Text className="text-sm text-muted-foreground">
                  Our architecture is designed for transparency. Audit the code, verify the promises.
                </Text>
              </View>

              <View className="p-4 bg-muted rounded-lg">
                <Text className="mb-2 font-semibold">Minimal Permissions</Text>
                <Text className="text-sm text-muted-foreground">
                  Only requests essential system access needed for health monitoring. No unnecessary permissions.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Start screen with first run detection
  if (setupStep === "start") {
    return (
      <StartScreen
        isReturningUser={isReturningUser}
        hasPermissions={hasPermissions}
        isFirstRun={isFirstRun}
        onToggleFirstRun={() => {
          setIsFirstRun(!isFirstRun);
          setIsReturningUser(!isReturningUser);
        }}
        onNavigate={(step, cameFromWelcome) => {
          if (cameFromWelcome !== undefined) {
            setCameFromWelcome(cameFromWelcome);
          }
          setSetupStep(setupStep);
        }}
      />
    );
  }

  // Combined PIN setup screen
  if (setupStep === "setup-pins") {
    // Redirect to permissions if not granted
    if (!hasPermissions) {
      setSetupStep("permissions");
      return null;
    }

    return (
      <SetupPinsScreen
        mainPin={mainPin}
        confirmMainPin={confirmMainPin}
        duressPin={duressPin}
        confirmDuressPin={confirmDuressPin}
        onMainPinChange={setMainPin}
        onConfirmMainPinChange={setConfirmMainPin}
        onDuressPinChange={setDuressPin}
        onConfirmDuressPinChange={setConfirmDuressPin}
        onBack={() => setSetupStep("start")}
        onComplete={() => {
          savePins(mainPin, duressPin);
          setSetupStep("home");
        }}
        validatePin={validatePin}
      />
    );
  }

  // Enter PIN screen for returning users
  if (setupStep === "enter-pin") {
    return (
      <EnterPinScreen
        currentPin={currentPin}
        onPinChange={setCurrentPin}
        onUnlock={() => handlePinEntry(currentPin)}
        onBack={() => setSetupStep("start")}
        onReset={() => {
          localStorage.clear();
          setSetupStep("start");
          setIsReturningUser(false);
          setIsFirstRun(true);
          setHasPermissions(false);
          setPermissions({
            systemUsage: false,
            notifications: false,
          });
          setCameFromWelcome(false);
        }}
      />
    );
  }

  // Setup flow screens
  if (setupStep === "permissions") {
    return (
      <PermissionsScreen
        permissions={permissions}
        onPermissionChange={setPermissions}
        onBack={() => setSetupStep("start")}
        onContinue={() => {
          savePermissions();
          // Route based on user flow
          if (isReturningUser) {
            setSetupStep("enter-pin");
          } else if (cameFromWelcome) {
            setSetupStep("main-pin");
          } else {
            setSetupStep("setup-pins");
          }
        }}
        canProceed={canProceedPermissions}
      />
    );
  }

  if (setupStep === "main-pin") {
    if (showSecurityInfo) {
      return (
        <View className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
          {/* Header */}
          <View className="flex justify-between items-center px-5 py-4 h-14 flex-row">
            <TouchableOpacity
              onPress={() => setShowSecurityInfo(false)}
            >
              <Text className="text-muted-foreground">← Back</Text>
            </TouchableOpacity>
            <Text className="font-medium text-foreground">
              Security Info
            </Text>
            <View className="w-12" />
          </View>

          {/* Security Info Content */}
          <View className="flex-1 px-5 py-8">
            <View className="space-y-6">
              <View className="text-center mb-8 items-center">
                <Shield className="w-20 h-20 text-primary mx-auto mb-4" />
                <Text className="mb-2 text-lg font-semibold">
                  {isIOSDevice
                    ? "How Your Data Is Secured on iOS"
                    : "How Your Data Is Secured on iOS and Android"}
                </Text>
              </View>

              <View className="space-y-4">
                {isIOSDevice ? (
                  <View className="p-4 bg-muted rounded-lg">
                    <Text className="text-sm text-muted-foreground">
                      On iOS, setting a passcode for your device automatically enables hardware-level file encryption.
                    </Text>
                    <Text className="text-sm text-muted-foreground mt-2">
                      StealthDetect leverages this protection, meaning all app data stored on your device is already encrypted by the operating system. Your PIN adds a second layer of security for accessing the app itself.
                    </Text>
                  </View>
                ) : (
                  <>
                    <View className="p-4 bg-muted rounded-lg">
                      <Text className="text-sm text-muted-foreground">
                        StealthDetect stores all data in the app's private sandboxed storage. For maximum protection, we recommend enabling device encryption.
                      </Text>
                    </View>

                    <View className="p-4 bg-muted rounded-lg">
                      <Text className="mb-2 font-semibold">
                        How do I know if my phone is encrypted?:
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        • On iOS, go to Settings → Face (or Touch) ID & Passcode.
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        • Enable a strong passcode or passphrase.
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        • On modern Android devices, enable encryption in system settings (varies by device).
                      </Text>
                      <Text className="text-sm text-muted-foreground mt-2">
                        When full disk encryption is active, it uses your device's Secure Element to protect the encryption keys, making your data unreadable without your passcode or PIN.
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
        {/* Header */}
        <View className="flex justify-between items-center px-5 py-4 h-14 flex-row">
          <TouchableOpacity
            onPress={() => setSetupStep("permissions")}
          >
            <Text className="text-muted-foreground">← Back</Text>
          </TouchableOpacity>
          <Text className="font-medium text-foreground">Setup</Text>
          <View className="w-12" />
        </View>

        {/* Content */}
        <View className="flex-1 px-5 py-8 flex flex-col">
          <View className="flex-1 flex flex-col items-center text-center space-y-8">
            <Shield className="w-16 h-16 text-primary" />

            <View className="space-y-2 max-w-sm items-center">
              <Text className="text-2xl font-medium text-foreground">
                Set Main PIN
              </Text>
              <Text className="text-muted-foreground">
                Use 4–8 digits to unlock your full data
              </Text>
            </View>

            <View className="w-full max-w-sm space-y-4">
              <View className="space-y-2">
                <Text className="text-sm text-muted-foreground">
                  Main PIN
                </Text>
                <Input
                  type="password"
                  value={mainPin}
                  onChange={(e) =>
                    setMainPin(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 8),
                    )
                  }
                  placeholder="Enter 4-8 digits"
                  className="h-12 text-center text-lg tracking-wider"
                />
              </View>

              <View className="space-y-2">
                <Text className="text-sm text-muted-foreground">
                  Confirm PIN
                </Text>
                <Input
                  type="password"
                  value={confirmMainPin}
                  onChange={(e) =>
                    setConfirmMainPin(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 8),
                    )
                  }
                  placeholder="Confirm PIN"
                  className="h-12 text-center text-lg tracking-wider"
                />
              </View>

              <Text className="text-xs text-muted-foreground text-center">
                Your PIN is stored securely on this device.{' '}
                <Text
                  className="text-primary underline"
                  onPress={() => setShowSecurityInfo(true)}
                >
                  Learn more
                </Text>
              </Text>
            </View>
          </View>

          <Button
            onPress={() => setSetupStep("duress-pin")}
            disabled={!canProceedMainPin}
            className="w-full h-12 bg-primary text-primary-foreground rounded-xl disabled:opacity-50"
          >
            Continue
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </View>
      </View>
    );
  }

  if (setupStep === "duress-pin") {
    return (
      <View className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
        {/* Header */}
        <View className="flex justify-between items-center px-5 py-4 h-14 flex-row">
          <TouchableOpacity
            onPress={() => setSetupStep("main-pin")}
          >
            <Text className="text-muted-foreground">← Back</Text>
          </TouchableOpacity>
          <Text className="font-medium text-foreground">Setup</Text>
          <View className="w-12" />
        </View>

        {/* Content */}
        <View className="flex-1 px-5 py-8 flex flex-col">
          <View className="flex-1 flex flex-col items-center text-center space-y-8">
            <View className="relative">
              <Shield className="w-16 h-16 text-primary" />
              <AlertTriangle className="w-4 h-4 text-orange-500 absolute -top-1 -right-1" />
            </View>

            <View className="space-y-2 max-w-sm items-center">
              <Text className="text-2xl font-medium text-foreground">
                Set Duress PIN (Optional)
              </Text>
              <Text className="text-muted-foreground">
                Unlocks a decoy view in emergencies
              </Text>
            </View>

            <View className="w-full max-w-sm space-y-4">
              <View className="space-y-2">
                <Text className="text-sm text-muted-foreground">
                  Duress PIN
                </Text>
                <Input
                  type="password"
                  value={duressPin}
                  onChange={(e) =>
                    setDuressPin(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 8),
                    )
                  }
                  placeholder="Enter 4-8 digits (optional)"
                  className="h-12 text-center text-lg tracking-wider"
                />
              </View>

              {duressPin && (
                <View className="space-y-2">
                  <Text className="text-sm text-muted-foreground">
                    Confirm Duress PIN
                  </Text>
                  <Input
                    type="password"
                    value={confirmDuressPin}
                    onChange={(e) =>
                      setConfirmDuressPin(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 8),
                      )
                    }
                    placeholder="Confirm duress PIN"
                    className="h-12 text-center text-lg tracking-wider"
                  />
                </View>
              )}

              <Text className="text-xs text-muted-foreground text-center">
                Not your main PIN. Change anytime in Settings.
              </Text>

              {/* Why Section */}
              <View className="mt-6 border-t border-border pt-4">
                <TouchableOpacity
                  onPress={() => setShowDuressWhy(!showDuressWhy)}
                  className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg flex-row"
                >
                  <View className="flex items-center gap-2 flex-row">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    <Text className="text-sm font-medium text-foreground">
                      Why use a Duress PIN?
                    </Text>
                  </View>
                  {showDuressWhy ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </TouchableOpacity>

                {showDuressWhy && (
                  <View className="mt-3 p-4 bg-muted rounded-lg space-y-3">
                    <View className="space-y-2">
                      <Text className="text-sm font-medium text-foreground">
                        An Attacker You Know
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        If you're forced to unlock the app by an adversary, entering your duress PIN will show a clean, empty version instead of your real data.
                      </Text>
                    </View>

                    <View className="space-y-2">
                      <Text className="text-sm font-medium text-foreground">
                        Plausible Deniability
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        This gives you the ability to deny knowledge of scans being performed on the device.
                      </Text>
                    </View>

                    <View className="pt-2 border-t border-border">
                      <Text className="text-xs text-muted-foreground italic">
                        The duress view will show fake data and no scan results will be visible.
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            <View className="space-y-3">
              {duressPin ? (
                <Button
                  onPress={() => setSetupStep("ready")}
                  disabled={!canProceedDuressPin}
                  className="w-full h-12 bg-primary text-primary-foreground rounded-xl disabled:opacity-50"
                >
                  Enable Duress PIN
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : null}

              <Button
                onPress={() => setSetupStep("ready")}
                variant="outline"
                className="w-full h-12 rounded-xl"
              >
                Skip
              </Button>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (setupStep === "ready") {
    return (
      <View className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
        {/* Header */}
        <View className="flex justify-between items-center px-5 py-4 h-14 flex-row">
          <Text className="font-medium text-foreground">
            StealthDetect
          </Text>
          <Text className="text-sm text-muted-foreground">v0.1</Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-5 py-8 flex flex-col">
          <View className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
            <Radar className="w-16 h-16 text-primary" />

            <View className="space-y-2 max-w-sm items-center">
              <Text className="text-2xl font-medium text-foreground">
                All Set
              </Text>
              <Text className="text-muted-foreground">
                We're ready to analyze your device
              </Text>
            </View>
          </View>

          {/* Progress dots - all completed */}
          <View className="flex justify-center space-x-2 mb-8 flex-row">
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                className="w-2 h-2 rounded-full bg-primary"
              />
            ))}
          </View>

          <View className="space-y-3">
            <Button
              onPress={() => setSetupStep("scan-progress")}
              className="w-full h-12 bg-primary text-primary-foreground rounded-xl"
            >
              Start First Scan
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              onPress={() => setSetupStep("home")}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              Maybe Later
            </Button>
          </View>
        </View>

        {/* Footer */}
        <View className="px-5 py-4 items-center">
          <Text className="text-xs text-muted-foreground">
            Identify. Report. Secure.
          </Text>
        </View>
      </View>
    );
  }

  if (setupStep === "home") {
    return <HomeScreen onNavigate={setSetupStep} />;
  }

  if (setupStep === "faq") {
    return (
      <View className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
        {/* Header */}
        <View className="flex justify-between items-center px-5 py-4 h-14 flex-row">
          <TouchableOpacity
            onPress={() => setSetupStep("start")}
          >
            <Text className="text-muted-foreground">← Back</Text>
          </TouchableOpacity>
          <Text className="font-medium text-foreground">FAQ</Text>
          <View className="w-12" />
        </View>

        {/* FAQ Content */}
        <ScrollView className="flex-1 px-5 py-8">
          <View className="space-y-6">
            <View className="text-center mb-8 items-center">
              <HelpCircle className="w-20 h-20 text-primary mx-auto mb-4" />
              <Text className="mb-2 text-lg font-semibold">
                Frequently Asked Questions
              </Text>
              <Text className="text-muted-foreground text-center">
                Everything you need to know about StealthDetect
              </Text>
            </View>

            <View className="space-y-4">
              <View className="p-4 bg-muted rounded-lg">
                <Text className="mb-2 font-semibold">
                  StealthDetect has not found anything malicious, am I safe?
                </Text>
                <Text className="text-sm text-muted-foreground">
                  No. StealthDetect intercepts network flows from the analyzed device and tries to find something abnormal from them.
                </Text>
              </View>

              <View className="p-4 bg-muted rounded-lg">
                <Text className="mb-2 font-semibold">
                  Does StealthDetect store my device's communications?
                </Text>
                <Text className="text-sm text-muted-foreground">
                  At StealthDetect, We believe privacy is a fundamental human right. All data done by the scans will only be stored on your device and we will not have access to this. Everything is processed and stored directly on your device. No data is sent to external servers, ensuring complete privacy and control over your information.
                </Text>
              </View>

              <View className="p-4 bg-muted rounded-lg">
                <Text className="mb-2 font-semibold">
                  Is StealthDetect a forensics tool?
                </Text>
                <Text className="text-sm text-muted-foreground">
                  No. StealthDetect is not a forensics tool so it may miss signs of more hidden based stalkerware or spyware. If you think that your device is or have been compromised, please check out Mobile Verification Toolkit Kit from Amnesty International.
                </Text>
              </View>

              <View className="p-4 bg-muted rounded-lg">
                <Text className="mb-2 font-semibold">
                  What is a Duress Pin and why should I use it?{" "}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  A Duress Pin is a special code that is entered on a device to trigger a fake screen and show fake data when you are being forced to provide your normal PIN under threat. This is critical for victims of domestic violence as this may protect the scan data from the abuser.
                </Text>
              </View>

              <View className="p-4 bg-muted rounded-lg">
                <Text className="mb-2 font-semibold">
                  What should I do if StealthDetect finds stalkerware on my device?{" "}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  If there is a positive sign of stalkerware on your device, consult with a domestic violence shelter or local law enforcement to understand the next steps of your safety plan. StealthDetect can have false positives so be sure to reach out to the Coalition Against Stalkerware for any questions.
                </Text>
              </View>

              <View className="p-4 bg-muted rounded-lg">
                <Text className="mb-2 font-semibold">
                  Can I change my PIN later?
                </Text>
                <Text className="text-sm text-muted-foreground">
                  Yes, you can change both your main PIN and duress PIN anytime in Settings. You'll need to enter your current PIN to make changes.
                </Text>
              </View>
              <View className="p-4 bg-muted rounded-lg">
                <Text className="mb-2 font-semibold">
                  Is StealthDetect an antivirus?{" "}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  No. StealthDetect can only detect indicators of compromise via network traffic and alert the user whether or not there is stalkerware on the user's phone. StealthDetect will not remove stalkerware off the device due to safety risks for the victim.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Button */}
        <View className="px-5 py-4">
          <Button
            onPress={() => setSetupStep("home")}
            className="w-full h-12 bg-primary text-primary-foreground rounded-xl"
          >
            Continue to App
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </View>

        {/* Footer */}
        <View className="px-5 py-4 items-center">
          <Text className="text-xs text-muted-foreground">
            Identify. Report. Secure.
          </Text>
        </View>
      </View>
    );
  }

  if (setupStep === "decoy") {
    return (
      <DecoyDashboard onExit={() => setSetupStep("start")} />
    );
  }

  // Dashboard PIN entry screen
  if (setupStep === "dashboard-pin") {
    return (
      <View className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
        {/* Header */}
        <View className="flex justify-between items-center px-5 py-4 h-14 flex-row">
          <TouchableOpacity
            onPress={() => setSetupStep("home")}
          >
            <Text className="text-muted-foreground">← Back</Text>
          </TouchableOpacity>
          <Text className="font-medium text-foreground">Enter PIN</Text>
          <View className="w-12" />
        </View>

        {/* Content */}
        <View className="flex-1 px-5 py-8 flex flex-col">
          <View className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
            <View className="p-4 bg-primary/10 rounded-full">
              <Shield className="w-12 h-12 text-primary" />
            </View>

            <View className="space-y-2 max-w-sm items-center">
              <Text className="text-2xl font-medium text-foreground">
                Access Dashboard
              </Text>
              <Text className="text-muted-foreground">
                Enter your PIN to access the main dashboard
              </Text>
            </View>

            <View className="w-full max-w-sm space-y-4">
              <Input
                type="password"
                value={currentPin}
                onChange={(e) =>
                  setCurrentPin(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 8),
                  )
                }
                placeholder="Enter your PIN"
                className="h-12 text-center text-lg tracking-wider"
                maxLength={8}
              />
            </View>
          </View>

          <Button
            onPress={() => handleDashboardPinEntry(currentPin)}
            disabled={!currentPin || currentPin.length < 4}
            className="w-full h-12 bg-primary text-primary-foreground rounded-xl disabled:opacity-50"
          >
            Access Dashboard
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </View>

        {/* Footer */}
        <View className="px-5 py-4 items-center">
          <Text className="text-xs text-muted-foreground">
            Your PIN protects access to sensitive data
          </Text>
        </View>
      </View>
    );
  }

  // Desktop dashboard screens
  if (setupStep === "main-dashboard") {
    return <MainDashboard onNavigate={setSetupStep} />;
  }

  if (setupStep === "scan-progress") {
    return <ScanInProgress onNavigate={setSetupStep} />;
  }

  if (setupStep === "scan-report") {
    return <ScanReport onNavigate={setSetupStep} />;
  }

  // Welcome slideshow - default fallback
  return (
    <WelcomeSlideshow
      onGetStarted={() => {
        setCameFromWelcome(true);
        setSetupStep("permissions");
      }}
      onShowExplainer={() => setShowExplainer(true)}
      onQuickSetup={() => setSetupStep("setup-pins")}
    />
  );
}

// Main entry component that provides a persistent SQLite context
export default function App() {
  if (Platform.OS === "web") {
    return <WebApp />;
  }

  return (
    <SQLiteProvider databaseName="stealthdetect.db">
      <WebApp />
    </SQLiteProvider>
  );
}