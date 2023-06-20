import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import NightlifeIcon from "@mui/icons-material/Nightlife";
import DiscFullIcon from "@mui/icons-material/DiscFull";
import BrunchDiningIcon from "@mui/icons-material/BrunchDining";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import HikingIcon from "@mui/icons-material/Hiking";
import CelebrationIcon from "@mui/icons-material/Celebration";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";

export default function IconCarousel() {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 10,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 10,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <Carousel
      className="h-20 child:hover:scale-125 bg-orange-500 rounded-md"
      responsive={responsive}
      centerMode={true}
      emulateTouch={true}
      swipeable={true}
      draggable={true}
      showDots={false}
      focusOnSelect={false}
      ssr={true} // means to render carousel on server-side.
      infinite={true}
      autoPlay={false}
      autoPlaySpeed={1000}
      keyBoardControl={true}
      customTransition="all .5"
      transitionDuration={500}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      arrows={false}
      //   partialVisbile={true}
    >
      <div>
        <FitnessCenterIcon
          style={{ color: "rgb(255 255 255)" }}
          className="flex items-center justify-center hover:scale-125 cursor-pointer"
          data-te-toggle="tooltip"
          data-te-placement="bottom"
          data-te-ripple-init
          data-te-ripple-color="light"
          title="Tooltip on top"
        />
        <span
          class="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
        >
          Tooltip
        </span>
      </div>

      <DirectionsBikeIcon
        style={{ color: "rgb(255 255 255)" }}
        className="flex items-center justify-center hover:scale-125 cursor-pointer"
      />
      <HikingIcon
        style={{ color: "rgb(255 255 255)" }}
        className="flex items-center justify-center hover:scale-125 cursor-pointer"
      />
      <CelebrationIcon
        style={{ color: "rgb(255 255 255)" }}
        className="flex items-center justify-center hover:scale-125 cursor-pointer"
      />
      <NightlifeIcon
        style={{ color: "rgb(255 255 255)" }}
        className="flex items-center justify-center hover:scale-125 cursor-pointer"
      />
      <DiscFullIcon
        style={{ color: "rgb(255 255 255)" }}
        className="flex items-center justify-center hover:scale-125 cursor-pointer"
      />
      <EmojiFoodBeverageIcon
        style={{ color: "rgb(255 255 255)" }}
        className="flex items-center justify-center hover:scale-125 cursor-pointer"
      />
      <FastfoodIcon
        style={{
          color: "rgb(255 255 255)",
          hover: {
            "&:hover": {
              color: "rgb(0 0 0)",
            },
          },
        }}
        className="flex items-center justify-center hover:scale-125 cursor-pointer"
      />
      <BrunchDiningIcon
        style={{ color: "rgb(255 255 255)" }}
        className="flex items-center justify-center hover:scale-125 cursor-pointer"
      />
      <AutoStoriesIcon
        style={{ color: "rgb(255 255 255)" }}
        className="flex items-center justify-center hover:scale-125 cursor-pointer"
      />
      <TheaterComedyIcon
        // style={{ color: "rgb(249 115 22)" }}
        style={{ color: "rgb(255 255 255)" }}
        className="flex items-center justify-center hover:scale-125 shadow-orange-500 cursor-pointer"
      />
    </Carousel>
  );
}
