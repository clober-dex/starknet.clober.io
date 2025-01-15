export const CONTROLLER_ABI = [
  {
    type: 'impl',
    name: 'ControllerImpl',
    interface_name: 'clober_cairo::interfaces::controller::IController',
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
    type: 'enum',
    name: 'core::bool',
    variants: [
      { name: 'False', type: '()' },
      { name: 'True', type: '()' },
    ],
  },
  {
    type: 'struct',
    name: 'clober_cairo::libraries::fee_policy::FeePolicy',
    members: [
      { name: 'uses_quote', type: 'core::bool' },
      { name: 'rate', type: 'core::integer::i32' },
    ],
  },
  {
    type: 'struct',
    name: 'clober_cairo::libraries::book_key::BookKey',
    members: [
      {
        name: 'base',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        name: 'quote',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        name: 'hooks',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      { name: 'unit_size', type: 'core::integer::u64' },
      {
        name: 'maker_policy',
        type: 'clober_cairo::libraries::fee_policy::FeePolicy',
      },
      {
        name: 'taker_policy',
        type: 'clober_cairo::libraries::fee_policy::FeePolicy',
      },
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
    name: 'clober_cairo::interfaces::controller::IController',
    items: [
      {
        type: 'function',
        name: 'get_depth',
        inputs: [
          { name: 'book_id', type: 'core::felt252' },
          { name: 'tick', type: 'core::integer::i32' },
        ],
        outputs: [{ type: 'core::integer::u64' }],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'get_highest_price',
        inputs: [{ name: 'book_id', type: 'core::felt252' }],
        outputs: [{ type: 'core::integer::u256' }],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'get_order',
        inputs: [{ name: 'order_id', type: 'core::felt252' }],
        outputs: [
          {
            type: '(core::starknet::contract_address::ContractAddress, core::integer::u256, core::integer::u256, core::integer::u256)',
          },
        ],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'from_price',
        inputs: [{ name: 'price', type: 'core::integer::u256' }],
        outputs: [{ type: 'core::integer::i32' }],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'to_price',
        inputs: [{ name: 'tick', type: 'core::integer::i32' }],
        outputs: [{ type: 'core::integer::u256' }],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'open',
        inputs: [
          {
            name: 'book_key',
            type: 'clober_cairo::libraries::book_key::BookKey',
          },
          { name: 'hook_data', type: 'core::array::Span::<core::felt252>' },
          { name: 'deadline', type: 'core::integer::u64' },
        ],
        outputs: [{ type: 'core::felt252' }],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'make',
        inputs: [
          { name: 'book_id', type: 'core::felt252' },
          { name: 'tick', type: 'core::integer::i32' },
          { name: 'quote_amount', type: 'core::integer::u256' },
          { name: 'hook_data', type: 'core::array::Span::<core::felt252>' },
          { name: 'deadline', type: 'core::integer::u64' },
        ],
        outputs: [{ type: 'core::felt252' }],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'limit',
        inputs: [
          { name: 'take_book_id', type: 'core::felt252' },
          { name: 'make_book_id', type: 'core::felt252' },
          { name: 'limit_price', type: 'core::integer::u256' },
          { name: 'tick', type: 'core::integer::i32' },
          { name: 'quote_amount', type: 'core::integer::u256' },
          {
            name: 'take_hook_data',
            type: 'core::array::Span::<core::felt252>',
          },
          {
            name: 'make_hook_data',
            type: 'core::array::Span::<core::felt252>',
          },
          { name: 'deadline', type: 'core::integer::u64' },
        ],
        outputs: [{ type: 'core::felt252' }],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'take',
        inputs: [
          { name: 'book_id', type: 'core::felt252' },
          { name: 'limit_price', type: 'core::integer::u256' },
          { name: 'quote_amount', type: 'core::integer::u256' },
          { name: 'max_base_amount', type: 'core::integer::u256' },
          { name: 'hook_data', type: 'core::array::Span::<core::felt252>' },
          { name: 'deadline', type: 'core::integer::u64' },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'spend',
        inputs: [
          { name: 'book_id', type: 'core::felt252' },
          { name: 'limit_price', type: 'core::integer::u256' },
          { name: 'base_amount', type: 'core::integer::u256' },
          { name: 'min_quote_amount', type: 'core::integer::u256' },
          { name: 'hook_data', type: 'core::array::Span::<core::felt252>' },
          { name: 'deadline', type: 'core::integer::u64' },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'claim',
        inputs: [
          { name: 'order_id', type: 'core::felt252' },
          { name: 'hook_data', type: 'core::array::Span::<core::felt252>' },
          { name: 'deadline', type: 'core::integer::u64' },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'cancel',
        inputs: [
          { name: 'order_id', type: 'core::felt252' },
          { name: 'left_quote_amount', type: 'core::integer::u256' },
          { name: 'hook_data', type: 'core::array::Span::<core::felt252>' },
          { name: 'deadline', type: 'core::integer::u64' },
        ],
        outputs: [],
        state_mutability: 'external',
      },
    ],
  },
  {
    type: 'impl',
    name: 'LockerImpl',
    interface_name: 'clober_cairo::interfaces::locker::ILocker',
  },
  {
    type: 'interface',
    name: 'clober_cairo::interfaces::locker::ILocker',
    items: [
      {
        type: 'function',
        name: 'lock_acquired',
        inputs: [
          {
            name: 'lock_caller',
            type: 'core::starknet::contract_address::ContractAddress',
          },
          { name: 'data', type: 'core::array::Span::<core::felt252>' },
        ],
        outputs: [{ type: 'core::array::Span::<core::felt252>' }],
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
    ],
  },
  {
    type: 'event',
    name: 'openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event',
    kind: 'enum',
    variants: [],
  },
  {
    type: 'event',
    name: 'clober_cairo::controller::Controller::Event',
    kind: 'enum',
    variants: [
      {
        name: 'ReentrancyGuardEvent',
        type: 'openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event',
        kind: 'flat',
      },
    ],
  },
] as const
