export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'],
  },
  chat: {
    sessions: () => ['chat', 'sessions'],
  },
  resources: {
    all: () => ['resources'],
    filtered: (params) => ['resources', params],
  },
}
