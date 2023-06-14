import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditProfile({ setCurrentUser, session, currentUser }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileUser, setProfileUser] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  console.log(profileUser);

  useEffect(() => {
    if (!session || !session.session_id) {
      navigate("/login");
    }
  }, [session]);

  // Function to update the 'profileUser' state with input field values
  const updateProfileUser = (e) => {
    setProfileUser({ ...profileUser, [e.target.id]: e.target.value });
  };

  // Fetch the user data from the API and update the 'profileUser' state
  useEffect(() => {
    axios
      .get(`${API}/users/${id}`)
      .then((res) => {
        setProfileUser(res.data);
      })
      .catch((error) => {
        navigate("/404");
        console.error("Error fetching user:", error);
      });
  }, [id, API]);

  // // HANDLERS // //

  //triggered when the user selects a file for upload. It sets the selectedFile state variable to the selected file and uses FileReader to read the file data and update the profile_pic property
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    // Generate image preview
    const reader = new FileReader(); // Create a new instance of the FileReader object
    reader.onload = () => {
      // When the file is loaded, execute this function
      setProfileUser({ ...profileUser, profile_pic: reader.result });
      // Update the 'profileUser' state by merging the existing data with the new 'profile_pic' property, which contains the data URL of the selected image
    };
    reader.readAsDataURL(file);
    // Read the contents of the selected file and convert it to a data URL format
  };

  // Function to handle the uploaded image
  const handleUploadedImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile_pic", selectedFile);

    // Upload the image file to the server
    axios
      .post(`${API}/users/${id}/upload`, formData)
      .then((response) => {
        // Handle successful upload
        const fileUrl = response.data.staticUrl;
        // setCurrentUser(response.data);
        setProfileUser({
          ...profileUser,
          profile_pic: response.data.profile_pic,
        });
      })
      .catch((error) => {
        // Handle upload error
        console.error("Error uploading file:", error);
      });
  };

  const handleSave = (e) => {
    e.preventDefault();

    let updatedUser = { ...profileUser };

    if (selectedFile) {
      const formData = new FormData();
      formData.append("profile_pic", selectedFile);
      axios.post(`${API}/users/${id}/upload`, formData).then((res) => {
        const fileUrl = res.data.staticUrl;
        updatedUser = { ...updatedUser, profile_pic: fileUrl };
      });
    }

    axios
      .put(`${API}/users/${session?.user_id || currentUser.id}`, updatedUser)
      .then((res) => {
        console.log(res.data);
        setCurrentUser(res.data);
        navigate(`/profile/${session.user_id || currentUser.id}`);
      });
  };

  // const handleSaveOfPage = async (e) => {
  //   e.preventDefault(); // Prevent the default form submission behavior

  //   try {
  //     let updatedUser = { ...profileUser }; // Create a copy of the profileUser object

  //     if (selectedFile) {
  //       const formData = new FormData();
  //       formData.append("profile_pic", selectedFile);
  //       const response = await axios.post(
  //         `${API}/users/${id}/upload`,
  //         formData
  //       );
  //       const fileUrl = response.data.staticUrl; // Assuming the response contains the static URL

  //       updatedUser = { ...updatedUser, profile_pic: fileUrl };
  //     }

  //     // Make the PUT request using Axios
  //     const response = await axios.put(
  //       `${API}/users/${session?.user_id || currentUser.id}`,
  //       updatedUser
  //     );

  //     console.log(response.data);
  //     setCurrentUser(response.data); // Update the profileUser state with the updatedUser object
  //     navigate(`/profile/${session.user_id || currentUser.id}`); // Navigate to the "Profile" component without passing the state object
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //   }
  // };

  return (
    <div>
      <div>
        <br />
        <br />

        <title>Profile</title>
        <meta charSet="utf-8" />
        <meta name="description" content />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        <link rel="stylesheet" href="css/tailwind/tailwind.min.css" />
        <link rel="stylesheet" href="css/main.css" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="shuffle-for-tailwind.png"
        />
        <div className>
          <div>
            <Sidebar currentUser={currentUser} />
            <nav className="lg:hidden flex items-center justify-between p-8 bg-gray-700 mb-3">
              <div className="w-full xl:w-auto px-2 xl:mr-12">
                <div className="flex items-center justify-between">
                  <a className="inline-flex items-center h-8" href="#">
                    <img src="trizzle-assets/logos/trizzle-logo.svg" alt />
                  </a>
                  <div className="xl:hidden">
                    <button className="navbar-burger text-gray-400 hover:text-gray-300 focus:outline-none">
                      <svg
                        width={20}
                        height={12}
                        viewBox="0 0 20 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Mobile menu</title>
                        <path
                          d="M1 2H19C19.2652 2 19.5196 1.89464 19.7071 1.70711C19.8946 1.51957 20 1.26522 20 1C20 0.734784 19.8946 0.48043 19.7071 0.292893C19.5196 0.105357 19.2652 0 19 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1C0 1.26522 0.105357 1.51957 0.292893 1.70711C0.48043 1.89464 0.734784 2 1 2ZM19 10H1C0.734784 10 0.48043 10.1054 0.292893 10.2929C0.105357 10.4804 0 10.7348 0 11C0 11.2652 0.105357 11.5196 0.292893 11.7071C0.48043 11.8946 0.734784 12 1 12H19C19.2652 12 19.5196 11.8946 19.7071 11.7071C19.8946 11.5196 20 11.2652 20 11C20 10.7348 19.8946 10.4804 19.7071 10.2929C19.5196 10.1054 19.2652 10 19 10ZM19 5H1C0.734784 5 0.48043 5.10536 0.292893 5.29289C0.105357 5.48043 0 5.73478 0 6C0 6.26522 0.105357 6.51957 0.292893 6.70711C0.48043 6.89464 0.734784 7 1 7H19C19.2652 7 19.5196 6.89464 19.7071 6.70711C19.8946 6.51957 20 6.26522 20 6C20 5.73478 19.8946 5.48043 19.7071 5.29289C19.5196 5.10536 19.2652 5 19 5Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </nav>
            <div className="hidden lg:block navbar-menu relative z-50">
              <div className="lg:hidden navbar-backdrop fixed top-0 left-0 w-full h-full bg-gray-800 opacity-50" />
            </div>
            <div className="mx-auto lg:ml-80" />
          </div>
          <section className="py-3 lg:ml-80">
            <div className="container px-4 mx-auto">
              <div className="p-8 rounded-xl mx-auto lg:ml-24 bg-gray-50">
                <div className="flex flex-wrap items-center justify-between -mx-4 mb-8 pb-6 border-b border-gray-400 border-opacity-20">
                  <div className="w-full sm:w-auto px-4 mb-6 sm:mb-0">
                    <h4 className="text-2xl font-bold tracking-wide mb-1">
                      Profile
                    </h4>
                    <p className="text-sm text-gray-300">
                      Edit your profile here
                    </p>
                  </div>
                  <div className="w-full sm:w-auto px-4">
                    <div>
                      <Link
                        to={`/profile/${session.user_id}`}
                        className="inline-block py-2 px-4 mr-3 text-xs text-center font-semibold leading-normal text-gray-400 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-200"
                      >
                        Cancel
                      </Link>
                      <a
                        className="inline-block py-2 px-4 text-xs text-center font-semibold leading-normal rounded-lg transition duration-200 hover:bg-gray-800"
                        href={`/profile/${session.user_id}`}
                        onClick={handleSave} // Add the event handler
                      >
                        Save
                      </a>
                    </div>
                  </div>
                </div>
                <form action>
                  <div className="flex flex-wrap items-center -mx-4 pb-8 mb-8 border-b border-gray-400 border-opacity-20">
                    <div className="w-full sm:w-1/3 px-4 mb-4 sm:mb-0">
                      <span className="text-sm font-medium">Name</span>
                    </div>
                    <div className="w-full sm:w-2/3 px-4">
                      <div className="max-w-xl">
                        <div className="flex flex-wrap items-center -mx-3">
                          <div className="w-full sm:w-1/2 px-3 mb-3 sm:mb-0">
                            <input
                              className="block py-4 px-3 w-full text-sm font-medium outline-none bg-transparent border border-gray-400 hover:border-white focus:border-green-500 rounded-lg"
                              id="first_name"
                              type="text"
                              value={profileUser.first_name}
                              onChange={updateProfileUser}
                            />
                          </div>
                          <div className="w-full sm:w-1/2 px-3">
                            <input
                              className="block py-4 px-3 w-full text-sm font-medium outline-none bg-transparent border border-gray-400 hover:border-white focus:border-green-500 rounded-lg"
                              id="last_name"
                              type="text"
                              value={profileUser.last_name}
                              onChange={updateProfileUser}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center -mx-4 pb-8 mb-8 border-b border-gray-400 border-opacity-20">
                    <div className="w-full sm:w-1/3 px-4 mb-4 sm:mb-0">
                      <span className="text-sm font-medium">Username</span>
                    </div>
                    <div className="w-full sm:w-2/3 px-4">
                      <div className="max-w-xl">
                        <input
                          className="block py-4 px-3 w-full text-sm font-medium outline-none bg-transparent border border-gray-400 hover:border-white focus:border-green-500 rounded-lg"
                          id="username"
                          type="text"
                          value={profileUser.username}
                          onChange={updateProfileUser}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-start -mx-4 pb-8 mb-8 border-b border-gray-400 border-opacity-20">
                    <div className="w-full sm:w-1/3 px-4 mb-6 sm:mb-0">
                      <span className="block text-sm font-medium">Photo</span>
                      <span className="text-xs">Profile Photo</span>
                    </div>
                    <div className="w-full sm:w-2/3 px-4">
                      <div className="flex flex-wrap sm:flex-nowrap max-w-xl">
                        <div className="flex-shrink-0 w-20 h-20 mb-4 mr-4 rounded-full">
                          <img src={profileUser.profile_pic} alt="Uploaded" />
                        </div>
                        <div className="w-full py-8 px-4 text-center border-dashed border border-gray-400 hover:border-white focus:border-green-500 rounded-lg">
                          <div className="relative group h-14 w-14 mx-auto mb-4">
                            <div className="flex items-center justify-center h-14 w-14 bg-blue-500 rounded-full group-hover:bg-gray-800">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.71 5.71002L9 3.41002V13C9 13.2652 9.10536 13.5196 9.29289 13.7071C9.48043 13.8947 9.73478 14 10 14C10.2652 14 10.5196 13.8947 10.7071 13.7071C10.8946 13.5196 11 13.2652 11 13V3.41002L13.29 5.71002C13.383 5.80375 13.4936 5.87814 13.6154 5.92891C13.7373 5.97968 13.868 6.00582 14 6.00582C14.132 6.00582 14.2627 5.97968 14.3846 5.92891C14.5064 5.87814 14.617 5.80375 14.71 5.71002C14.8037 5.61706 14.8781 5.50645 14.9289 5.3846C14.9797 5.26274 15.0058 5.13203 15.0058 5.00002C15.0058 4.86801 14.9797 4.7373 14.9289 4.61544C14.8781 4.49358 14.8037 4.38298 14.71 4.29002L10.71 0.290018C10.6149 0.198978 10.5028 0.127613 10.38 0.0800184C10.1365 -0.0199996 9.86346 -0.0199996 9.62 0.0800184C9.49725 0.127613 9.3851 0.198978 9.29 0.290018L5.29 4.29002C5.19676 4.38326 5.1228 4.49395 5.07234 4.61577C5.02188 4.73759 4.99591 4.86816 4.99591 5.00002C4.99591 5.13188 5.02188 5.26245 5.07234 5.38427C5.1228 5.50609 5.19676 5.61678 5.29 5.71002C5.38324 5.80326 5.49393 5.87722 5.61575 5.92768C5.73757 5.97814 5.86814 6.00411 6 6.00411C6.13186 6.00411 6.26243 5.97814 6.38425 5.92768C6.50607 5.87722 6.61676 5.80326 6.71 5.71002ZM19 10C18.7348 10 18.4804 10.1054 18.2929 10.2929C18.1054 10.4804 18 10.7348 18 11V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8947 17.2652 18 17 18H3C2.73478 18 2.48043 17.8947 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V11C2 10.7348 1.89464 10.4804 1.70711 10.2929C1.51957 10.1054 1.26522 10 1 10C0.734784 10 0.48043 10.1054 0.292893 10.2929C0.105357 10.4804 0 10.7348 0 11V17C0 17.7957 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7957 20 17V11C20 10.7348 19.8946 10.4804 19.7071 10.2929C19.5196 10.1054 19.2652 10 19 10Z"
                                  fill="#E8EDFF"
                                ></path>
                              </svg>
                            </div>
                            <input
                              className="absolute top-0 left-0 h-14 w-14 opacity-0 hover:bg-gray-800"
                              id="profile_pic"
                              type="file"
                              name="profile_pic"
                              onChange={handleFileChange}
                            />
                          </div>
                          <p className="font-semibold leading-normal mb-1">
                            <span>Click to upload a file</span>
                            <span className="text-gray-300">
                              {" "}
                              or drag and drop
                            </span>
                          </p>
                          <span className="text-xs text-gray-300 font-semibold">
                            PNG, JPG, GIF or up to 10MB
                          </span>
                          <br />
                          <button
                            className="bg-blue-500 hover:bg-gray-800 font-bold py-2 px-4 rounded mt-4"
                            onClick={handleUploadedImage}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start -mx-4 pb-8 mb-8 border-b border-gray-400 border-opacity-20">
                    <div className="w-full sm:w-1/3 px-4 mb-5 sm:mb-0">
                      <span className="block mt-2 text-sm font-medium">
                        About Me
                      </span>
                      <span className="text-xs text-gray-400">
                        Write a little about yourself
                      </span>
                    </div>
                    <div className="w-full sm:w-2/3 px-4">
                      <div className="max-w-xl">
                        <textarea
                          className="block h-56 py-4 px-3 w-full text-sm value-gray-50 font-medium outline-none bg-transparent border border-gray-400 hover:border-white focus:border-green-500 rounded-lg resize-none"
                          id="about_me"
                          type="text"
                          value={profileUser.about_me} // Set the value to the aboutMe state
                          onChange={updateProfileUser} // Add the event handler
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
