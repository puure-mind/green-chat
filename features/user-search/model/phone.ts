const MIN_PHONE_LENGTH = 11;
const MAX_PHONE_LENGTH = 16;

export function normalizePhoneInput(value: string) {
  return value.replace(/\D/g, "");
}

export function validatePhoneNumber(value: string) {
  const phone = normalizePhoneInput(value);

  if (phone.length === 0) {
    return "Введите номер телефона.";
  }

  if (phone.length < MIN_PHONE_LENGTH || phone.length > MAX_PHONE_LENGTH) {
    return "Номер должен содержать от 11 до 16 цифр в международном формате.";
  }

  return "";
}

export function getPhoneFromChatId(chatId: string) {
  return chatId.replace(/@c\.us$|@lid$/u, "").replace(/\D/g, "");
}
