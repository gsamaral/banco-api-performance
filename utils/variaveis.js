const configLocal = JSON.parse(open('./config/config.local.json'));
export function pegarBaseUrl() {
    const baseUrl = __ENV.BASE_URL || configLocal.baseUrl;
    return baseUrl;
}
