// setMenuButton.js
const BOT_TOKEN = "7577239648:AAHAMS1lqz5ARBSM5SdwKdKAeA22yCLlp34";

const url = `https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`;

const body = {
  menu_button: {
    type: "web_app",
    text: "Создать турнир",
    web_app: { url: "https://honeycup.ru/tg/create" }
  }
};

async function main() {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log(data);
}

main();
