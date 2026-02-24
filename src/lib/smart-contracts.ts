/**
 * Smart Contract Interfaces — Polygon / Base
 *
 * TypeScript interfaces for on-chain integration.
 * Currently using SHA-256 hash proofs; these interfaces prepare
 * for real smart contract deployment on Polygon or Base L2.
 *
 * Contracts:
 * 1. LumiereFilmToken (ERC-20) — Co-production tokens per film
 * 2. LumiereFilmNFT (ERC-721) — Proof of contribution NFTs
 * 3. LumiereGovernance — On-chain voting for token holders
 * 4. LumierePayments — Automated payment distribution
 */

// ─── Network Configuration ──────────────────────────────────

export type ChainConfig = {
  chainId: number
  name: string
  rpcUrl: string
  explorerUrl: string
  nativeCurrency: { name: string; symbol: string; decimals: number }
}

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  polygon: {
    chainId: 137,
    name: 'Polygon PoS',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  },
  polygon_testnet: {
    chainId: 80002,
    name: 'Polygon Amoy Testnet',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorerUrl: 'https://amoy.polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  },
  base: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  base_testnet: {
    chainId: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia.basescan.org',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
}

export function getActiveChain(): ChainConfig {
  const network = process.env.BLOCKCHAIN_NETWORK || 'polygon_testnet'
  return SUPPORTED_CHAINS[network] || SUPPORTED_CHAINS.polygon_testnet
}

// ─── Contract ABIs (simplified for TypeScript) ──────────────

/**
 * LumiereFilmToken (ERC-20) — Co-production token for a specific film.
 * Each film gets its own ERC-20 token for investment and revenue sharing.
 */
export type FilmTokenContract = {
  // Read
  name: () => Promise<string>
  symbol: () => Promise<string>
  totalSupply: () => Promise<bigint>
  balanceOf: (account: string) => Promise<bigint>
  filmId: () => Promise<string>
  revenuePool: () => Promise<bigint>

  // Write
  mint: (to: string, amount: bigint) => Promise<string> // txHash
  transfer: (to: string, amount: bigint) => Promise<string>
  approve: (spender: string, amount: bigint) => Promise<string>
  distributeRevenue: (amount: bigint) => Promise<string>
  claimDividend: () => Promise<string>
}

export const FILM_TOKEN_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function filmId() view returns (string)',
  'function revenuePool() view returns (uint256)',
  'function mint(address to, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function distributeRevenue(uint256 amount) external',
  'function claimDividend() external',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event DividendDistributed(uint256 amount, uint256 timestamp)',
  'event DividendClaimed(address indexed holder, uint256 amount)',
] as const

/**
 * LumiereFilmNFT (ERC-721) — Proof of contribution.
 * Minted to contributors when their task is validated.
 */
export type FilmNFTContract = {
  // Read
  name: () => Promise<string>
  tokenURI: (tokenId: bigint) => Promise<string>
  ownerOf: (tokenId: bigint) => Promise<string>
  balanceOf: (owner: string) => Promise<bigint>

  // Write
  mintContribution: (
    to: string,
    filmId: string,
    taskId: string,
    taskType: string,
    metadata: string
  ) => Promise<string>
}

export const FILM_NFT_ABI = [
  'function name() view returns (string)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)',
  'function mintContribution(address to, string filmId, string taskId, string taskType, string metadata) returns (uint256)',
  'event ContributionMinted(uint256 indexed tokenId, address indexed contributor, string filmId, string taskId)',
] as const

/**
 * LumiereGovernance — Token-weighted voting for film decisions.
 */
export type GovernanceContract = {
  // Read
  proposalCount: () => Promise<bigint>
  getProposal: (id: bigint) => Promise<{
    title: string
    description: string
    filmId: string
    votesFor: bigint
    votesAgainst: bigint
    deadline: bigint
    executed: boolean
  }>
  hasVoted: (proposalId: bigint, voter: string) => Promise<boolean>

  // Write
  createProposal: (filmId: string, title: string, description: string, duration: bigint) => Promise<string>
  castVote: (proposalId: bigint, support: boolean) => Promise<string>
  executeProposal: (proposalId: bigint) => Promise<string>
}

