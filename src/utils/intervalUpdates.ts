import { ZERO_BD, ZERO_BI, ONE_BI } from './constants'
/* eslint-disable prefer-const */
import {
  UniswapDayData,
  Factory,
  Pool,
  PoolDayData,
  PoolMonthData,
  Token,
  TokenDayData,
  TokenHourData,
  Bundle,
  PoolHourData,
  TickDayData,
  Tick,
  UniswapHourData,
  PoolMinData,
  Pool5MinData,
  Pool30MinData,
  Token5MinData,
  Token30MinData,
  TokenMinData,
  TickHourData
} from './../types/schema'
import { FACTORY_ADDRESS } from './constants'
import { ethereum } from '@graphprotocol/graph-ts'

/**
 * Tracks global aggregate data over daily windows
 * @param event
 */
export function updateUniswapDayData(event: ethereum.Event): UniswapDayData {
  let uniswap = Factory.load(FACTORY_ADDRESS)
  let timestamp = event.block.timestamp.toI32()
  let dayID = timestamp / 86400 // rounded
  let dayStartTimestamp = dayID * 86400
  let uniswapDayData = UniswapDayData.load(dayID.toString())
  if (uniswapDayData === null) {
    uniswapDayData = new UniswapDayData(dayID.toString())
    uniswapDayData.date = dayStartTimestamp
    uniswapDayData.volumeETH = ZERO_BD
    uniswapDayData.volumeUSD = ZERO_BD
    uniswapDayData.volumeUSDUntracked = ZERO_BD
    uniswapDayData.feesUSD = ZERO_BD
  }
  uniswapDayData.tvlUSD = uniswap.totalValueLockedUSD
  uniswapDayData.txCount = uniswap.txCount
  uniswapDayData.save()
  return uniswapDayData as UniswapDayData
}

export function updateUniswapHourData(event: ethereum.Event): UniswapHourData {
  let uniswap = Factory.load(FACTORY_ADDRESS)
  let timestamp = event.block.timestamp.toI32()
  let dayID = timestamp / 3600 // rounded
  let dayStartTimestamp = dayID * 3600
  let uniswapHourData = UniswapHourData.load(dayID.toString())
  if (uniswapHourData === null) {
    uniswapHourData = new UniswapHourData(dayID.toString())
    uniswapHourData.date = dayStartTimestamp
    uniswapHourData.volumeETH = ZERO_BD
    uniswapHourData.volumeUSD = ZERO_BD
    uniswapHourData.volumeUSDUntracked = ZERO_BD
    uniswapHourData.feesUSD = ZERO_BD
  }
  uniswapHourData.tvlUSD = uniswap.totalValueLockedUSD
  uniswapHourData.txCount = uniswap.txCount
  uniswapHourData.save()
  return uniswapHourData as UniswapHourData
}

export function updatePoolMonthData(event: ethereum.Event): PoolMonthData {
  let timestamp = event.block.timestamp.toI32()
  let dayID = timestamp / 2592000
  let monthStartTimestamp = dayID * 2592000
  let dayPoolID = event.address
    .toHexString()
    .concat('-')
    .concat(dayID.toString())
  let pool = Pool.load(event.address.toHexString())
  let poolMonthData = PoolMonthData.load(dayPoolID)
  if (poolMonthData === null) {
    poolMonthData = new PoolMonthData(dayPoolID)
    poolMonthData.date = monthStartTimestamp
    poolMonthData.pool = pool.id
    // things that dont get initialized always
    poolMonthData.volumeToken0 = ZERO_BD
    poolMonthData.volumeToken1 = ZERO_BD
    poolMonthData.volumeUSD = ZERO_BD
    poolMonthData.feesUSD = ZERO_BD
    poolMonthData.txCount = ZERO_BI
    poolMonthData.feeGrowthGlobal0X128 = ZERO_BI
    poolMonthData.feeGrowthGlobal1X128 = ZERO_BI
    poolMonthData.open = pool.token0Price
    poolMonthData.high = pool.token0Price
    poolMonthData.low = pool.token0Price
    poolMonthData.close = pool.token0Price
  }

  if (pool.token0Price.gt(poolMonthData.high)) {
    poolMonthData.high = pool.token0Price
  }
  if (pool.token0Price.lt(poolMonthData.low)) {
    poolMonthData.low = pool.token0Price
  }

  poolMonthData.liquidity = pool.liquidity
  poolMonthData.sqrtPrice = pool.sqrtPrice
  poolMonthData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128
  poolMonthData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128
  poolMonthData.token0Price = pool.token0Price
  poolMonthData.token1Price = pool.token1Price
  poolMonthData.tick = pool.tick
  poolMonthData.tvlUSD = pool.totalValueLockedUSD
  poolMonthData.txCount = poolMonthData.txCount.plus(ONE_BI)
  poolMonthData.save()

  return poolMonthData as PoolMonthData
}

