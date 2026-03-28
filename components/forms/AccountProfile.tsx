"use client";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string | undefined;
    bio: string | undefined;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  return <div></div>;
};
export default AccountProfile;
