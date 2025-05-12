import erc20Abi from "./abis/erc20.json";
import ownableAbi from "./abis/ownable.json";
import adventuresepoliaAbi from "./abis/adventuresepolia.json";
import adventureAbi from "./abis/adventureabi.json";
import L1BridgeAbi from "./abis/L1Bridge.json";

const abis = {
  erc20: erc20Abi,
  ownable: ownableAbi,
  // adventureSepolia: adventuresepoliaAbi,
  // adventureL2: adventureAbi,
  adventureBridge: adventureAbi,
  L1Bridge: L1BridgeAbi,
};

export default abis;
