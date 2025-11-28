export const getAccessDate = () => {
    const date = new Date();
    const brDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    return brDate.toISOString().split('T')[0];
}