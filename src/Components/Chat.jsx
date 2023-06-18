import Talk from "talkjs";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Chat({
  currentUser,
  chatTarget,
  API,
  chatVisible,
  chatOpen,
  setChatOpen,
}) {
  const chatboxEl = useRef();

  // wait for TalkJS to load
  const [talkLoaded, markTalkLoaded] = useState(false);

  useEffect(() => {
    //   .then(Talk.ready.then(() => markTalkLoaded(true)));

    Talk.ready.then(() => markTalkLoaded(true));

    if (talkLoaded && currentUser && chatTarget.id) {
      const chatUserOne = new Talk.User({
        id: currentUser.id ? currentUser.id : "",
        name: currentUser.first_name + " " + currentUser.last_name,
        email: currentUser.email,
        photoUrl: currentUser.profile_pic,
        welcomeMessage: "Hello!",
        role: "default",
      });

      const otherUser = new Talk.User({
        id: chatTarget.id ? chatTarget.id : "",
        name: chatTarget.first_name + " " + chatTarget.last_name,
        email: chatTarget.email,
        photoUrl: chatTarget.profile_pic,
        welcomeMessage: "Hello!",
        role: "default",
      });

      const session = new Talk.Session({
        appId: "tmaZjXcm",
        me: chatUserOne,
      });

      const conversationId = Talk.oneOnOneId(chatUserOne, otherUser);
      const conversation = session.getOrCreateConversation(conversationId);
      conversation.setParticipant(chatUserOne);
      conversation.setParticipant(otherUser);

      const chatbox = session.createPopup({ launcher: "always" });
      chatbox.select(conversation);
      chatbox.mount({ show: false });

      if (chatOpen) chatbox.show();

      return () => session.destroy();
    }
  }, [talkLoaded, chatOpen]);

  //   console.log(chatboxEl.current.className);
  return (
    <div
      ref={chatboxEl}
      id="chatBox"
      className="absolute bottom-0 right-0 h-1/3 w-1/3"
    />
  );
}
