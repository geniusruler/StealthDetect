import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";

import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
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
import { ScanReport } from "./components/ScanReport"


import {
  ChevronRight,
  Shield,
  AlertTriangle,
  Radar,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react";

// Import: SQLite Local Database
import { initDB } from "./db/db";

type SetupStep =
  | "start"
  | "welcome"
  | "permissions"
  | "main-pin"
  | "duress-pin"
  | "ready"
  | "home"
  | "dashboard-pin"
  | "main-dashboard"
  | "faq"
  | "decoy"
  | "setup-pins"
  | "enter-pin"
  | "scan-progress"
  | "scan-report"
  | "network-map";
 // include all screens you use

// Move platform detection outside component to avoid recalculation
const isIOSDevice =
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

// Simple validation function - no need to memoize
const validatePin = (pin: string) => /^\d{4,8}$/.test(pin);

function WebApp() {
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
      <div className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 h-14">
          <button
            onClick={() => setShowExplainer(false)}
            className="text-muted-foreground"
          >
            ← Back
          </button>
          <h1 className="font-medium text-foreground">
            About StealthDetect
          </h1>
          <div className="w-12" />
        </div>

        {/* Explainer Content */}
        <div className="flex-1 px-5 py-8">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Shield className="w-20 h-20 text-primary mx-auto mb-4" />
              <h2 className="mb-2">Privacy by Design</h2>
              <p className="text-muted-foreground">
                StealthDetect is built with privacy as the
                foundation, not an afterthought.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="mb-2">No Data Collection</h3>
                <p className="text-sm text-muted-foreground">
                  We don't collect, store, or transmit your
                  personal information. Everything stays on your
                  device.
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="mb-2">Open Source Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Our architecture is designed for transparency.
                  Audit the code, verify the promises.
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="mb-2">Minimal Permissions</h3>
                <p className="text-sm text-muted-foreground">
                  Only requests essential system access needed
                  for health monitoring. No unnecessary
                  permissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
        <div className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 h-14">
            <button
              onClick={() => setShowSecurityInfo(false)}
              className="text-muted-foreground"
            >
              ← Back
            </button>
            <h1 className="font-medium text-foreground">
              Security Info
            </h1>
            <div className="w-12" />
          </div>

          {/* Security Info Content */}
          <div className="flex-1 px-5 py-8">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Shield className="w-20 h-20 text-primary mx-auto mb-4" />
                <h2 className="mb-2">
                  {isIOSDevice
                    ? "How Your Data Is Secured on iOS"
                    : "How Your Data Is Secured on iOS and Android"}
                </h2>
              </div>

              <div className="space-y-4">
                {isIOSDevice ? (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      On iOS, setting a passcode for your device
                      automatically enables hardware-level file
                      encryption.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      StealthDetect leverages this protection,
                      meaning all app data stored on your device
                      is already encrypted by the operating
                      system. Your PIN adds a second layer of
                      security for accessing the app itself.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        StealthDetect stores all data in the
                        app's private sandboxed storage. For
                        maximum protection, we recommend
                        enabling device encryption.
                      </p>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="mb-2">
                        How do I know if my phone is encrypted?:
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                          • On iOS,go to your device's Settings
                          → Settings → Face (or Touch) ID &
                          Passcode.
                        </li>
                        <li>
                          • Enable a strong passcode or
                          passphrase
                        </li>
                        <li>
                          • On modern Android devices, users
                          will have to enable encryption in
                          their settings depending on their
                          device.
                        </li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-2">
                        When full disk encryption is active, it
                        uses your device's Secure Element (SE)
                        to protect the encryption keys, making
                        your data unreadable without your
                        passcode or PIN. On iOS, this is
                        protected by the Secure Enclave.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 h-14">
          <button
            onClick={() => setSetupStep("permissions")}
            className="text-muted-foreground"
          >
            ← Back
          </button>
          <h1 className="font-medium text-foreground">Setup</h1>
          <div className="w-12" />
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-8 flex flex-col">
          <div className="flex-1 flex flex-col items-center text-center space-y-8">
            <Shield className="w-16 h-16 text-primary" />

            <div className="space-y-2 max-w-sm">
              <h2 className="text-2xl font-medium text-foreground">
                Set Main PIN
              </h2>
              <p className="text-muted-foreground">
                Use 4–8 digits to unlock your full data
              </p>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  Main PIN
                </label>
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
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  Confirm PIN
                </label>
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
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Your PIN is stored securely on this device.{" "}
                <button
                  onClick={() => setShowSecurityInfo(true)}
                  className="text-primary underline"
                >
                  Learn more
                </button>
              </p>
            </div>
          </div>

          <Button
            onClick={() => setSetupStep("duress-pin")}
            disabled={!canProceedMainPin}
            className="w-full h-12 bg-primary text-primary-foreground rounded-xl disabled:opacity-50"
          >
            Continue
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (setupStep === "duress-pin") {
    return (
      <div className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 h-14">
          <button
            onClick={() => setSetupStep("main-pin")}
            className="text-muted-foreground"
          >
            ← Back
          </button>
          <h1 className="font-medium text-foreground">Setup</h1>
          <div className="w-12" />
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-8 flex flex-col">
          <div className="flex-1 flex flex-col items-center text-center space-y-8">
            <div className="relative">
              <Shield className="w-16 h-16 text-primary" />
              <AlertTriangle className="w-4 h-4 text-orange-500 absolute -top-1 -right-1" />
            </div>

            <div className="space-y-2 max-w-sm">
              <h2 className="text-2xl font-medium text-foreground">
                Set Duress PIN (Optional)
              </h2>
              <p className="text-muted-foreground">
                Unlocks a decoy view in emergencies
              </p>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  Duress PIN
                </label>
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
              </div>

              {duressPin && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    Confirm Duress PIN
                  </label>
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
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Not your main PIN. Change anytime in Settings.
              </p>

              {/* Why Section */}
              <div className="mt-6 border-t border-border pt-4">
                <button
                  onClick={() =>
                    setShowDuressWhy(!showDuressWhy)
                  }
                  className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg text-left"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Why use a Duress PIN?
                    </span>
                  </div>
                  {showDuressWhy ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                {showDuressWhy && (
                  <div className="mt-3 p-4 bg-muted rounded-lg space-y-3">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">
                        An Attacker You Know
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        If you're forced to unlock the app by an
                        adversary, entering your duress PIN will
                        show a clean, empty version instead of
                        your real data. This protects sensitive
                        information collected by StealthDetect
                        from being discovered.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">
                        Plausible Deniability
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        This gives you the ability to deny
                        knowledge of the existence that your
                        phone was being checked for stalkerware.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground italic">
                        The duress view will show fake data and
                        no scan results will be visible.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {duressPin ? (
              <Button
                onClick={() => setSetupStep("ready")}
                disabled={!canProceedDuressPin}
                className="w-full h-12 bg-primary text-primary-foreground rounded-xl disabled:opacity-50"
              >
                Enable Duress PIN
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : null}

            <Button
              onClick={() => setSetupStep("ready")}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              Skip
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (setupStep === "ready") {
    return (
      <div className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 h-14">
          <h1 className="font-medium text-foreground">
            StealthDetect
          </h1>
          <span className="text-sm text-muted-foreground">
            v0.1
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-8 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
            <Radar className="w-16 h-16 text-primary" />

            <div className="space-y-2 max-w-sm">
              <h2 className="text-2xl font-medium text-foreground">
                All Set
              </h2>
              <p className="text-muted-foreground">
                We're ready to analyze your device
              </p>
            </div>
          </div>

          {/* Progress dots - all completed */}
          <div className="flex justify-center space-x-2 mb-8">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-primary"
              />
            ))}
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setSetupStep("scan-progress")}
              className="w-full h-12 bg-primary text-primary-foreground rounded-xl"
            >
              Start First Scan
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              onClick={() => setSetupStep("home")}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              Maybe Later
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            Identify. Report. Secure.
          </p>
        </div>
      </div>
    );
  }

  if (setupStep === "home") {
    return <HomeScreen onNavigate={setSetupStep} />;
  }

  if (setupStep === "faq") {
    return (
      <div className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 h-14">
          <button
            onClick={() => setSetupStep("start")}
            className="text-muted-foreground"
          >
            ← Back
          </button>
          <h1 className="font-medium text-foreground">FAQ</h1>
          <div className="w-12" />
        </div>

        {/* FAQ Content */}
        <div className="flex-1 px-5 py-8">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <HelpCircle className="w-20 h-20 text-primary mx-auto mb-4" />
              <h2 className="mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about StealthDetect
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="mb-2">
                  StealthDetect has not found anything
                  malicious, am I safe?{" "}
                </h3>
                <p className="text-sm text-muted-foreground">
                  No. StealthDetect intercepts network flows
                  from the analysed device and tries to find
                  something abnormal from them. StealthDetect
                  can only detect live and communicating
                  requests from infected devices. Some network
                  requests can easily prevent to be intercepted
                  or hide their malicious communications in
                  legitimate network flows.
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="mb-2">
                  Does StealthDetect store my device's
                  communications?
                </h3>
                <p className="text-sm text-muted-foreground">
                  At StealthDetect, We believe privacy is a
                  fundamental human right. All data done by the
                  scans will only be stored on your device and
                  we will not have access to this. Everything is
                  processed and stored directly on your device.
                  No data is sent to external servers, ensuring
                  complete privacy and control over your
                  information.
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="mb-2">
                  Is StealthDetect a forensics tool?
                </h3>
                <p className="text-sm text-muted-foreground">
                  No. StealthDetect is not a forensics tool so
                  it may miss signs of more hidden based
                  stalkerware or spyware. If you think that your
                  device is or have been compromised, please
                  check out Mobile Verification Toolkit Kit from
                  Amnesty International.
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="mb-2">
                  What is a Duress Pin and why should I use
                  it?{" "}
                </h3>
                <p className="text-sm text-muted-foreground">
                  A Duress Pin is a special code that is entered
                  on a device to trigger a fake screen and show
                  fake data when you are being forced to provide
                  your normal PIN under threat. This is critical
                  for victims of domestic violence as this may
                  protect the scan data from the abuser.
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="mb-2">
                  What should I do if StealthDetect finds
                  stalkerware on my device?{" "}
                </h3>
                <p className="text-sm text-muted-foreground">
                  If there is a positive sign of stalkerware on
                  your device, consult with a domestic violence
                  shelter or local law enforcement to understand
                  the next steps of your safety plan.
                  StealthDetect can have false positives so be
                  sure to reach out to the Coalition Against
                  Stalkerware for any questions.
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="mb-2">
                  Can I change my PIN later?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can change both your main PIN and
                  duress PIN anytime in Settings. You'll need to
                  enter your current PIN to make changes.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="mb-2">
                  Is StealthDetect an antivirus?{" "}
                </h3>
                <p className="text-sm text-muted-foreground">
                  No. StealthDetect can only detect indicators
                  of compromise via network traffic and alert
                  the user whether or not there is stalkerware
                  on the user's phone. StealthDetect will not
                  remove stalkerware off the device due to
                  safety risks for the victim.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-5 py-4">
          <Button
            onClick={() => setSetupStep("home")}
            className="w-full h-12 bg-primary text-primary-foreground rounded-xl"
          >
            Continue to App
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            Identify. Report. Secure.
          </p>
        </div>
      </div>
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
      <div className="w-full max-w-[390px] mx-auto min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 h-14">
          <button
            onClick={() => setSetupStep("home")}
            className="text-muted-foreground"
          >
            ← Back
          </button>
          <h1 className="font-medium text-foreground">
            Enter PIN
          </h1>
          <div className="w-12" />
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-8 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
            <div className="p-4 bg-primary/10 rounded-full">
              <Shield className="w-12 h-12 text-primary" />
            </div>

            <div className="space-y-2 max-w-sm">
              <h2 className="text-2xl font-medium text-foreground">
                Access Dashboard
              </h2>
              <p className="text-muted-foreground">
                Enter your PIN to access the main dashboard
              </p>
            </div>

            <div className="w-full max-w-sm space-y-4">
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
            </div>
          </div>

          <Button
            onClick={() => handleDashboardPinEntry(currentPin)}
            disabled={!currentPin || currentPin.length < 4}
            className="w-full h-12 bg-primary text-primary-foreground rounded-xl disabled:opacity-50"
          >
            Access Dashboard
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            Your PIN protects access to sensitive data
          </p>
        </div>
      </div>
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

type NativeScreen = "landing" | "dashboard" | "scanProgress" | "report";

function NativeApp() {
  const [screen, setScreen] = useState<NativeScreen>("landing");
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStartScan = useCallback(() => {
    if (isScanning) {
      return;
    }
    setIsScanning(true);
    setScreen("scanProgress");
    showToast("Starting deep scan");
    scanTimeoutRef.current = setTimeout(() => {
      setIsScanning(false);
      setLastScan(new Date().toLocaleTimeString());
      setScreen("report");
      showToast("Scan complete", "No threats detected.");
      scanTimeoutRef.current = null;
    }, 2000);
  }, [isScanning]);

  const handleCancelScan = useCallback(() => {
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
    setIsScanning(false);
    setScreen("dashboard");
    showToast("Scan cancelled");
  }, []);

  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={nativeStyles.safeArea}>
      <ScrollView contentContainerStyle={nativeStyles.container}>
        {screen === "landing" && (
          <View style={nativeStyles.card}>
            <Text style={nativeStyles.title}>StealthDetect</Text>
            <Text style={nativeStyles.subtitle}>
              Privacy-first stalkerware defense that runs directly on your device.
            </Text>
            <NativeButton
              label="Continue"
              onPress={() => setScreen("dashboard")}
            />
            <NativeButton
              label="Security Checklist"
              variant="outline"
              onPress={() =>
                showToast(
                  "Permissions",
                  "Enable system usage and notification access for the most accurate protection.",
                )
              }
            />
          </View>
        )}

        {screen === "dashboard" && (
          <View style={nativeStyles.card}>
            <Text style={nativeStyles.title}>Device Status</Text>
            <Text style={nativeStyles.body}>Protected & Monitoring</Text>
            {lastScan && (
              <Text style={nativeStyles.caption}>
                Last scan completed at {lastScan}
              </Text>
            )}
            <View style={nativeStyles.badgeRow}>
              <View style={[nativeStyles.badge, nativeStyles.badgeSpacer]}>
                <Text style={nativeStyles.badgeText}>Firewall: On</Text>
              </View>
              <View style={nativeStyles.badge}>
                <Text style={nativeStyles.badgeText}>DNS Filter: Active</Text>
              </View>
            </View>
            <NativeButton
              label={isScanning ? "Starting scan..." : "Start Deep Scan"}
              onPress={handleStartScan}
              disabled={isScanning}
            />
            <NativeButton
              label="View Latest Report"
              variant="outline"
              onPress={() => setScreen("report")}
            />
            <NativeButton
              label="Back to Welcome"
              variant="outline"
              onPress={() => setScreen("landing")}
            />
          </View>
        )}

        {screen === "scanProgress" && (
          <View style={nativeStyles.card}>
            <Text style={nativeStyles.title}>Deep Scan In Progress</Text>
            <Text style={nativeStyles.body}>
              We are inspecting recent network activity and installed apps for anomalies.
            </Text>
            <NativeButton
              label="Cancel Scan"
              variant="outline"
              onPress={handleCancelScan}
            />
          </View>
        )}

        {screen === "report" && (
          <View style={nativeStyles.card}>
            <Text style={nativeStyles.title}>Latest Scan Report</Text>
            <Text style={nativeStyles.body}>
              No suspicious patterns were detected.
            </Text>
            {lastScan && (
              <Text style={nativeStyles.caption}>Completed at {lastScan}</Text>
            )}
            <NativeButton
              label="Run Another Scan"
              onPress={() => setScreen("dashboard")}
            />
            <NativeButton
              label="Back to Dashboard"
              variant="outline"
              onPress={() => setScreen("dashboard")}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type NativeButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  disabled?: boolean;
};

function NativeButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: NativeButtonProps) {
  const buttonStyle = [
    nativeStyles.buttonBase,
    variant === "outline"
      ? nativeStyles.buttonOutline
      : nativeStyles.buttonPrimary,
    disabled && nativeStyles.buttonDisabled,
  ];

  const textStyle = [
    nativeStyles.buttonText,
    variant === "outline"
      ? nativeStyles.buttonTextOutline
      : nativeStyles.buttonTextPrimary,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={buttonStyle}
    >
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}

const nativeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#0f172a",
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#f8fafc",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#cbd5f5",
    marginBottom: 16,
  },
  body: {
    fontSize: 14,
    color: "#cbd5f5",
    marginBottom: 12,
  },
  caption: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 8,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  badge: {
    flex: 1,
    backgroundColor: "rgba(37, 99, 235, 0.15)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  badgeSpacer: {
    marginRight: 8,
  },
  badgeText: {
    color: "#bfdbfe",
    fontSize: 12,
    fontWeight: "500",
  },
  buttonBase: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginTop: 12,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#2563eb",
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextPrimary: {
    color: "#f8fafc",
  },
  buttonTextOutline: {
    color: "#bfdbfe",
  },
});

export default function App() {
    // Init: Database connection
    useEffect(() => {
        initDB();
    }, []);

    if (Platform.OS === "web") {
        return <WebApp />;
    }

    return <NativeApp />;
}