export const ERC20_ABI = [
  {
    type: 'function',
    name: 'balance_of',
    inputs: [
      {
        name: 'account',
        type: 'core::starknet::contract_address::ContractAddress',
      },
    ],
    outputs: [
      {
        type: 'core::integer::u256',
      },
    ],
    state_mutability: 'view',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      {
        name: 'owner',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        name: 'spender',
        type: 'core::starknet::contract_address::ContractAddress',
      },
    ],
    outputs: [
      {
        type: 'core::integer::u256',
      },
    ],
    state_mutability: 'view',
  },
] as const
