import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navigationBar.css";
import ImageButton from "../ConnectButton/StyleButton";
import MoreVertSVG from "../Assets/moreVert.svg";

const NavigationBar = ({ isNavigationCollapsed, setIsNavigationCollapsed }) => {
  const handleCollapse = () => {
    setIsNavigationCollapsed(!isNavigationCollapsed);
  };

  return (
    <Navbar variant="dark" expand="lg" className="px-lg-5 nab-border">
      <Navbar.Brand href="#home">
        <div className="d-flex align-items-center"></div>
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        onClick={handleCollapse}
      />
      <Navbar.Collapse
        id="basic-navbar-nav"
        className={isNavigationCollapsed ? "expanded" : ""}
      >
        <Nav className="ml-auto">
          <Nav.Link href="#vaults" className="custom-linkVaults">
            Vaults
          </Nav.Link>
          <Nav.Link href="#info" className="custom-linkInfo">
            Info
          </Nav.Link>
          <img src={MoreVertSVG} alt="Icono más" className="more-vert" />
          <ImageButton onClick={() => console.log("Connected")} />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
