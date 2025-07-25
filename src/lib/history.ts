import { get, type Writable } from "svelte/store";
import { settings, type CustomValue, type Setting } from "./settings";
import {
  type Item,
  spotDeconstructor,
  spotConstructor,
} from "./spot-deconstructor";

const reformatBody = (body: string, item: Item) => {
  // <location><row><spot><date>

  let dated = body;
  if (item.date) {
    dated = dated.replace("<date>", item.date.toString());
  }
  const located = dated.replace("<location>", item.location);
  const rowed = located.replace("<row>", item.row);
  const spotted = rowed.replace("<spot>", item.spot);

  return spotted;
};

class HistoryManager {
  private storage: Item[];
  private localStorageKey = "history";

  constructor() {
    try {
      this.storage = JSON.parse(
        localStorage.getItem(this.localStorageKey) ?? "[]",
      ).map((item: Item) => ({
        ...item,
        date: new Date(item.date),
      }));
    } catch (error) {
      console.error("Failed to parse history from localStorage:", error);
      this.storage = [];
    }

    // legacy migrator
    if (
      localStorage.getItem("latestCode") !== "" &&
      localStorage.getItem("latestCode") !== null
    ) {
      const latestCode = localStorage.getItem("latestCode");
      const item = spotDeconstructor(latestCode as string, true);
      this.add(item);
      localStorage.removeItem("latestCode");
    }
  }

  public flush() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.storage));
  }

  public add(item: Item) {
    const webhookToggled = get(
      settings.get("toggleWebhook") as Writable<Setting>,
    );
    const webhookSetting = get(settings.get("webhook") as Writable<Setting>);
    const headersValue = webhookSetting.customValues.find(
      (value) => value.name === "headers",
    ) as CustomValue;
    const bodyValue = webhookSetting.customValues.find(
      (value) => value.name === "body",
    ) as CustomValue;

    console.log("webhooksettings", webhookSetting, headersValue, bodyValue);

    const reformattedBody = reformatBody(bodyValue.value as string, item);

    if (webhookSetting.value !== "" && webhookToggled.value) {
      let headers = null;
      try {
        headers = JSON.parse(headersValue.value as string);
      } catch (error) {
        console.error("Failed to parse webhook headers JSON:", error);
        headers = {};
      }

      fetch(webhookSetting.value as string, {
        method: "POST",
        headers: headers,
        body: reformattedBody,
      });
    }

    this.storage.unshift(item);
    this.flush();
  }

  get() {
    return Array.from(this.storage);
  }

  public clear() {
    this.storage = [];
    this.flush();
  }
}

export const history = new HistoryManager();
