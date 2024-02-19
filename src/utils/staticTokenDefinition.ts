import {
  Address,
  BigInt,
} from "@graphprotocol/graph-ts"
  
// Initialize a Token Definition with the attributes
export class StaticTokenDefinition {
  address : Address
  symbol: string
  name: string
  decimals: BigInt

  // Initialize a Token Definition with its attributes
  constructor(address: Address, symbol: string, name: string, decimals: BigInt) {
    this.address = address
    this.symbol = symbol
    this.name = name
    this.decimals = decimals
  }

  // Get all tokens with a static defintion
  static getStaticDefinitions(): Array<StaticTokenDefinition> {
    let staticDefinitions = new Array<StaticTokenDefinition>(6)

    // Add DGD
    // let tokenDGD = new StaticTokenDefinition(
    //   Address.fromString('0xe0b7927c4af23765cb51314a0e0521a9645f0e2a'),
    //   'DGD',
    //   'DGD',
    //   BigInt.fromI32(9)
    // )
    // staticDefinitions.push(tokenDGD)

    // Add AAVE
    // let tokenAAVE = new StaticTokenDefinition(
    //   Address.fromString('0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'),
    //   'AAVE',
    //   'Aave Token',
    //   BigInt.fromI32(18)
    // )
    // staticDefinitions.push(tokenAAVE)

    // Add LIF
    // let tokenLIF = new StaticTokenDefinition(
    //   Address.fromString('0xeb9951021698b42e4399f9cbb6267aa35f82d59d'),
    //   'LIF',
    //   'Lif',
    //   BigInt.fromI32(18)
    // )
    // staticDefinitions.push(tokenLIF)

    // Add SVD
    // let tokenSVD = new StaticTokenDefinition(
    //   Address.fromString('0xbdeb4b83251fb146687fa19d1c660f99411eefe3'),
    //   'SVD',
    //   'savedroid',
    //   BigInt.fromI32(18)
    // )
    // staticDefinitions.push(tokenSVD)

    // Add TheDAO
    let tokenTheDAO = new StaticTokenDefinition(
      Address.fromString('0x7EbeF2A4b1B09381Ec5B9dF8C5c6f2dBECA59c73'),
      'WETH',
      'WETH',
      BigInt.fromI32(18)
    )
    staticDefinitions.push(tokenTheDAO)

    // Add HPB
    let tokenHPB = new StaticTokenDefinition(
      Address.fromString('0x18fB38404DADeE1727Be4b805c5b242B5413Fa40'),
      'USDC',
      'USDC',
      BigInt.fromI32(6)
    )
    staticDefinitions.push(tokenHPB)

    return staticDefinitions
  }

  // Helper for hardcoded tokens
  static fromAddress(tokenAddress: Address) : StaticTokenDefinition | null {
    let staticDefinitions = this.getStaticDefinitions()
    let tokenAddressHex = tokenAddress.toHexString()

    // Search the definition using the address
    for (let i = 0; i < staticDefinitions.length; i++) {
      let staticDefinition = staticDefinitions[i]
      if(staticDefinition.address.toHexString() == tokenAddressHex) {
        return staticDefinition
      }
    }

    // If not found, return null
    return null
  }

}