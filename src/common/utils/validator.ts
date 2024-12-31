export function validatePhoneNumber(username: string): boolean {
    const iranPhoneRegex = /^(?:\+98|09)\d{9}$/;
    return iranPhoneRegex.test(username);
}

export function validateEmail(username: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(username);
}
