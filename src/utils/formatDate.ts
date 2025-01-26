import dayjs from 'dayjs';

export const formatDate = (date?: string) => {
    if (!date) return '';

    const timestamp = Number(date.match(/\d+/)?.[0]);

    return dayjs(timestamp).format('YYYY-MM-DD');
};
