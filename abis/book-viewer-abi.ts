export const BOOK_VIEWER_ABI = [
  {
    type: 'impl',
    name: 'BookViewerImpl',
    interface_name: 'clober_cairo::interfaces::book_viewer::IBookViewer',
  },
  {
    type: 'struct',
    name: 'clober_cairo::interfaces::book_viewer::Liquidity',
    members: [
      { name: 'tick', type: 'core::integer::i32' },
      { name: 'depth', type: 'core::integer::u64' },
    ],
  },
  {
    type: 'struct',
    name: 'core::array::Span::<clober_cairo::interfaces::book_viewer::Liquidity>',
    members: [
      {
        name: 'snapshot',
        type: '@core::array::Array::<clober_cairo::interfaces::book_viewer::Liquidity>',
      },
    ],
  },
  {
    type: 'struct',
    name: 'core::integer::u256',
    members: [
      { name: 'low', type: 'core::integer::u128' },
      { name: 'high', type: 'core::integer::u128' },
    ],
  },
  {
    type: 'struct',
    name: 'core::array::Span::<core::felt252>',
    members: [
      { name: 'snapshot', type: '@core::array::Array::<core::felt252>' },
    ],
  },
  {
    type: 'interface',
    name: 'clober_cairo::interfaces::book_viewer::IBookViewer',
    items: [
      {
        type: 'function',
        name: 'book_manager',
        inputs: [],
        outputs: [
          { type: 'core::starknet::contract_address::ContractAddress' },
        ],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'get_liquidity',
        inputs: [
          { name: 'book_id', type: 'core::felt252' },
          { name: 'tick', type: 'core::integer::i32' },
          { name: 'n', type: 'core::integer::u32' },
        ],
        outputs: [
          {
            type: 'core::array::Span::<clober_cairo::interfaces::book_viewer::Liquidity>',
          },
        ],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'get_expected_input',
        inputs: [
          { name: 'book_id', type: 'core::felt252' },
          { name: 'limit_price', type: 'core::integer::u256' },
          { name: 'quote_amount', type: 'core::integer::u256' },
          { name: 'max_base_amount', type: 'core::integer::u256' },
          { name: 'hook_data', type: 'core::array::Span::<core::felt252>' },
        ],
        outputs: [{ type: '(core::integer::u256, core::integer::u256)' }],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'get_expected_output',
        inputs: [
          { name: 'book_id', type: 'core::felt252' },
          { name: 'limit_price', type: 'core::integer::u256' },
          { name: 'base_amount', type: 'core::integer::u256' },
          { name: 'min_quote_amount', type: 'core::integer::u256' },
          { name: 'hook_data', type: 'core::array::Span::<core::felt252>' },
        ],
        outputs: [{ type: '(core::integer::u256, core::integer::u256)' }],
        state_mutability: 'view',
      },
    ],
  },
  {
    type: 'impl',
    name: 'UpgradeableImpl',
    interface_name: 'openzeppelin_upgrades::interface::IUpgradeable',
  },
  {
    type: 'interface',
    name: 'openzeppelin_upgrades::interface::IUpgradeable',
    items: [
      {
        type: 'function',
        name: 'upgrade',
        inputs: [
          {
            name: 'new_class_hash',
            type: 'core::starknet::class_hash::ClassHash',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
    ],
  },
  {
    type: 'impl',
    name: 'OwnableTwoStepMixinImpl',
    interface_name:
      'openzeppelin_access::ownable::interface::OwnableTwoStepABI',
  },
  {
    type: 'interface',
    name: 'openzeppelin_access::ownable::interface::OwnableTwoStepABI',
    items: [
      {
        type: 'function',
        name: 'owner',
        inputs: [],
        outputs: [
          { type: 'core::starknet::contract_address::ContractAddress' },
        ],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'pending_owner',
        inputs: [],
        outputs: [
          { type: 'core::starknet::contract_address::ContractAddress' },
        ],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'accept_ownership',
        inputs: [],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'transfer_ownership',
        inputs: [
          {
            name: 'new_owner',
            type: 'core::starknet::contract_address::ContractAddress',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'renounce_ownership',
        inputs: [],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'pendingOwner',
        inputs: [],
        outputs: [
          { type: 'core::starknet::contract_address::ContractAddress' },
        ],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'acceptOwnership',
        inputs: [],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'transferOwnership',
        inputs: [
          {
            name: 'newOwner',
            type: 'core::starknet::contract_address::ContractAddress',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'renounceOwnership',
        inputs: [],
        outputs: [],
        state_mutability: 'external',
      },
    ],
  },
  {
    type: 'constructor',
    name: 'constructor',
    inputs: [
      {
        name: 'book_manager',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        name: 'owner',
        type: 'core::starknet::contract_address::ContractAddress',
      },
    ],
  },
  {
    type: 'event',
    name: 'openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred',
    kind: 'struct',
    members: [
      {
        name: 'previous_owner',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'key',
      },
      {
        name: 'new_owner',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'key',
      },
    ],
  },
  {
    type: 'event',
    name: 'openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted',
    kind: 'struct',
    members: [
      {
        name: 'previous_owner',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'key',
      },
      {
        name: 'new_owner',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'key',
      },
    ],
  },
  {
    type: 'event',
    name: 'openzeppelin_access::ownable::ownable::OwnableComponent::Event',
    kind: 'enum',
    variants: [
      {
        name: 'OwnershipTransferred',
        type: 'openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred',
        kind: 'nested',
      },
      {
        name: 'OwnershipTransferStarted',
        type: 'openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted',
        kind: 'nested',
      },
    ],
  },
  {
    type: 'event',
    name: 'openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded',
    kind: 'struct',
    members: [
      {
        name: 'class_hash',
        type: 'core::starknet::class_hash::ClassHash',
        kind: 'data',
      },
    ],
  },
  {
    type: 'event',
    name: 'openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event',
    kind: 'enum',
    variants: [
      {
        name: 'Upgraded',
        type: 'openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded',
        kind: 'nested',
      },
    ],
  },
  {
    type: 'event',
    name: 'clober_cairo::book_viewer::BookViewer::Event',
    kind: 'enum',
    variants: [
      {
        name: 'OwnableEvent',
        type: 'openzeppelin_access::ownable::ownable::OwnableComponent::Event',
        kind: 'flat',
      },
      {
        name: 'UpgradeableEvent',
        type: 'openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event',
        kind: 'flat',
      },
    ],
  },
] as const