export function updatePoolDayData(event: ethereum.Event): PoolDayData {
  let timestamp = event.block.timestamp.toI32()
  let dayID = timestamp / 86400
  let dayStartTimestamp = dayID * 86400
  let dayPoolID = event.address
    .toHexString()
    .concat('-')
    .concat(dayID.toString())
  let pool = Pool.load(event.address.toHexString())
  let poolDayData = PoolDayData.load(dayPoolID)
  if (poolDayData === null) {
    poolDayData = new PoolDayData(dayPoolID)
    poolDayData.date = dayStartTimestamp
    poolDayData.pool = pool.id
    // things that dont get initialized always
    poolDayData.volumeToken0 = ZERO_BD
    poolDayData.volumeToken1 = ZERO_BD
    poolDayData.volumeUSD = ZERO_BD
    poolDayData.feesUSD = ZERO_BD
    poolDayData.txCount = ZERO_BI
    poolDayData.feeGrowthGlobal0X128 = ZERO_BI
    poolDayData.feeGrowthGlobal1X128 = ZERO_BI
    poolDayData.open = pool.token0Price
    poolDayData.high = pool.token0Price
    poolDayData.low = pool.token0Price
    poolDayData.close = pool.token0Price
  }

  if (pool.token0Price.gt(poolDayData.high)) {
    poolDayData.high = pool.token0Price
  }
  if (pool.token0Price.lt(poolDayData.low)) {
    poolDayData.low = pool.token0Price
  }

  poolDayData.liquidity = pool.liquidity
  poolDayData.sqrtPrice = pool.sqrtPrice
  poolDayData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128
  poolDayData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128
  poolDayData.token0Price = pool.token0Price
  poolDayData.token1Price = pool.token1Price
  poolDayData.tick = pool.tick
  poolDayData.tvlUSD = pool.totalValueLockedUSD
  poolDayData.txCount = poolDayData.txCount.plus(ONE_BI)
  poolDayData.save()

  return poolDayData as PoolDayData
}

export function updatePoolHourData(event: ethereum.Event): PoolHourData {
  let timestamp = event.block.timestamp.toI32()
  let hourIndex = timestamp / 3600 // get unique hour within unix history
  let hourStartUnix = hourIndex * 3600 // want the rounded effect
  let hourPoolID = event.address
    .toHexString()
    .concat('-')
    .concat(hourIndex.toString())
  let pool = Pool.load(event.address.toHexString())
  let poolHourData = PoolHourData.load(hourPoolID)
  if (poolHourData === null) {
    poolHourData = new PoolHourData(hourPoolID)
    poolHourData.periodStartUnix = hourStartUnix
    poolHourData.pool = pool.id
    // things that dont get initialized always
    poolHourData.volumeToken0 = ZERO_BD
    poolHourData.volumeToken1 = ZERO_BD
    poolHourData.volumeUSD = ZERO_BD
    poolHourData.txCount = ZERO_BI
    poolHourData.feesUSD = ZERO_BD
    poolHourData.feeGrowthGlobal0X128 = ZERO_BI
    poolHourData.feeGrowthGlobal1X128 = ZERO_BI
    poolHourData.open = pool.token0Price
    poolHourData.high = pool.token0Price
    poolHourData.low = pool.token0Price
    poolHourData.close = pool.token0Price
  }

  if (pool.token0Price.gt(poolHourData.high)) {
    poolHourData.high = pool.token0Price
  }
  if (pool.token0Price.lt(poolHourData.low)) {
    poolHourData.low = pool.token0Price
  }

  poolHourData.liquidity = pool.liquidity
  poolHourData.sqrtPrice = pool.sqrtPrice
  poolHourData.token0Price = pool.token0Price
  poolHourData.token1Price = pool.token1Price
  poolHourData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128
  poolHourData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128
  poolHourData.close = pool.token0Price
  poolHourData.tick = pool.tick
  poolHourData.tvlUSD = pool.totalValueLockedUSD
  poolHourData.txCount = poolHourData.txCount.plus(ONE_BI)
  poolHourData.save()

  // test
  return poolHourData as PoolHourData
}

