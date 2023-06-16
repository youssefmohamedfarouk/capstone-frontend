import { Fragment, useState, useEffect, useRef } from "react";
import {
  FaceSmileIcon as FaceSmileIconOutline,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import {
  FaceFrownIcon,
  FaceSmileIcon as FaceSmileIconMini,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import axios from "axios";

const moods = [
  {
    name: "Excited",
    value: "excited",
    icon: FireIcon,
    iconColor: "text-white",
    bgColor: "bg-red-500",
  },
  {
    name: "Loved",
    value: "loved",
    icon: HeartIcon,
    iconColor: "text-white",
    bgColor: "bg-pink-400",
  },
  {
    name: "Happy",
    value: "happy",
    icon: FaceSmileIconMini,
    iconColor: "text-white",
    bgColor: "bg-green-400",
  },
  {
    name: "Sad",
    value: "sad",
    icon: FaceFrownIcon,
    iconColor: "text-white",
    bgColor: "bg-yellow-400",
  },
  {
    name: "Thumbsy",
    value: "thumbsy",
    icon: HandThumbUpIcon,
    iconColor: "text-white",
    bgColor: "bg-blue-500",
  },
  {
    name: "I feel nothing",
    value: null,
    icon: XMarkIcon,
    iconColor: "text-gray-400",
    bgColor: "bg-transparent",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Comments({
  currentUser,
  currentUserId,
  currentEvent,
  API,
}) {
  const [selected, setSelected] = useState(moods[5]);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const commentRef = useRef();

  useEffect(() => {
    axios.get(`${API}/events/${currentEvent.id}/comments`).then((res) => {
      setComments(res.data);
    });
  }, [currentEvent]);

  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [comments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API}/events/${currentEvent.id}/comments`, {
        user_id: currentUser.id,
        user_comment: text,
        mood: selected.value,
      })
      .then((res) => {
        setComments([...comments, res.data]);
        setSelected(moods[5]);
        setText("");
      });
  };

  const onChange = (e) => {
    e.preventDefault();
    setText(e.target.value);
  };

  return (
    <div>
      <div className="flex items-start space-x-4 ">
        <div className="flex-shrink-0">
          <img
            className="inline-block h-10 w-10 rounded-full outline outline-1 outline-orange-500"
            src={currentUser.profile_pic}
            alt=""
          />
        </div>
        <div className="min-w-0 flex-1 ">
          <form action="#">
            <div className="border-b border-gray-200 focus-within:border-orange-500">
              <label htmlFor="comment" className="sr-only">
                Add your comment
              </label>
              <textarea
                rows={3}
                name="comment"
                id="comment"
                className="block w-full resize-none border-0 border-b border-transparent p-0 pb-2 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Add your comment..."
                value={text}
                onChange={onChange}
              />
            </div>
            <div className="flex justify-between pt-2">
              <div className="flex items-center space-x-5">
                <div className="flow-root">
                  <button
                    type="button"
                    className="-m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                  >
                    <PaperClipIcon className="h-6 w-6" aria-hidden="true" />
                    <span className="sr-only">Attach a file</span>
                  </button>
                </div>
                <div className="flow-root">
                  <Listbox value={selected} onChange={setSelected}>
                    {({ open }) => (
                      <>
                        <Listbox.Label className="sr-only">
                          Your mood
                        </Listbox.Label>
                        <div className="relative">
                          <Listbox.Button className="relative -m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                            <span className="flex items-center justify-center">
                              {selected.value === null ? (
                                <span>
                                  <FaceSmileIconOutline
                                    className="h-6 w-6 flex-shrink-0"
                                    aria-hidden="true"
                                  />
                                  <span className="sr-only">Add your mood</span>
                                </span>
                              ) : (
                                <span>
                                  <span
                                    className={classNames(
                                      selected.bgColor,
                                      "flex h-8 w-8 items-center justify-center rounded-full"
                                    )}
                                  >
                                    <selected.icon
                                      className="h-5 w-5 flex-shrink-0 text-white"
                                      aria-hidden="true"
                                    />
                                  </span>
                                  <span className="sr-only">
                                    {selected.name}
                                  </span>
                                </span>
                              )}
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options
                              id="comments-section"
                              className="absolute z-10 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm"
                            >
                              {moods.map((mood) => (
                                <Listbox.Option
                                  key={mood.value}
                                  className={({ active }) =>
                                    classNames(
                                      active ? "bg-gray-100" : "bg-white",
                                      "relative cursor-default select-none px-3 py-2"
                                    )
                                  }
                                  value={mood}
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={classNames(
                                        mood.bgColor,
                                        "flex h-8 w-8 items-center justify-center rounded-full"
                                      )}
                                    >
                                      <mood.icon
                                        className={classNames(
                                          mood.iconColor,
                                          "h-5 w-5 flex-shrink-0"
                                        )}
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <span className="ml-3 block truncate font-medium">
                                      {mood.name}
                                    </span>
                                  </div>
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  onClick={handleSubmit}
                >
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {comments.map(({ username, user_comment, profile_pic }) => {
        return (
          <div className="mt-4" ref={commentRef}>
            <div class="flex flex-col space-y-2">
              <div class="bg-white p-2 rounded-lg shadow-md flex">
                <img
                  src={profile_pic}
                  className="rounded-full h-6 w-6 outline outline-orange-500 outline-1"
                ></img>
                <div className="pl-3">
                  <h3 class="text-sm font-bold">{username}</h3>
                  <p class=" mt-1 text-sm text-gray-700">{user_comment}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
