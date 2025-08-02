import { Uploader } from "@irys/upload";
import { Ethereum } from "@irys/upload-ethereum";

export interface IrysConfig {
  url: string;
  token: string;
  privateKey: string;
}

export interface UploadResult {
  id: string;
  url: string;
  timestamp: number;
  size: number;
}

export interface CostEstimate {
  atomic: string;
  formatted: string;
  currency: string;
}

export class IrysService {
  private uploader: any;
  private config: IrysConfig;

  constructor(config: IrysConfig) {
    this.config = config;
  }

  async initialize() {
    try {
      this.uploader = await Uploader(Ethereum, {
        url: this.config.url,
        token: this.config.token,
        key: this.config.privateKey,
      });
      console.log("Irys uploader initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Irys uploader:", error);
      throw error;
    }
  }

  async estimateCost(data: string | File | Buffer): Promise<CostEstimate> {
    if (!this.uploader) {
      throw new Error("Irys uploader not initialized. Call initialize() first.");
    }

    try {
      const size = typeof data === 'string' ? new TextEncoder().encode(data).length : 
                  data instanceof File ? data.size : data.length;
      
      const price = await this.uploader.getPrice(size);
      
      return {
        atomic: price.toString(),
        formatted: this.uploader.utils.fromAtomic(price),
        currency: this.uploader.token,
      };
    } catch (error) {
      console.error("Error estimating upload cost:", error);
      throw error;
    }
  }

  async fund(amount: string): Promise<any> {
    if (!this.uploader) {
      throw new Error("Irys uploader not initialized. Call initialize() first.");
    }

    try {
      const fundTx = await this.uploader.fund(
        this.uploader.utils.toAtomic(amount)
      );
      
      console.log(`Successfully funded ${amount} ${this.uploader.token} on Irys`);
      return fundTx;
    } catch (error) {
      console.error("Error funding Irys node:", error);
      throw error;
    }
  }

  async getBalance(): Promise<string> {
    if (!this.uploader) {
      throw new Error("Irys uploader not initialized. Call initialize() first.");
    }

    try {
      const atomicBalance = await this.uploader.getLoadedBalance();
      return this.uploader.utils.fromAtomic(atomicBalance);
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  async uploadData(
    data: string | File | Buffer,
    tags: { name: string; value: string }[] = []
  ): Promise<UploadResult> {
    if (!this.uploader) {
      throw new Error("Irys uploader not initialized. Call initialize() first.");
    }

    try {
      const defaultTags = [
        { name: "Content-Type", value: "application/json" },
        { name: "App-Name", value: "Focys" },
        { name: "App-Version", value: "1.0.0" },
        { name: "Upload-Date", value: new Date().toISOString() },
        ...tags,
      ];

      const receipt = await this.uploader.upload(data, { tags: defaultTags });
      
      return {
        id: receipt.id,
        url: `https://gateway.irys.xyz/${receipt.id}`,
        timestamp: Date.now(),
        size: receipt.size,
      };
    } catch (error) {
      console.error("Error uploading to Irys:", error);
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
