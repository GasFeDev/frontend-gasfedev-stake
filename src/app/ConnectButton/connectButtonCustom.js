import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./ConnectButtonCustom.css";
import MoreVertSVG from "../Assets/moreVert.svg";

export const ConnectButtonCustom = () => {
  return (
    <ConnectButton.Custom>
      {({ chain, openChainModal }) => {
        const ready = chain !== undefined && !chain.loading;
        const unsupported = ready && chain.unsupported;
        //const isConnected = chain?.name !== undefined;
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
            })}
          >
            {unsupported ? (
              <><img src={MoreVertSVG} alt="Icono más" className="more-vert" /><button
                className="connect-button-unsupported"
                onClick={openChainModal}
                type="button"
              >
                Invalid Network
              </button></>
            ) : (
              <button
                className="connect-button-supported"
                onClick={openChainModal}
                type="button"
              >
                {"Goerli"}
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
