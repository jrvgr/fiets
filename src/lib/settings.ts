import { get, readonly, writable, type Writable } from "svelte/store";

export type Setting = {
  type: string;
  id: number;
  name: string;
  value: boolean | string | number | null;
  description: string;
  customValues: CustomValue[] | [];
  placeholder?: string;
};

export type CustomValue = {
  // reminder: not the same as the name of a normal setting, this acts a bit like an id
  name: string;
  value: boolean | string | number | null;
  type: string;
  description: string;
  placeholder: string;
};

const defaultSettings: Record<string, Setting> = {
  barcodeDetector: {
    type: "boolean",
    id: 1,
    name: "Use barcodeDetector API",
    value: true,
    description:
      "Use the barcodeDetector API to detect QR codes (try turning this off or on if you're experiencing problems. May not work on some devices)",
    customValues: [],
  },
  toggleWebhook: {
    type: "boolean",
    id: 3,
    name: "Toggle Webhook",
    value: false,
    description: "Toggle the webhook on or off",
    customValues: [],
  },
  webhook: {
    type: "string",
    id: 2,
    name: "Webhook",
    value: "",
    description:
      "Execute webhook every time a QR code is detected, leave empty to do nothing",
    placeholder: "https://example.com",
    customValues: [
      {
        name: "body",
        placeholder: "{}",
        value: "",
        type: "string",
        description:
          "Body for the request, replaces <location>, <row>, <spot>, <date> with the actual values",
      },
      {
        name: "headers",
        placeholder: "{}",
        value: "",
        type: "string",
        description: "Headers for the request in json format",
      },
    ],
  },
};

function GetInitialSettings() {
  const storedSettings = localStorage.getItem("settings");
  const clone = {} as { [key: string]: Writable<Setting> };

  Object.keys(defaultSettings).forEach((element) => {
    Object.assign(clone, {
      [element]: writable(structuredClone(defaultSettings[element])),
    });
  });

  console.log("clone", clone);

  // if there are no stored settings, return the default settings
  if (!storedSettings || storedSettings === "") {
    return clone;
  }

  const parsedSettings = JSON.parse(storedSettings!);
  // first we write the default settings, to the clone, after that we overwrite the default settings with the stored settings

  Object.keys(parsedSettings).forEach((element) => {
    clone[element].update((cur) => ({
      ...cur,
      value: parsedSettings[element].value,
      // we need to only assign the saved value, the rest of the custom value should be the default
      customValues: cur.customValues.map((customValue, i) => {
        const defaultValue = defaultSettings[element].customValues.find(
          (value) => value.name === customValue.name,
        ) as CustomValue;
        return {
          ...defaultValue,
          value: parsedSettings[element].customValues
            ? parsedSettings[element].customValues[i].value
            : defaultValue.value,
        };
      }),
    }));
  });

  console.log(clone);

  return clone;
}

class SettingsManager {
  private storage: Record<string, Writable<Setting>>;
  private localStorageKey = "settings";

  constructor(currentSettings: Record<string, Writable<Setting>>) {
    this.storage = currentSettings;
  }

  public update(
    name: keyof typeof defaultSettings,
    value: boolean | number | string,
    customValueName?: string,
  ) {
    console.log("update", value, name);
    if (customValueName) {
      this.storage[name].update((cur) => ({
        ...cur,
        customValues: cur.customValues.map((customValue) =>
          customValue.name === customValueName
            ? { ...customValue, value }
            : customValue,
        ) as CustomValue[],
      }));
    } else {
      this.storage[name].update((cur) => ({ ...cur, value: value }));
    }
    this.flush();
  }

  public flush() {
    // make sure that every svelte store is made into a normal object
    const clone = {} as { [key: string]: Setting };
    Object.keys(this.storage).forEach((element) => {
      clone[element] = get(this.storage[element]);
    });
    localStorage.setItem(this.localStorageKey, JSON.stringify(clone));
  }

  public get(setting?: keyof typeof defaultSettings) {
    return setting
      ? (Object.freeze(this.storage[setting]) as Writable<Setting>)
      : (Object.freeze(this.storage) as Record<string, Writable<Setting>>);
  }
}

export const settings = new SettingsManager(GetInitialSettings());
settings.flush;
