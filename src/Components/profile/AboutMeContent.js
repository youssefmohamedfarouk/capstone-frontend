import React from 'react'


function AboutMeContent({currentUser}) {
  return (
    <div className="p-8 bg-gray-50 rounded-xl">  
        <div className="pb-6 mb-8 border-b border-gray-400">
    <h3 className="text-lg font-semibold mb-6">About Me</h3>
    <p className="leading-normal font-medium mb-4">
      {currentUser.about_me}
    </p>
  </div>

  <div>
    <h3 className="text-lg font-semibold mb-6">
      Pinned Interests
    </h3>
    <div className="-mb-3">
      <span className="inline-block py-2 px-4 mb-3 mr-3 leading-6 rounded-full bg-gray-200">
        Anime
      </span>
      <span className="inline-block py-2 px-4 mb-3 mr-3 leading-6 rounded-full bg-gray-200">
        Gaming
      </span>
      <span className="inline-block py-2 px-4 mb-3 leading-6 rounded-full bg-gray-200">
        Movies
      </span>
    </div>
  </div></div>
  )
}

export default AboutMeContent