
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient } from 'wagmi';
import { goerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';

interface CustomWindow extends Window {
  env: {
    REACT_APP_ALCHEMY_API_KEY: string;
    REACT_APP_PROJECTID_WALLET_CONNECT: string;
  };
}

declare const window: CustomWindow;


/* const alchemyApiKey = window.env.REACT_APP_ALCHEMY_API_KEY!;
const wallectConnectProjectId = window.env.REACT_APP_PROJECTID_WALLET_CONNECT; */

const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY!;
const wallectConnectProjectId = "d5f62bd5f563583be230f939b64c9e14"

const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [
    alchemyProvider({ apiKey: alchemyApiKey }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'gasfedev-dashboard',
  projectId: `${wallectConnectProjectId}`,
  chains: [goerli],
});

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export { chains, connectors };