export const GOVERNANCE_ABI = [
  'function proposalCount() view returns (uint256)',
  'function getProposal(uint256 id) view returns (tuple(string title, string description, string filmId, uint256 votesFor, uint256 votesAgainst, uint256 deadline, bool executed))',
  'function hasVoted(uint256 proposalId, address voter) view returns (bool)',
  'function createProposal(string filmId, string title, string description, uint256 duration) returns (uint256)',
  'function castVote(uint256 proposalId, bool support) external',
  'function executeProposal(uint256 proposalId) external',
  'event ProposalCreated(uint256 indexed id, string filmId, address proposer)',
  'event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)',
  'event ProposalExecuted(uint256 indexed id)',
] as const

/**
 * LumierePayments — Automated payment distribution.
 * Handles escrow, milestone payments, and revenue sharing.
 */
export type PaymentsContract = {
  // Read
  getPaymentStatus: (paymentId: string) => Promise<{ amount: bigint; recipient: string; released: boolean }>
  getEscrowBalance: (filmId: string) => Promise<bigint>

  // Write
  createEscrow: (filmId: string, amount: bigint) => Promise<string>
  releasePayment: (paymentId: string) => Promise<string>
  batchRelease: (paymentIds: string[]) => Promise<string>
}

export const PAYMENTS_ABI = [
  'function getPaymentStatus(string paymentId) view returns (tuple(uint256 amount, address recipient, bool released))',
  'function getEscrowBalance(string filmId) view returns (uint256)',
  'function createEscrow(string filmId) payable returns (bytes32)',
  'function releasePayment(string paymentId) external',
  'function batchRelease(string[] paymentIds) external',
  'event EscrowCreated(bytes32 indexed escrowId, string filmId, uint256 amount)',
  'event PaymentReleased(string paymentId, address indexed recipient, uint256 amount)',
] as const

// ─── Contract Addresses (per chain) ────────────────────────

export type ContractAddresses = {
  filmToken: string | null
  filmNFT: string | null
  governance: string | null
  payments: string | null
}

/**
 * Get deployed contract addresses for the active chain.
 * Returns null for undeployed contracts.
 */
export function getContractAddresses(): ContractAddresses {
  const chain = getActiveChain()

  // Contract addresses will be populated after deployment
  // For now: all null (using hash-based proofs as fallback)
  const addresses: Record<number, ContractAddresses> = {
    137: { // Polygon Mainnet
      filmToken: process.env.CONTRACT_FILM_TOKEN || null,
      filmNFT: process.env.CONTRACT_FILM_NFT || null,
      governance: process.env.CONTRACT_GOVERNANCE || null,
      payments: process.env.CONTRACT_PAYMENTS || null,
    },
    8453: { // Base Mainnet
      filmToken: process.env.CONTRACT_FILM_TOKEN || null,
      filmNFT: process.env.CONTRACT_FILM_NFT || null,
      governance: process.env.CONTRACT_GOVERNANCE || null,
      payments: process.env.CONTRACT_PAYMENTS || null,
    },
  }

  return addresses[chain.chainId] || {
    filmToken: null,
    filmNFT: null,
    governance: null,
    payments: null,
  }
}

// ─── Transaction Helper ────────────────────────────────────

export type PreparedTx = {
  to: string
  data: string
  value: bigint
  chainId: number
  gasLimit?: bigint
}

/**
 * Check if smart contracts are deployed and available.
 */
export function isContractsDeployed(): boolean {
  const addresses = getContractAddresses()
  return Object.values(addresses).some(a => a !== null)
}

/**
 * Get the explorer URL for a transaction hash.
 */
export function getExplorerTxUrl(txHash: string): string {
  const chain = getActiveChain()
  return `${chain.explorerUrl}/tx/${txHash}`
}

/**
 * Get the explorer URL for an address.
 */
export function getExplorerAddressUrl(address: string): string {
  const chain = getActiveChain()
  return `${chain.explorerUrl}/address/${address}`
}
