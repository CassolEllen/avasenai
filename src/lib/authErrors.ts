/**
 * Translates Supabase auth error messages (English) into natural pt-BR text
 * for the AVA login/signup flows. Keeps fallbacks for unknown messages.
 */
export function translateAuthError(
  message: string,
  mode: "signin" | "signup",
  onEmailNotConfirmed?: () => void,
): string {
  const lower = message.toLowerCase();

  if (lower.includes("email not confirmed") || lower.includes("not confirmed")) {
    onEmailNotConfirmed?.();
    return "Confirme seu e-mail antes de acessar o sistema.";
  }

  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return "E-mail ou senha inválidos.";
  }

  if (lower.includes("user already registered") || lower.includes("already registered")) {
    return "Este e-mail já está cadastrado.";
  }

  if (lower.includes("password should be at least")) {
    return "A senha deve ter pelo menos 6 caracteres. Escolha uma senha mais segura.";
  }

  if (
    lower.includes("password is known to be weak") ||
    lower.includes("weak password") ||
    lower.includes("pwned") ||
    lower.includes("compromised password")
  ) {
    return "Escolha uma senha mais forte. Essa senha é muito comum ou já foi exposta em vazamentos.";
  }

  if (lower.includes("invalid email") || lower.includes("email address")) {
    return "Informe um e-mail válido.";
  }

  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Muitas tentativas em pouco tempo. Aguarde alguns instantes e tente novamente.";
  }

  if (lower.includes("otp") && lower.includes("expired")) {
    return "O link de confirmação é inválido ou expirou.";
  }

  if (lower.includes("network") || lower.includes("failed to fetch")) {
    return "Falha de conexão. Verifique sua internet e tente novamente.";
  }

  // Generic fallback by mode
  return mode === "signin"
    ? "Não foi possível entrar. Tente novamente."
    : "Não foi possível criar a conta. Tente novamente.";
}