export function updatePoolMinData(event: ethereum.Event): PoolMinData {
  let timestamp = event.block.timestamp.toI32()
  let hourIndex = timestamp / 60 // get unique hour within unix history
  let hourStartUnix = hourIndex * 60 // want the rounded effect
  let hourPoolID = event.address
    .toHexString()
    .concat('-')
    .concat(hourIndex.toString())
  let pool = Pool.load(event.address.toHexString())
  let poolMinData = PoolMinData.load(hourPoolID)
  if (poolMinData === null) {
    poolMinData = new PoolMinData(hourPoolID)
    poolMinData.periodStartUnix = hourStartUnix
    poolMinData.pool = pool.id
    // things that dont get initialized always
    poolMinData.volumeToken0 = ZERO_BD
    poolMinData.volumeToken1 = ZERO_BD
    poolMinData.volumeUSD = ZERO_BD
    poolMinData.txCount = ZERO_BI
    poolMinData.feesUSD = ZERO_BD
    poolMinData.feeGrowthGlobal0X128 = ZERO_BI
    poolMinData.feeGrowthGlobal1X128 = ZERO_BI
    poolMinData.open = pool.token0Price
    poolMinData.high = pool.token0Price
    poolMinData.low = pool.token0Price
    poolMinData.close = pool.token0Price
  }

  if (pool.token0Price.gt(poolMinData.high)) {
    poolMinData.high = pool.token0Price
  }
  if (pool.token0Price.lt(poolMinData.low)) {
    poolMinData.low = pool.token0Price
  }

  poolMinData.liquidity = pool.liquidity
  poolMinData.sqrtPrice = pool.sqrtPrice
  poolMinData.token0Price = pool.token0Price
  poolMinData.token1Price = pool.token1Price
  poolMinData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128
  poolMinData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128
  poolMinData.close = pool.token0Price
  poolMinData.tick = pool.tick
  poolMinData.tvlUSD = pool.totalValueLockedUSD
  poolMinData.txCount = poolMinData.txCount.plus(ONE_BI)
  poolMinData.save()

  // test
  return poolMinData as PoolMinData
}
export function updatePool5MinData(event: ethereum.Event): Pool5MinData {
  let timestamp = event.block.timestamp.toI32()
  let hourIndex = timestamp / 300 // get unique hour within unix history
  let hourStartUnix = hourIndex * 300 // want the rounded effect
  let hourPoolID = event.address
    .toHexString()
    .concat('-')
    .concat(hourIndex.toString())
  let pool = Pool.load(event.address.toHexString())
  let poolMinData = Pool5MinData.load(hourPoolID)
  if (poolMinData === null) {
    poolMinData = new Pool5MinData(hourPoolID)
    poolMinData.periodStartUnix = hourStartUnix
    poolMinData.pool = pool.id
    // things that dont get initialized always
    poolMinData.volumeToken0 = ZERO_BD
    poolMinData.volumeToken1 = ZERO_BD
    poolMinData.volumeUSD = ZERO_BD
    poolMinData.txCount = ZERO_BI
    poolMinData.feesUSD = ZERO_BD
    poolMinData.feeGrowthGlobal0X128 = ZERO_BI
    poolMinData.feeGrowthGlobal1X128 = ZERO_BI
    poolMinData.open = pool.token0Price
    poolMinData.high = pool.token0Price
    poolMinData.low = pool.token0Price
    poolMinData.close = pool.token0Price
  }

  if (pool.token0Price.gt(poolMinData.high)) {
    poolMinData.high = pool.token0Price
  }
  if (pool.token0Price.lt(poolMinData.low)) {
    poolMinData.low = pool.token0Price
  }

  poolMinData.liquidity = pool.liquidity
  poolMinData.sqrtPrice = pool.sqrtPrice
  poolMinData.token0Price = pool.token0Price
  poolMinData.token1Price = pool.token1Price
  poolMinData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128
  poolMinData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128
  poolMinData.close = pool.token0Price
  poolMinData.tick = pool.tick
  poolMinData.tvlUSD = pool.totalValueLockedUSD
  poolMinData.txCount = poolMinData.txCount.plus(ONE_BI)
  poolMinData.save()

  // test
  return poolMinData as Pool5MinData
}

