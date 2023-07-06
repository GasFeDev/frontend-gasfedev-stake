import { ethers } from "ethers";
import Swal from "sweetalert2";
import { Contracts, CreateSwalProps, CreateSwalPropsIspo, CreateSwalPropsError } from "../Utils/index";


const StakeTokens = async (  
  _amount,
  account, 
  signer, 
  network, 
  setBalance, 
  setFormBalance, 
  setSelectedOption, 
  setSelectedToken, 
  setIsConnected, 
  selectedToken) => {  

  let selectedTokenLabel = "";
  if (selectedToken === "stETH") {
    selectedTokenLabel = "stETH";
  } else if (selectedToken === "stMATIC") {
    selectedTokenLabel = "stMATIC";
  }
  
  const { ispoContract, ispoABI, stContract, stABI } = Contracts[network];  

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
    const st = new ethers.Contract(stContract, stABI.abi, signer);
    console.log("stContract", stContract);
    const balance = await st.balanceOf(account.address);
    console.log("balance", balance);
    setBalance(ethers.utils.formatEther(balance.toString()));

    const ispo = new ethers.Contract(ispoContract, ispoABI.abi, signer);
    const approved = await st.allowance(account.address, ispo.address);

    const amountToSpend = ethers.utils.parseEther(_amount.toString());
    if (approved.gte(amountToSpend) && balance.gt(0)) {
      Swal.fire(
        CreateSwalPropsIspo(
          "Confirmation",
          "Confirm your transaction in your wallet and wait for the blockchain confirmation. This may take a few seconds. Do not close the web app.",
          "OK"
        ),
        "error"
      );
      const tx = await ispo.deposit(
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
      await tx.wait();
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
    } else {
      try {
        const balance = await st.balanceOf(account.address);

        if (balance.toString() === "0") {
          return Swal.fire(
            CreateSwalProps(
              "Observation",
              "You do not have a balance of tokens in your account"
            )
          );
        } else {
          try {
            const tokensToApprove = ethers.utils.parseEther(
              _amount.toString()
            );
            Swal.fire(
              CreateSwalPropsIspo(
                "Approval",
                `Approve the spending of your ${selectedTokenLabel} in your wallet and wait for confirmation from the blockchain. This may take a few seconds. Do not close the web application.`,
                "OK"
              ),
              "error"
            );
            const txa = await st.approve(ispo.address, tokensToApprove);
            Swal.fire(
              CreateSwalPropsIspo(
                "Waiting for confirmation",
                "The Approval is pending confirmation in the blockchain.",
                "OK"
              ),
              "error"
            );
            await txa.wait().then(async () => {
              Swal.fire(
                CreateSwalPropsIspo(
                  "Confirmation",
                  "Confirm your transaction in your wallet and wait for the blockchain confirmation. This may take a few seconds. Do not close the web app.",
                  "OK"
                ),
                "error"
              );
              const txm = await ispo.deposit(
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
            });
          } catch (error) {
            return Swal.fire(
              CreateSwalProps(
                "Uncompleted",
                "The transaction could not be completed."
              )
            );
          }
        }
      } catch (error) {
        const errorMessage = error.message.match(/reason="([^"]+)"/);
        const reason = errorMessage ? errorMessage[1] : "execution reverted";
        Swal.fire(CreateSwalPropsError("Tx Reject", reason, "OK"), "error");
      }
    }
  } catch (error) {
    const errorMessage = error.message.match(/reason="([^"]+)"/);
    const reason = errorMessage ? errorMessage[1] : "execution reverted";
    Swal.fire(CreateSwalPropsError("Tx Reject", reason, "OK"), "error");
  };
  
};

export default StakeTokens;
