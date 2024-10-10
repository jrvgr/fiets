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
    body.replace("<date>", item.date.toString());
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
    this.storage = JSON.parse(
      localStorage.getItem(this.localStorageKey) ?? "[]",
    ).map((item: Item) => ({
      date: new Date(item.date),
      ...item,
    }));
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
      fetch(webhookSetting.value as string, {
        method: "POST",
        headers: JSON.parse(headersValue.value as string) ?? null,
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
