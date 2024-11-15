export const ERC721_ABI = [
  {
    type: 'function',
    name: 'is_approved_for_all',
    inputs: [
      {
        name: 'account',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        name: 'account',
        type: 'core::starknet::contract_address::ContractAddress',
      },
    ],
    outputs: [
      {
        type: 'core::integer::bool',
      },
    ],
    state_mutability: 'view',
  },
] as const
