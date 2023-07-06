const Contracts = {
    ethereum: {
      ispoContract: process.env.REACT_APP_ISPO_CONTRACT_ETH,
      ispoABI: require("../ABIs/DegaISPO.json"),
      stContract: process.env.REACT_APP_STETH_CONTRACT,
      stABI: require("../ABIs/stETH.json"),
    },
    polygon: {
      ispoContract: process.env.REACT_APP_ISPO_CONTRACT_POLYGON,
      ispoABI: require("../ABIs/DegaISPOPolygon.json"),
      stContract: process.env.REACT_APP_STMATIC_CONTRACT,
      stABI: require("../ABIs/stMATIC.json"),
    },
  }; 
  
  export default Contracts;