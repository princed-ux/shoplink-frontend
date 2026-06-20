import MinimalTheme       from './themes/MinimalTheme';
import DarkTheme          from './themes/DarkTheme';
import GradientTheme      from './themes/GradientTheme';
import BubblesTheme       from './themes/BubblesTheme';
import AuroraTheme        from './themes/AuroraTheme';
import NeonTheme          from './themes/NeonTheme';
import SunsetTheme        from './themes/SunsetTheme';
import OceanTheme         from './themes/OceanTheme';
import CandyTheme         from './themes/CandyTheme';
import MidnightTheme      from './themes/MidnightTheme';
import ForestTheme        from './themes/ForestTheme';
import LavenderTheme      from './themes/LavenderTheme';
import RoyalTheme         from './themes/RoyalTheme';
import DiamondTheme       from './themes/DiamondTheme';
import CustomTheme        from './themes/CustomTheme';
import GalaxyTheme        from './themes/GalaxyTheme';
import CyberCityTheme     from './themes/CyberCityTheme';
import GoldenEmpireTheme  from './themes/GoldenEmpireTheme';
import ArcticCrystalTheme from './themes/ArcticCrystalTheme';
import VolcanoTheme       from './themes/VolcanoTheme';
import LuxuryBlackTheme   from './themes/LuxuryBlackTheme';

export default function ThemeBackground({ theme, bgUrl }) {
  switch (theme) {
    case 'minimal':        return <MinimalTheme />;
    case 'dark':           return <DarkTheme />;
    case 'gradient':       return <GradientTheme />;
    case 'bubbles':        return <BubblesTheme />;
    case 'aurora':         return <AuroraTheme />;
    case 'neon':           return <NeonTheme />;
    case 'sunset':         return <SunsetTheme />;
    case 'ocean':          return <OceanTheme />;
    case 'candy':          return <CandyTheme />;
    case 'midnight':       return <MidnightTheme />;
    case 'forest':         return <ForestTheme />;
    case 'lavender':       return <LavenderTheme />;
    case 'royal':          return <RoyalTheme />;
    case 'diamond':        return <DiamondTheme />;
    case 'galaxy':         return <GalaxyTheme />;
    case 'cybercity':      return <CyberCityTheme />;
    case 'goldenempire':   return <GoldenEmpireTheme />;
    case 'arcticcrystal':  return <ArcticCrystalTheme />;
    case 'volcano':        return <VolcanoTheme />;
    case 'luxuryblack':    return <LuxuryBlackTheme />;
    case 'custom':         return <CustomTheme bgUrl={bgUrl} />;
    default:               return <MinimalTheme />;
  }
}
