import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
import * as fs from 'fs';
import * as path from 'path';
import { Random } from '@cosmjs/crypto';

interface WalletInfo {
  address: string;
  privateKey: string;
}

class WalletGenerator {
  private readonly prefix: string;
  private readonly outputPath: string;

  constructor() {
    this.prefix = 'nillion';
    this.outputPath = path.join(process.cwd(), 'wallets.txt');
  }

  private async generateWallet(): Promise<WalletInfo> {
    // 生成随机私钥 (32字节)
    const privateKey = Random.getBytes(32);
    // 使用私钥创建钱包
    const wallet = await DirectSecp256k1Wallet.fromKey(privateKey, this.prefix);
    const [account] = await wallet.getAccounts();

    return {
      address: account.address,
      privateKey: Buffer.from(privateKey).toString('hex'),
    };
  }

  public async generateWallets(count: number): Promise<void> {
    console.log(`开始生成 ${count} 个钱包...`);

    const wallets: WalletInfo[] = [];
    for (let i = 0; i < count; i++) {
      const wallet = await this.generateWallet();
      wallets.push(wallet);
      console.log(`已生成第 ${i + 1} 个钱包`);
    }

    // 格式化输出内容
    const output = wallets
      .map((wallet) => `${wallet.address},${wallet.privateKey}\n`)
      .join('');

    // 写入文件
    fs.appendFileSync(this.outputPath, output, 'utf8');
    console.log(`已将钱包信息追加到: ${this.outputPath}`);
  }
}

async function main() {
  try {
    const generator = new WalletGenerator();
    await generator.generateWallets(10);
  } catch (error) {
    console.error('生成钱包时出错:', error);
  }
}

main();
