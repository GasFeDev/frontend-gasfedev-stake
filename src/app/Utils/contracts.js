function getEnvironmentVariables() {
  return {
    REACT_APP_ALCHEMY_API_KEY: process.env.REACT_APP_ALCHEMY_API_KEY,
    REACT_APP_PROJECTID_WALLET_CONNECT:
      process.env.REACT_APP_PROJECTID_WALLET_CONNECT,
    REACT_APP_ISPO_CONTRACT_ETH: process.env.REACT_APP_ISPO_CONTRACT_ETH,
    REACT_APP_STETH_CONTRACT: process.env.REACT_APP_STETH_CONTRACT,
    REACT_APP_ISPO_CONTRACT_POLYGON:
      process.env.REACT_APP_ISPO_CONTRACT_POLYGON,
    REACT_APP_STMATIC_CONTRACT: process.env.REACT_APP_STMATIC_CONTRACT,
  };
}

const Contracts = {
  ethereum: {
    ispoContract: getEnvironmentVariables().REACT_APP_ISPO_CONTRACT_ETH,
    ispoABI: require("../ABIs/DegaISPO.json"),
    stContract: getEnvironmentVariables().REACT_APP_STETH_CONTRACT,
    stABI: require("../ABIs/stETH.json"),
  },
  polygon: {
    ispoContract: getEnvironmentVariables().REACT_APP_ISPO_CONTRACT_POLYGON,
    ispoABI: require("../ABIs/DegaISPOPolygon.json"),
    stContract: getEnvironmentVariables().REACT_APP_STMATIC_CONTRACT,
    stABI: require("../ABIs/stMATIC.json"),
  },
};

export default Contracts;
