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
      responsive={responsive}
      //   centerMode={true}
      swipeable={true}
      draggable={false}
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
      // dotListClass="custom-dot-list-style"
      // itemClass="carousel-item-padding-40-px"
    >
      <FitnessCenterIcon
        style={{ color: "rgb(249 115 22)" }}
        className="flex items-center justify-center"
      />
      <DirectionsBikeIcon
        style={{ color: "rgb(249 115 22)" }}
        className="flex items-center justify-center"
      />
      <HikingIcon
        style={{ color: "rgb(249 115 22)" }}
        className="flex items-center justify-center"
      />
      <CelebrationIcon
        style={{ color: "rgb(249 115 22)" }}
        className="flex items-center justify-center"
      />
      <NightlifeIcon
        style={{ color: "rgb(249 115 22)" }}
        className="flex items-center justify-center"
      />
      <DiscFullIcon
        style={{ color: "rgb(249 115 22)" }}
        className="flex items-center justify-center"
      />
      <EmojiFoodBeverageIcon
        style={{ color: "rgb(249 115 22)" }}
        className="flex items-center justify-center"
      />
      <FastfoodIcon
        style={{ color: "rgb(249 115 22)" }}
        className="flex items-center justify-center"
      />
      <BrunchDiningIcon
        style={{ color: "rgb(249 115 22)" }}
        className="flex items-center justify-center"
      />
      <AutoStoriesIcon
        style={{ color: "rgb(249 115 22)" }}
        className="flex items-center justify-center"
      />
      <TheaterComedyIcon
        style={{ color: "rgb(249 115 22)" }}
        className="flex items-center justify-center"
      />
    </Carousel>
  );
}
