import { AsyncResponse } from "../models/response.model";

export function setSelectedDataAsHtml(htmlContent: string) {
  return new Promise<AsyncResponse<true>>((resolve) => {
    if (Office.context.mailbox.item == null) {
      resolve({
        status: "ERROR",
        message: "Office.context.mailbox.item is not present",
      });
      return;
    }
    Office.context.mailbox.item.body.setSelectedDataAsync(
      htmlContent,
      { coercionType: Office.CoercionType.Html },
      function (result) {
        if (result.status === Office.AsyncResultStatus.Failed) {
          resolve({
            status: "ERROR",
            message: "Unable to set selected data!",
          });
        }
        resolve({ status: "SUCCESS", value: true });
      }
    );
  });
}

export function getFromRoamingSettings<T>(key: string) {
  const value = Office.context.roamingSettings.get(key);
  return value == null ? null : (value as T);
}

export async function setToRoamingSettings<T>(key: string, value: T) {
  Office.context.roamingSettings.set(key, value);
  return new Promise<void>((resolve) => {
    Office.context.roamingSettings.saveAsync(() => resolve());
  });
}

export function displayDialogAsync(
  startAddress: string,
  options?: Office.DialogOptions
): Promise<AsyncResponse<Office.Dialog>> {
  return new Promise((resolve) => {
    Office.context.ui.displayDialogAsync(startAddress, options, function (result) {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        resolve({ status: "SUCCESS", value: result.value });
        return;
      }
      resolve({ status: "ERROR", message: result.error.message });
    });
  });
}

export function messageParent(message: string) {
  Office.context.ui.messageParent(message);
}
