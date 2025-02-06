const nameInput = document.getElementById(`my-name-input`);
const myMessage = document.getElementById(`my-message-input`);
const sendButton = document.getElementById(`send-button`);
const chatBox = document.getElementById(`chat`);
const serverURL = `https://it3049c-chat.fly.dev/messages`;

function formatMessage(message, myNameInput) {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

  if (myNameInput === message.sender) {
    return `
      <div class="mine messages">
        <div class="message">
          ${message.text}
        </div>
        <div class="sender-info">
          ${formattedTime}
        </div>
      </div>
    `;
  } else {
    return `
      <div class="yours messages">
        <div class="message">
          ${message.text}
        </div>
        <div class="sender-info">
          ${message.sender} ${formattedTime}
        </div>
      </div>
    `;
  }
}

async function fetchMessages() {
  const response = await fetch(serverURL);
  return response.json();
}

async function updateMessages() {
  const messages = await fetchMessages();
  let formattedMessages = ``;
  messages.forEach((message) => {
    formattedMessages += formatMessage(message, nameInput.value);
  });

  chatBox.innerHTML = formattedMessages; // Ensure chat updates
}


const MILLISECONDS_IN_TEN_SECONDS = 10000;
setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);

async function sendMessages(username, text) {
  const newMessage = {
    sender: username,
    text: text,
    timestamp: new Date(),
  };

  try {
    await fetch(serverURL, {
      method: `POST`,
      headers: {
        "Content-Type": `application/json`,
      },
      body: JSON.stringify(newMessage),
    });

    await updateMessages(); g;
  } catch (error) {
    console.error(`Error sending message:`, error);
  }
}

sendButton.addEventListener(`click`, function(event) {
  event.preventDefault();
  const sender = nameInput.value;
  const message = myMessage.value;
  sendMessages(sender, message);
  myMessage.value = ``;
});