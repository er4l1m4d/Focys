import { WebIrys } from "@irys/sdk";

// Simple interface for Irys configuration
export interface IrysConfig {
  url: string;
  token: string;
  privateKey: string;
}

// Cost estimation result interface
interface CostEstimate {
  atomic: bigint;
  formatted: string;
  currency: string;
}

// Basic result interface for upload operations
export interface UploadResult {
  id: string;
  url: string;
  timestamp: number;
  size: number;
  data?: any;
}

// Simplified Irys service that can be expanded later
export class IrysService {
  private irys: WebIrys | null = null;
  private config: IrysConfig;

  constructor(config: IrysConfig) {
    this.config = config;
  }

  // Initialize the Irys client
  async initialize(): Promise<void> {
    try {
      this.irys = new WebIrys({
        url: this.config.url,
        token: this.config.token,
        wallet: {
          name: 'ethers',
          provider: {
            url: 'https://rpc.ankr.com/eth_goerli'
          }
        }
      });
      
      await this.irys.ready();
      console.log("Irys initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Irys:", error);
      throw error;
    }
  }

  async estimateCost(sizeInBytes: number): Promise<CostEstimate> {
    if (!this.irys) {
      throw new Error("Irys not initialized. Call initialize() first.");
    }
    
    const price = await this.irys.getPrice(sizeInBytes);
    return {
      atomic: BigInt(price.toString()),
      formatted: this.irys.utils.fromAtomic(price).toString(),
      currency: this.irys.token
    };
  }

  async fund(amount: string): Promise<any> {
    if (!this.irys) {
      throw new Error("Irys not initialized. Call initialize() first.");
    }
    
    const fundTx = await this.irys.fund(amount);
    return fundTx;
  }

  async getBalance(address: string = this.irys?.address || ''): Promise<string> {
    if (!this.irys) {
      throw new Error("Irys not initialized. Call initialize() first.");
    }
    
    if (!address) {
      address = this.irys.address;
    }
    
    const balance = await this.irys.getBalance(address);
    return balance.toString();
  }

  async uploadData(
    data: string | Buffer,
    tags: { name: string; value: string }[] = []
  ): Promise<UploadResult> {
    if (!this.irys) {
      throw new Error("Irys not initialized. Call initialize() first.");
    }
    
    try {
      const defaultTags = [
        { name: "Content-Type", value: "application/json" },
        { name: "App-Name", value: "Focys" },
        { name: "App-Version", value: "1.0.0" },
        { name: "Upload-Date", value: new Date().toISOString() },
        ...tags,
      ];

      const receipt = await this.irys.upload(data, { tags: defaultTags });
      
      // Get the data size from the receipt or calculate it if not available
      const dataSize = Buffer.byteLength(
        typeof data === 'string' ? data : data.toString()
      );
      
      return {
        id: receipt.id,
        url: `https://gateway.irys.xyz/${receipt.id}`,
        timestamp: Date.now(),
        size: dataSize,
        data: receipt
      };
    } catch (error) {
      console.error("Error uploading data:", error);
      throw error;
    }
  }
}

// Default configuration for testnet
export const defaultIrysConfig: IrysConfig = {
  url: "https://devnet.irys.xyz",
  token: "ethereum",
  privateKey: process.env.REACT_APP_IRYS_PRIVATE_KEY || "",
};

// Singleton instance
let irysInstance: IrysService | null = null;

export const getIrysService = (config: IrysConfig = defaultIrysConfig): IrysService => {
  if (!irysInstance) {
    irysInstance = new IrysService(config);
  }
  return irysInstance;
};
