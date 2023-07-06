import { ethers } from "ethers";
import Swal from "sweetalert2";
import { Contracts, CreateSwalProps, CreateSwalPropsIspo, CreateSwalPropsError } from "../Utils/index";


const UnstakeTokens = async (
  _amount, 
  signer, 
  network, 
  setBalance, 
  setFormBalance, 
  setSelectedOption, 
  setSelectedToken, 
  setIsConnected, 
  selectedToken) => {
    
  const { ispoContract, ispoABI } = Contracts[network];    

  const refreshPage = async () => {
    setFormBalance({
      amount: 0,
      value: "",
      balance: "Loading...",
    });
    setBalance("0");    
    setSelectedOption("Stake");
    setSelectedToken("Select token");
    setIsConnected(false);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const isPolygonSelected = selectedToken === "stMATIC";

    if (isPolygonSelected) {
      setSelectedToken("stMATIC");
    } else if (!isPolygonSelected) {
      setSelectedToken(localStorage.getItem("selectedToken") || "stETH");
    }
  };
  
  if (_amount <= 0) {
    return Swal.fire(
      CreateSwalProps(
        "Observation",
        `The amount to stake must be greater than 0.`
      )
    );
  } else if (!/^([1-9]\d*|0)\.\d+$|^([1-9]\d*|0)$/.test(_amount)) {
    return Swal.fire(
      CreateSwalProps("Observation", `Please enter a valid number.`)
    );
  }

  try {
    const degaISPO = new ethers.Contract(ispoContract, ispoABI.abi, signer);
    Swal.fire(
      CreateSwalPropsIspo(
        "Confirmation",
        "Confirm your transaction in your wallet and wait for the blockchain confirmation. This may take a few seconds. Do not close the web app.",
        "OK"
      ),
      "error"
    );
    const txm = await degaISPO.withdraw(
      ethers.utils.parseEther(_amount.toString())
    );
    Swal.fire(
      CreateSwalPropsIspo(
        "Waiting for confirmation",
        "The transaction is pending confirmation in the blockchain.",
        "OK"
      ),
      "error"
    );

    await txm.wait();
    Swal.fire(
      CreateSwalPropsIspo(
        "Completed",
        "The transaction has been processed successfully and saved.",
        "OK"
      ),
      "error"
    ).then(() => {
        refreshPage();
    });
    return;
  } catch (error) {
    const errorMessage = error.message.match(/reason="([^"]+)"/);
    const reason = errorMessage ? errorMessage[1] : "execution reverted";
    Swal.fire(CreateSwalPropsError("Tx Reject", reason, "OK"), "error");
  }
};

export default UnstakeTokens;
