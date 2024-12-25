import { ObjectId } from 'mongodb';
export type TokensPayload = {
  mobile: string;
  id: ObjectId;
};
