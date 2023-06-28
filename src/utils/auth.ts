//Lưu AccessToken vào  localStorage
export const saveAccessTokenToLS = (access_token: string) => {
    localStorage.setItem('access_token', access_token);
};

//Xóa AccessToken trong  localStorage
export const clearAccessTokenFromLS = () => {
    localStorage.removeItem('access_token');
};

// Lấy AccessToken trong localStorage
export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || '';
