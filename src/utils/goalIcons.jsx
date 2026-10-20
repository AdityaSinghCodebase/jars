import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import FlightIcon from "@mui/icons-material/Flight";
import HomeIcon from "@mui/icons-material/Home";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import SchoolIcon from "@mui/icons-material/School";
import FlagIcon from "@mui/icons-material/Flag";

const goalIcons = {
  bike: DirectionsBikeIcon,
  travel: FlightIcon,
  home: HomeIcon,
  phone: SmartphoneIcon,
  education: SchoolIcon,
  other: FlagIcon,
};

export function getGoalIcon(iconKey) {
  return goalIcons[iconKey] || FlagIcon;
}

export default goalIcons;
