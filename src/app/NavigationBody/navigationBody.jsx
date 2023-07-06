import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  InputGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navigationBody.css";
import { ethers } from "ethers";
import { useAccount, useSigner } from "wagmi";
import Swal from "sweetalert2";
import { Contracts, CreateSwalProps } from "../Utils/index";
import { StakeTokens, UnstakeTokens } from "../Ispo/index";

const NavigationBody = () => {
  const [formBalance, setFormBalance] = useState({
    amount: 0,
    value: "",
    balance: "0",
  });
  const [balance, setBalance] = useState("0");
  const [stakedBalance, setStakedBalance] = useState({
    amount: 0,
    value: "",
    staked: 0,
  });
  const [selectedOption, setSelectedOption] = useState("Stake");
  const [selectedToken, setSelectedToken] = useState(
    localStorage.getItem("selectedToken") || "Select token"
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpenToken, setIsMenuOpenToken] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isAmountExceeded, setIsAmountExceeded] = useState(false);

  const { data: signer } = useSigner({});
  const account = useAccount({});

  const handleStake = async (network) => {
    if (!account.isConnected) {
      Swal.fire(CreateSwalProps("Confirmation", "Please connect your wallet."));
      return;
    } else {
      await StakeTokens(
        formBalance.amount,
        account,
        signer,
        network,
        setBalance,
        setFormBalance,
        setSelectedOption,
        setSelectedToken,
        setIsConnected,
        selectedToken,
        showError,
        setShowError,
        formBalance,
        setFormBalance
      );
      console.log(formBalance.amount);
      if (formBalance.amount.length >= 20) {
        setShowError(true);
        return;
      }
    }
  };

  const handleUnstake = async (network) => {
    if (!account.isConnected) {
      Swal.fire(CreateSwalProps("Confirmation", "Please connect your wallet."));
      return;
    } else {
      await UnstakeTokens(
        formBalance.amount,
        signer,
        network,
        setBalance,
        setFormBalance,
        setSelectedOption,
        setSelectedToken,
        setIsConnected,
        selectedToken
      );

      if (formBalance.amount.length >= 20) {
        setShowError(true);
        return;
      }
      console.log(formBalance.amount);
    }
  };

  const handleButtonClick = () => {
    if (!account.isConnected) {
      Swal.fire(CreateSwalProps("Confirmation", "Please connect your wallet."));
      return;
    }
    if (selectedToken !== "stETH" && selectedToken !== "stMATIC") {
      Swal.fire(CreateSwalProps("Observation", "Please select a token."));
      return;
    }

    if (selectedToken === "stETH") {
      if (selectedOption === "Stake") {
        handleStake("ethereum");
      } else if (selectedOption === "Unstake") {
        handleUnstake("ethereum");
      }
    } else if (selectedToken === "stMATIC") {
      if (selectedOption === "Stake") {
        handleStake("polygon");
      } else if (selectedOption === "Unstake") {
        handleUnstake("polygon");
      }
    }
  };

  const handleOptionChange = (event) => {
    const option = event.target.value;
    setSelectedOption(option);
  };

  const handleChange = (e) => {
    if (!account.isConnected) {
      Swal.fire(CreateSwalProps("Confirmation", "Please connect your wallet."));
      return;
    }
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^0-9.]/g, "");

    setFormBalance({
      ...formBalance,
      [e.target.name]: sanitizedValue,
    });

    if (sanitizedValue.length >= 21) {
      setIsAmountExceeded(true);
    } else {
      setIsAmountExceeded(false);
    }
  };

  const handleContainerClick = () => {
    setShowError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const updateBalance = async () => {
    try {
      let stContract, stABI;
      if (selectedToken === "stETH") {
        stContract = Contracts.ethereum.stContract;
        stABI = Contracts.ethereum.stABI;
      } else if (selectedToken === "stMATIC") {
        stContract = Contracts.polygon.stContract;
        stABI = Contracts.polygon.stABI;
      }

      if (stContract && stABI) {
        const st = new ethers.Contract(stContract, stABI.abi, signer);
        const balance = await st.balanceOf(account.address);
        setBalance(ethers.utils.formatEther(balance.toString()));
      }
    } catch (error) {
      console.log(error);
      setBalance("0");
    }
  };

  useEffect(() => {
    updateBalance();
    setIsConnected(account.isConnected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken, account.address, signer, account.isConnected]);

  const updateStakeBalance = async () => {
    try {
      let ispoContract, ispoABI;
      if (selectedToken === "stETH") {
        ispoContract = Contracts.ethereum.ispoContract;
        ispoABI = Contracts.ethereum.ispoABI;
      } else if (selectedToken === "stMATIC") {
        ispoContract = Contracts.polygon.ispoContract;
        ispoABI = Contracts.polygon.ispoABI;
      }
      if (ispoContract && ispoABI) {
        const ispo = new ethers.Contract(ispoContract, ispoABI.abi, signer);
        const stakedBalance = await ispo.getStakedBalance(account.address);
        setStakedBalance(ethers.utils.formatEther(stakedBalance.toString()));
        console.log(
          `Staked Balance in ${selectedToken}: ${stakedBalance.toString()}`
        );
        console.log(
          `Staked Balance in ${selectedToken} (formatted): ${ethers.utils.formatEther(
            stakedBalance.toString()
          )}`
        );
      }
    } catch (error) {
      console.log(error);
      setStakedBalance("0");
    }
  };

  useEffect(() => {
    updateStakeBalance();
    setIsConnected(account.isConnected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken, account.address, signer, account.isConnected]);

  useEffect(() => {
    if (!isConnected) {
      setSelectedToken("-");
    }
  }, [isConnected]);

  useEffect(() => {
    setFormBalance((prevFormBalance) => ({
      ...prevFormBalance,
      amount: 0,
    }));
  }, [selectedOption, selectedToken]);

  return (
    <>
      <Container className="d-flex flex-column justify-content-center container-border">
        <h1 className="my-0">ISPO</h1>
        <h4 className="my-0">
          Select the amount you want to stake and participate for rewards
        </h4>
        <Form.Group controlId="networkSelect" className="mb-4">
          <Form.Label className="w-100">Network</Form.Label>
          <div className="select-network">Ethereum Mainnet</div>
        </Form.Group>
        <Form.Group controlId="actionSelect" className="mb-4">
          <Form.Label>I want to</Form.Label>
          <DropdownButton
            className={`form-input custom-dropdown ${
              isMenuOpen ? "menu-open" : ""
            }`}
            disabled={!isConnected}
            title={selectedOption}
            onSelect={(eventKey) => setSelectedOption(eventKey)}
            onChange={handleOptionChange}
            onToggle={(isOpen) => setIsMenuOpen(isOpen)}
          >
            <Dropdown.Item eventKey="Stake">Stake</Dropdown.Item>
            <Dropdown.Item eventKey="Unstake">Unstake</Dropdown.Item>
          </DropdownButton>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Select Token</Form.Label>
          <DropdownButton
            className={`form-selectToken custom-dropdown ${
              isMenuOpenToken ? "menu-open" : ""
            }`}
            onSelect={(selectedValue) => setSelectedToken(selectedValue)}
            onToggle={(isOpen) => setIsMenuOpenToken(isOpen)}
            disabled={!isConnected}
            title={!isConnected ? "-" : selectedToken}
          >
            {!isConnected && (
              <Dropdown.Item
                eventKey="selectToken"
                className="not-connected-item"
              >
                Select token
              </Dropdown.Item>
            )}
            <Dropdown.Item eventKey="stETH">stETH</Dropdown.Item>
            <Dropdown.Item eventKey="stMATIC">stMATIC</Dropdown.Item>
          </DropdownButton>
        </Form.Group>
        <Form.Group controlId="balanceInput" className="mb-4">
          <Form.Label>Your Balance</Form.Label>
          <InputGroup className="form-input">
            <Form.Control
              type="number"
              className="form-input no-spinner no-background"
              value={balance || ""}
              readOnly
            />
            <InputGroup.Text className="form-token">
              <Form.Control
                as="select"
                className="form-control select-token"
                onChange={(e) => setSelectedToken(e.target.value)}
                value={selectedToken}
                disabled
              >
                {!isConnected && (
                  <option value="selectToken">Select token</option>
                )}
                <option value="selectToken" disabled>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Token
                </option>
                <option value="stETH">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stETH
                </option>
                <option value="stMATIC">&nbsp;&nbsp;&nbsp;&nbsp;stMATIC</option>
              </Form.Control>
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <form onSubmit={handleSubmit}>
          <Form.Group
            controlId="amountInput"
            className="mb-4"
            onClick={handleContainerClick}
          >
            <Form.Label>
              {selectedOption === "Stake"
                ? "Amount you want to stake"
                : "Amount you want to unstake"}
            </Form.Label>
            <InputGroup className="form-inputAmount">
              <Form.Control
                className="form-inputAmount no-spinner"
                type="text"
                name="amount"
                value={formBalance.amount}
                onChange={handleChange}
                autoComplete="off"
              />
            </InputGroup>
            {isAmountExceeded && (
              <p className="text-danger">
                The amount to bet must not exceed 18 digits.
              </p>
            )}
          </Form.Group>
          <div className="balance-network">
            Total staked balance:{" "}
            <div className="balance-network-total">
              {isNaN(parseFloat(stakedBalance))
                ? "0"
                : parseFloat(stakedBalance)}
            </div>
          </div>
          <Button
            onClick={handleButtonClick}
            variant="primary"
            type="submit"
            className="mt-auto button-stake"
            disabled={isAmountExceeded}
          >
            {selectedOption === "Stake" ? "Stake" : "Unstake"}
          </Button>
        </form>
      </Container>
    </>
  );
};

export default NavigationBody;
