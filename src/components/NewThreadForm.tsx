import { useState } from "react";
import { useSession } from "next-auth/react";
import Button from "./Button";
import ProfileImage from "./ProfileImage";

export default function NewThreadForm() {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");

  if (session.status !== "authenticated") return;

  return (
    <form className="flex flex-col gap-2 border-b px-4 py-2">
      <div className="flex items-center gap-4">
        <ProfileImage src={session.data.user.image} />
        <textarea
          style={{ height: 0 }}
          value={inputValue}
          className="flex-frow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="Wanna share something?"
        />
      </div>
      <Button className="self-end">Post</Button>
    </form>
  );
}
