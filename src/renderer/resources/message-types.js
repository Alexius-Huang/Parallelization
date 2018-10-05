import bookmark from '@/assets/bookmark.svg';
import flag from '@/assets/flag.svg';
import viewColumns from '@/assets/view-columns.svg';
import speakerNotes from '@/assets/speaker-notes.svg';
import speakerNotesOff from '@/assets/speaker-notes-off.svg';

export const MessageTypes = {
  CREATE_TICKET: 0,
  CREATE_EPIC: 1,
  CREATE_BOARD: 2,
  ASSIGN_TICKET_TO_BOARD: 3,
  DROP_TICKET_FROM_BOARD: 4,
};

export const MessageIcons = {
  [MessageTypes.CREATE_TICKET]: bookmark,
  [MessageTypes.CREATE_EPIC]: flag,
  [MessageTypes.CREATE_BOARD]: viewColumns,
  [MessageTypes.ASSIGN_TICKET_TO_BOARD]: speakerNotes,
  [MessageTypes.DROP_TICKET_FROM_BOARD]: speakerNotesOff,
};

export const MessageMergable = {
  [MessageTypes.CREATE_TICKET]: false,
  [MessageTypes.CREATE_EPIC]: false,
  [MessageTypes.CREATE_BOARD]: false,
  [MessageTypes.ASSIGN_TICKET_TO_BOARD]: true,
  [MessageTypes.DROP_TICKET_FROM_BOARD]: true,
};
