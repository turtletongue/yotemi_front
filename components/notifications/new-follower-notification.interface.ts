import { Id } from '@app/declarations';

interface INewFollowerNotification {
  id: Id;
  type: 'new-follower';
  follower: {
    name: string;
    avatarUrl: string;
  };
}

export default INewFollowerNotification;