export function updatePool30MinData(event: ethereum.Event): Pool30MinData {
  let timestamp = event.block.timestamp.toI32()
  let hourIndex = timestamp / 1800 // get unique hour within unix history
  let hourStartUnix = hourIndex * 1800 // want the rounded effect
  let hourPoolID = event.address
    .toHexString()
    .concat('-')
    .concat(hourIndex.toString())
  let pool = Pool.load(event.address.toHexString())
  let poolMinData = Pool30MinData.load(hourPoolID)
  if (poolMinData === null) {
    poolMinData = new Pool30MinData(hourPoolID)
    poolMinData.periodStartUnix = hourStartUnix
    poolMinData.pool = pool.id
    // things that dont get initialized always
    poolMinData.volumeToken0 = ZERO_BD
    poolMinData.volumeToken1 = ZERO_BD
    poolMinData.volumeUSD = ZERO_BD
    poolMinData.txCount = ZERO_BI
    poolMinData.feesUSD = ZERO_BD
    poolMinData.feeGrowthGlobal0X128 = ZERO_BI
    poolMinData.feeGrowthGlobal1X128 = ZERO_BI
    poolMinData.open = pool.token0Price
    poolMinData.high = pool.token0Price
    poolMinData.low = pool.token0Price
    poolMinData.close = pool.token0Price
  }

  if (pool.token0Price.gt(poolMinData.high)) {
    poolMinData.high = pool.token0Price
  }
  if (pool.token0Price.lt(poolMinData.low)) {
    poolMinData.low = pool.token0Price
  }

  poolMinData.liquidity = pool.liquidity
  poolMinData.sqrtPrice = pool.sqrtPrice
  poolMinData.token0Price = pool.token0Price
  poolMinData.token1Price = pool.token1Price
  poolMinData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128
  poolMinData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128
  poolMinData.close = pool.token0Price
  poolMinData.tick = pool.tick
  poolMinData.tvlUSD = pool.totalValueLockedUSD
  poolMinData.txCount = poolMinData.txCount.plus(ONE_BI)
  poolMinData.save()

  // test
  return poolMinData as Pool30MinData
}

export function updateTokenDayData(token: Token, event: ethereum.Event): TokenDayData {
  let bundle = Bundle.load('1')
  let timestamp = event.block.timestamp.toI32()
  let dayID = timestamp / 86400
  let dayStartTimestamp = dayID * 86400
  let tokenDayID = token.id
    .toString()
    .concat('-')
    .concat(dayID.toString())
  let tokenPrice = token.derivedETH.times(bundle.ethPriceUSD)

  let tokenDayData = TokenDayData.load(tokenDayID)
  if (tokenDayData === null) {
    tokenDayData = new TokenDayData(tokenDayID)
    tokenDayData.date = dayStartTimestamp
    tokenDayData.token = token.id
    tokenDayData.volume = ZERO_BD
    tokenDayData.volumeUSD = ZERO_BD
    tokenDayData.feesUSD = ZERO_BD
    tokenDayData.untrackedVolumeUSD = ZERO_BD
    tokenDayData.open = tokenPrice
    tokenDayData.high = tokenPrice
    tokenDayData.low = tokenPrice
    tokenDayData.close = tokenPrice
  }

  if (tokenPrice.gt(tokenDayData.high)) {
    tokenDayData.high = tokenPrice
  }

  if (tokenPrice.lt(tokenDayData.low)) {
    tokenDayData.low = tokenPrice
  }

  tokenDayData.close = tokenPrice
  tokenDayData.priceUSD = token.derivedETH.times(bundle.ethPriceUSD)
  tokenDayData.totalValueLocked = token.totalValueLocked
  tokenDayData.totalValueLockedUSD = token.totalValueLockedUSD
  tokenDayData.save()

  return tokenDayData as TokenDayData
}

