export const checkScrollPosition = () => {
    const documentHeight = document.documentElement.scrollHeight;
    const screenHeight = window.innerHeight;
    const scrolled = window.scrollY;
    const threshold = screenHeight / 3;
    const position = documentHeight - scrolled - screenHeight;
    return position <= threshold;
};