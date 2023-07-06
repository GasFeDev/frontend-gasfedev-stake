import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./StyleButton.css";

const StyleButton = ({ size, onConnect }) => {
  return (
    <ConnectButton
      showBalance={false}
      size={size}
      onClick={onConnect}
      className="custom-connect-button"
    />
  );
};

export default StyleButton;