export function updateTokenHourData(token: Token, event: ethereum.Event): TokenHourData {
  let bundle = Bundle.load('1')
  let timestamp = event.block.timestamp.toI32()
  let hourIndex = timestamp / 3600 // get unique hour within unix history
  let hourStartUnix = hourIndex * 3600 // want the rounded effect
  let tokenHourID = token.id
    .toString()
    .concat('-')
    .concat(hourIndex.toString())
  let tokenHourData = TokenHourData.load(tokenHourID)
  let tokenPrice = token.derivedETH.times(bundle.ethPriceUSD)

  if (tokenHourData === null) {
    tokenHourData = new TokenHourData(tokenHourID)
    tokenHourData.periodStartUnix = hourStartUnix
    tokenHourData.token = token.id
    tokenHourData.volume = ZERO_BD
    tokenHourData.volumeUSD = ZERO_BD
    tokenHourData.untrackedVolumeUSD = ZERO_BD
    tokenHourData.feesUSD = ZERO_BD
    tokenHourData.open = tokenPrice
    tokenHourData.high = tokenPrice
    tokenHourData.low = tokenPrice
    tokenHourData.close = tokenPrice
  }

  if (tokenPrice.gt(tokenHourData.high)) {
    tokenHourData.high = tokenPrice
  }

  if (tokenPrice.lt(tokenHourData.low)) {
    tokenHourData.low = tokenPrice
  }

  tokenHourData.close = tokenPrice
  tokenHourData.priceUSD = tokenPrice
  tokenHourData.totalValueLocked = token.totalValueLocked
  tokenHourData.totalValueLockedUSD = token.totalValueLockedUSD
  tokenHourData.save()

  return tokenHourData as TokenHourData
}

export function updateToken5MinData(token: Token, event: ethereum.Event): Token5MinData {
  let bundle = Bundle.load('1')
  let timestamp = event.block.timestamp.toI32()
  let hourIndex = timestamp / 300 // get unique hour within unix history
  let hourStartUnix = hourIndex * 300 // want the rounded effect
  let tokenHourID = token.id
    .toString()
    .concat('-')
    .concat(hourIndex.toString())
  let token5MinData = Token5MinData.load(tokenHourID)
  let tokenPrice = token.derivedETH.times(bundle.ethPriceUSD)

  if (token5MinData === null) {
    token5MinData = new Token5MinData(tokenHourID)
    token5MinData.periodStartUnix = hourStartUnix
    token5MinData.token = token.id
    token5MinData.volume = ZERO_BD
    token5MinData.volumeUSD = ZERO_BD
    token5MinData.untrackedVolumeUSD = ZERO_BD
    token5MinData.feesUSD = ZERO_BD
    token5MinData.open = tokenPrice
    token5MinData.high = tokenPrice
    token5MinData.low = tokenPrice
    token5MinData.close = tokenPrice
  }

  if (tokenPrice.gt(token5MinData.high)) {
    token5MinData.high = tokenPrice
  }

  if (tokenPrice.lt(token5MinData.low)) {
    token5MinData.low = tokenPrice
  }

  token5MinData.close = tokenPrice
  token5MinData.priceUSD = tokenPrice
  token5MinData.totalValueLocked = token.totalValueLocked
  token5MinData.totalValueLockedUSD = token.totalValueLockedUSD
  token5MinData.save()

  return token5MinData as Token5MinData
}

export function updateToken30MinData(token: Token, event: ethereum.Event): Token30MinData {
  let bundle = Bundle.load('1')
  let timestamp = event.block.timestamp.toI32()
  let hourIndex = timestamp / 1800 // get unique hour within unix history
  let hourStartUnix = hourIndex * 1800 // want the rounded effect
  let tokenHourID = token.id
    .toString()
    .concat('-')
    .concat(hourIndex.toString())
  let token5MinData = Token30MinData.load(tokenHourID)
  let tokenPrice = token.derivedETH.times(bundle.ethPriceUSD)

  if (token5MinData === null) {
    token5MinData = new Token30MinData(tokenHourID)
    token5MinData.periodStartUnix = hourStartUnix
    token5MinData.token = token.id
    token5MinData.volume = ZERO_BD
    token5MinData.volumeUSD = ZERO_BD
    token5MinData.untrackedVolumeUSD = ZERO_BD
    token5MinData.feesUSD = ZERO_BD
    token5MinData.open = tokenPrice
    token5MinData.high = tokenPrice
    token5MinData.low = tokenPrice
    token5MinData.close = tokenPrice
  }

  if (tokenPrice.gt(token5MinData.high)) {
    token5MinData.high = tokenPrice
  }

  if (tokenPrice.lt(token5MinData.low)) {
    token5MinData.low = tokenPrice
  }

  token5MinData.close = tokenPrice
  token5MinData.priceUSD = tokenPrice
  token5MinData.totalValueLocked = token.totalValueLocked
  token5MinData.totalValueLockedUSD = token.totalValueLockedUSD
  token5MinData.save()

  return token5MinData as Token30MinData
}

