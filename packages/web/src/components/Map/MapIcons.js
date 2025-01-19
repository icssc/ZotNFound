import L from "leaflet";
import headphone_lost from "../../assets/logos/Headphones_lost.png";
import headphone_found from "../../assets/logos/Headphones_found.png";

import phone_found from "../../assets/logos/Phone_found.png";
import phone_lost from "../../assets/logos/Phone_lost.png";

import wallet_found from "../../assets/logos/Wallet_found.png";
import wallet_lost from "../../assets/logos/Wallet_lost.png";

import key_found from "../../assets/logos/Key_found.png";
import key_lost from "../../assets/logos/Key_lost.png";
import resolved from "../../assets/logos/resolved.png";

import others_lost from "../../assets/logos/Others_lost.png";
import others_found from "../../assets/logos/Others_found.png";
import others_black from "../../assets/logos/others_black.svg";
import others_white from "../../assets/logos/others_white.svg"

import fly_img from "../../assets/images/fly_img.png";

const resolvedIcon = L.icon({
  iconUrl: resolved,
  iconSize: [40, 40],
  iconAnchor: [20, 30],
});

const headphoneLost = L.icon({
  iconUrl: headphone_lost,
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

const headphoneFound = L.icon({
  iconUrl: headphone_found,
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

const phoneLost = L.icon({
  iconUrl: phone_lost,
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

const phoneFound = L.icon({
  iconUrl: phone_found,
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

const keyLost = L.icon({
  iconUrl: key_lost,
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

const keyFound = L.icon({
  iconUrl: key_found,
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

const walletLost = L.icon({
  iconUrl: wallet_lost,
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

const walletFound = L.icon({
  iconUrl: wallet_found,
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

const othersLost = L.icon({
  iconUrl: others_lost,
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

const othersFound = L.icon({
  iconUrl: others_found,
  iconSize: [50, 50],
  iconAnchor: [25, 40],
});

export const othersDragBlack = L.icon({
  iconUrl: others_black,
  iconSize: [40, 40],
  iconAnchor: [25, 25],
});

export const othersDragWhite = L.icon({
  iconUrl: others_white,
  iconSize: [40, 40],
  iconAnchor: [25, 25],
});

export const flyImg = L.icon({
  iconUrl: fly_img,
  iconSize: [0.01, 0.01],
});

export const iconsMap = {
  headphone: {
    true: headphoneLost,
    false: headphoneFound,
  },
  phone: {
    true: phoneLost,
    false: phoneFound,
  },
  wallet: {
    true: walletLost,
    false: walletFound,
  },
  key: {
    true: keyLost,
    false: keyFound,
  },
  others: {
    true: othersLost,
    false: othersFound,
  },
  resolved: {
    true: resolvedIcon,
    false: resolvedIcon,
  },
};

export const createClusterCustomIcon = (cluster, colorMode) => {
  const count = cluster.getChildCount();
  let size;
  
  if (count < 5) size = 'small';
  else if (count < 20) size = 'medium';
  else size = 'large';
  
  // Define color schemes for different count ranges
  const options = {
    light: {
      small: {
        background: 'rgba(255, 255, 255, 0.8)',  // white with opacity
        border: '#4299E1',  // blue.400
        color: '#4299E1'
      },
      medium: {
        background: 'rgba(255, 255, 255, 0.8)',
        border: '#48BB78',  // green.400
        color: '#48BB78'
      },
      large: {
        background: 'rgba(255, 255, 255, 0.8)',
        border: '#F56565',  // red.400
        color: '#F56565'
      }
    },
    dark: {
      small: {
        background: 'rgba(45, 55, 72, 0.8)',  // gray.800 with opacity
        border: '#90CDF4',  // blue.200
        color: '#90CDF4'
      },
      medium: {
        background: 'rgba(45, 55, 72, 0.8)',
        border: '#9AE6B4',  // green.200
        color: '#9AE6B4'
      },
      large: {
        background: 'rgba(45, 55, 72, 0.8)',
        border: '#FEB2B2',  // red.200
        color: '#FEB2B2'
      }
    }
  };

  const mode = colorMode === 'dark' ? 'dark' : 'light';
  const colors = options[mode][size];

  const sizeMap = {
    small: 40,
    medium: 50,
    large: 60
  };

  return L.divIcon({
    html: `<div style="
      background-color: ${colors.background} !important;
      border: 2px solid ${colors.border};
      color: ${colors.color};
      width: ${sizeMap[size]}px;
      height: ${sizeMap[size]}px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-weight: bold;
      font-size: ${size === 'small' ? '14px' : '16px'};
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">${count}</div>`,
    className: `custom-cluster-icon ${mode}-mode`,
    iconSize: L.point(sizeMap[size], sizeMap[size], true)
  });
};
