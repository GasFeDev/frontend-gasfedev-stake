import { ConnectButton } from "@rainbow-me/rainbowkit";
import "../ConnectButton/ConnectButtonCustom.css";
import stETH from "../Assets/stETH.png";
import stMATIC from "../Assets/stMATIC.png";

export const ConnectIcon = () => {
  return (
    <ConnectButton.Custom>
      {({ chain }) => {
        const ready = chain !== undefined && !chain.loading;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
            })}
          >
            {chain?.name === "Ethereum" && (
              <img
                alt={chain.name ?? "Chain icon"}
                src={stETH}
                value="stETH"
                className="connect-iconEth"
              />
            )}
            {chain?.name === "Polygon" && (
              <img
                alt={chain.name ?? "Chain icon"}
                src={stMATIC}
                value="stMATIC"
                className="connect-iconMatic"
              />
            )}
            {chain?.name === "Goerli" && (
              <img
                alt={chain.name ?? "Chain icon"}
                src={stETH}
                className="connect-iconEth"
              />
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
