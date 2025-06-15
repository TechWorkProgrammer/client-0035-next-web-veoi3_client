export const useRouteName = (path: string): string => {
    const baseRoute = path.split('/')[1] || 'Veoi3 - AI Video Generation with Realistic Sound';
    return baseRoute.charAt(0).toUpperCase() + baseRoute.slice(1);
};

