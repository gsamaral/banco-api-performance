export function pegarBaseUrl() {
    const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';
    return baseUrl;
}