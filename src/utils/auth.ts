import { User } from 'src/types/user.type';

//Lưu AccessToken vào  localStorage
export const setAccessTokenToLS = (access_token: string) => {
    localStorage.setItem('access_token', access_token);
};

//Xóa AccessToken trong  localStorage
export const clearLS = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('profile');
};

// Lấy AccessToken trong localStorage
export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || '';

export const getProfileFromLS = () => {
    const result = localStorage.getItem('profile');
    return result ? JSON.parse(result) : null;
};

export const setProfileToLS = (profile: User) => {
    localStorage.setItem('profile', JSON.stringify(profile));
};