export function updateTokenMinData(token: Token, event: ethereum.Event): TokenMinData {
  let bundle = Bundle.load('1')
  let timestamp = event.block.timestamp.toI32()
  let hourIndex = timestamp / 60 // get unique hour within unix history
  let hourStartUnix = hourIndex * 60 // want the rounded effect
  let tokenHourID = token.id
    .toString()
    .concat('-')
    .concat(hourIndex.toString())
  let tokenHourData = TokenMinData.load(tokenHourID)
  let tokenPrice = token.derivedETH.times(bundle.ethPriceUSD)

  if (tokenHourData === null) {
    tokenHourData = new TokenMinData(tokenHourID)
    tokenHourData.periodStartUnix = hourStartUnix
    tokenHourData.token = token.id
    tokenHourData.volume = ZERO_BD
    tokenHourData.volumeUSD = ZERO_BD
    tokenHourData.untrackedVolumeUSD = ZERO_BD
    tokenHourData.feesUSD = ZERO_BD
    tokenHourData.open = tokenPrice
    tokenHourData.high = tokenPrice
    tokenHourData.low = tokenPrice
    tokenHourData.close = tokenPrice
  }

  if (tokenPrice.gt(tokenHourData.high)) {
    tokenHourData.high = tokenPrice
  }

  if (tokenPrice.lt(tokenHourData.low)) {
    tokenHourData.low = tokenPrice
  }

  tokenHourData.close = tokenPrice
  tokenHourData.priceUSD = tokenPrice
  tokenHourData.totalValueLocked = token.totalValueLocked
  tokenHourData.totalValueLockedUSD = token.totalValueLockedUSD
  tokenHourData.save()

  return tokenHourData as TokenMinData
}

export function updateTickDayData(tick: Tick, event: ethereum.Event): TickDayData {
  let timestamp = event.block.timestamp.toI32()
  let dayID = timestamp / 86400
  let dayStartTimestamp = dayID * 86400
  let tickDayDataID = tick.id.concat('-').concat(dayID.toString())
  let tickDayData = TickDayData.load(tickDayDataID)
  if (tickDayData === null) {
    tickDayData = new TickDayData(tickDayDataID)
    tickDayData.date = dayStartTimestamp
    tickDayData.pool = tick.pool
    tickDayData.tick = tick.id
  }
  tickDayData.liquidityGross = tick.liquidityGross
  tickDayData.liquidityNet = tick.liquidityNet
  tickDayData.volumeToken0 = tick.volumeToken0
  tickDayData.volumeToken1 = tick.volumeToken0
  tickDayData.volumeUSD = tick.volumeUSD
  tickDayData.feesUSD = tick.feesUSD
  tickDayData.feeGrowthOutside0X128 = tick.feeGrowthOutside0X128
  tickDayData.feeGrowthOutside1X128 = tick.feeGrowthOutside1X128

  tickDayData.save()

  return tickDayData as TickDayData
}

export function updateTickHourData(tick: Tick, event: ethereum.Event): TickHourData {
  let timestamp = event.block.timestamp.toI32()
  let dayID = timestamp / 3600
  let dayStartTimestamp = dayID * 3600
  let tickDayDataID = tick.id.concat('-').concat(dayID.toString())
  let tickHourData = TickHourData.load(tickDayDataID)
  if (tickHourData === null) {
    tickHourData = new TickHourData(tickDayDataID)
    tickHourData.date = dayStartTimestamp
    tickHourData.pool = tick.pool
    tickHourData.tick = tick.id
  }
  tickHourData.liquidityGross = tick.liquidityGross
  tickHourData.liquidityNet = tick.liquidityNet
  tickHourData.volumeToken0 = tick.volumeToken0
  tickHourData.volumeToken1 = tick.volumeToken0
  tickHourData.volumeUSD = tick.volumeUSD
  tickHourData.feesUSD = tick.feesUSD
  tickHourData.feeGrowthOutside0X128 = tick.feeGrowthOutside0X128
  tickHourData.feeGrowthOutside1X128 = tick.feeGrowthOutside1X128

  tickHourData.save()

  return tickHourData as TickHourData
}
