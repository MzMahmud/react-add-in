import { getFromRoamingSettings, setToRoamingSettings } from "../../services/office";

console.warn("launch-event.ts");

Office.onReady(() => {
  // setToRoamingSettings("errorMessage", "You have not done anything yet!");
  console.warn("office ready");
});

async function onNewMessageComposeHandler(event: Office.MailboxEvent) {
  console.warn(event);
  setSubject(event);
}
function setSubject(event: Office.MailboxEvent) {
  Office.context.mailbox.item?.subject.setAsync(
    "This is a test subject! Time 12:26 PM",
    {
      asyncContext: event,
    },
    function (asyncResult) {
      // Handle success or error.
      if (asyncResult.status !== Office.AsyncResultStatus.Succeeded) {
        console.error("Failed to set subject: " + JSON.stringify(asyncResult.error));
      }

      // Call event.completed() to signal to the Outlook client that the add-in has completed processing the event.
      asyncResult.asyncContext.completed();
    }
  );
}

function onMessageSendHandler(event: Office.MailboxEvent) {
  console.warn("onMessageSendHandler", event);
  const errorMessage = getFromRoamingSettings<string>("errorMessage");
  event.completed({ allowEvent: false, errorMessage: errorMessage ?? "<No message found>" });
}

Office.actions.associate("onNewMessageComposeHandler", onNewMessageComposeHandler);
Office.actions.associate("onMessageSendHandler", onMessageSendHandler);

// IMPORTANT: To ensure your add-in is supported in the Outlook client on Windows, remember to map the event handler name specified in the manifest to its JavaScript counterpart.
// if (Office.context.platform === Office.PlatformType.PC || Office.context.platform == null) {
//   Office.actions.associate("onNewMessageComposeHandler", onNewMessageComposeHandler);
// }
