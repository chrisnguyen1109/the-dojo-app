export const authSelector = state => state.auth;

export const userAuthSelector = state => state.auth.currentUser;

export const authReadyAuthSelector = state => state.auth.isAuthReady;
