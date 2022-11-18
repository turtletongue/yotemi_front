import { Id } from '@app/declarations';

interface INewLectureNotification {
  id: Id;
  type: 'new-lecture';
  lecture: {
    title: string;
    coverUrl: string;
    author: {
      name: string;
      avatarUrl: string;
    };
  };
}

export default INewLectureNotification;
