import bookmark from '@/assets/bookmark.svg';
import flag from '@/assets/flag.svg';

export const MessageTypes = {
  CREATE_TICKET: 0,
  CREATE_EPIC: 1,
};

export const MessageIcons = {
  [MessageTypes.CREATE_TICKET]: bookmark,
  [MessageTypes.CREATE_EPIC]: flag,
};
