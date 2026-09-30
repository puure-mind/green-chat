export const MAX_MESSAGE_LENGTH = 4000;

export function validateMessageText(value: string) {
  const message = value.trim();

  if (message.length === 0) {
    return "Введите сообщение.";
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return `Сообщение должно быть не длиннее ${MAX_MESSAGE_LENGTH} символов.`;
  }

  return "";
}
